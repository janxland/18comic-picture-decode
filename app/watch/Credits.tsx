import LoadingImg from "@/components/common/LoadingImg";
import SkeletonBlock from "@/components/SkeletonBlock";
import { useRootStore } from "@/context/root-context";
import { useWatchContext } from "@/context/watch-context";
import { Credits as TypeCredits } from "@/types/tmdb";
import { useEffect, useState } from "react";
import { useTranslation } from "@/app/i18n";
import Title from "./Title";

// 主演
export default function Credits() {
    const { tmdbStore } = useRootStore();
    const { tmdbId, mediaType: media_type } = useWatchContext();
    const [cast, setCast] = useState<TypeCredits.Cast[]>([]);
    const { t } = useTranslation("watch");
    useEffect(() => {
        if (!tmdbId) {
            return;
        }
        tmdbStore.getCredits(tmdbId, media_type!).then((res) => {
            if (res) {
                setCast(res.cast);
            }
        });
    }, [tmdbId]);

    if (!tmdbId) {
        return null;
    }

    if (cast.length) {
        <SkeletonBlock className="mb-6 h-56" />;
    }

    return (
        <div className="mb-3">
            <Title>{t("starring")}</Title>
            <div className="flex overflow-auto pb-3 scrollbar-none">
                {cast.map((item, index) => (
                    <div
                        key={index}
                        className="mr-3 flex-shrink-0"
                        style={{ width: "130px" }}
                    >
                        {tmdbStore.getImageUrl(item.profile_path) ? (
                            <LoadingImg
                                className="w-full rounded-lg"
                                errorView={
                                    <div
                                        className="flex items-center justify-center"
                                        style={{
                                            width: "130px",
                                            height: "190px",
                                        }}
                                    >
                                        {" "}
                                        加载错误{" "}
                                    </div>
                                }
                                loadView={
                                    <SkeletonBlock
                                        style={{
                                            width: "130px",
                                            height: "190px",
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
                                {" "}
                                无图片{" "}
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
