import LoadingImg from "@/components/common/LoadingImg";
import SkeletonBlock from "@/components/SkeletonBlock";
import { useRootStore } from "@/context/root-context";
import { useWatchContext } from "@/context/watch-context";
import { Credits as TypeCredits } from "@/types/tmdb";
import { useEffect, useState } from "react";
import { useTranslation } from "@/app/i18n";
import Title from "./Title";
import { useQuery } from "@tanstack/react-query";

// 主演
export default function Credits() {
    const { tmdbStore } = useRootStore();
    const { tmdbId, mediaType: media_type } = useWatchContext();
    const { t } = useTranslation(["detail", "common"]);

    const { data, isLoading } = useQuery({
        queryKey: ["credits", tmdbId, media_type],
        queryFn: () => tmdbStore.getCredits(tmdbId!, media_type!)
    });

    if (!tmdbId) {
        return null;
    }

    if (isLoading) {
        return <SkeletonBlock className="mb-6 h-56" />;
    }

    if (!data || data.cast.length === 0) {
        return null;
    }

    return (
        <div className="mb-3">
            <Title>{t("starring")}</Title>
            <div className="flex overflow-auto pb-3 scrollbar-none">
                {data.cast.map((item, index) => (
                    <div
                        key={index}
                        className="mr-3 flex-shrink-0"
                        style={{ width: "130px" }}
                    >
                        {tmdbStore.getImageUrl(item.profile_path) ? (
                            <LoadingImg
                                className="w-full rounded-lg"
                                errorview={
                                    <div
                                        className="flex items-center justify-center"
                                        style={{
                                            width: "130px",
                                            height: "190px"
                                        }}
                                    >
                                        {t("load-error")}
                                    </div>
                                }
                                loadview={
                                    <SkeletonBlock
                                        style={{
                                            width: "130px",
                                            height: "190px"
                                        }}
                                    />
                                }
                                src={tmdbStore.getImageUrl(item.profile_path)}
                            />
                        ) : (
                            <div
                                className="flex items-center justify-center"
                                style={{ width: "130px", height: "190px" }}
                            >
                                {t("no-image")}
                            </div>
                        )}
                        <a
                            href={`https://www.themoviedb.org/person/${item.id}`}
                            target="_blank"
                            rel="noreferrer"
                        >
                            <div className="break-keep p-3 text-sm ">
                                <div className="font-bold">{item.name}</div>
                                <div>{item.character}</div>
                            </div>
                        </a>
                    </div>
                ))}
            </div>
        </div>
    );
}
