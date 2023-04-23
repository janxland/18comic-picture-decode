"use client";

import LoadingImg from "@/components/common/LoadingImg";
import Modal from "@/components/Modal";
import { useRootStore } from "@/context/root-context";
import { useWatchContext } from "@/context/watch-context";
import { loveDB, tmdbDB } from "@/db";
import { Detail } from "@/types/extension";
import { ExternalLink, Heart, MoreHorizontal } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "@/app/i18n";

export default function BaseDetail() {
    const { tmdbStore } = useRootStore();
    const {
        pkg,
        url,
        detail,
        extension,
        setWatchData,
        tmdbId,
        mediaType: media_type,
    } = useWatchContext();
    const [metaData, setMetaData] = useState<Map<string, string>>(new Map());
    const [overview, setOverview] = useState<string | undefined>(detail.desc);
    const [showMore, setShowMore] = useState<boolean>(false);
    const [genres, setGenres] = useState<string[]>();
    const { t } = useTranslation("watch");

    // 获取 TMDB ID
    // 也许可以获取个背景（（就不判断了
    useEffect(() => {
        // 先获取本地的
        tmdbDB.getTMDB(pkg, url).then((tmdbData) => {
            if (tmdbData) {
                setWatchData((data) => {
                    return {
                        ...data!,
                        tmdbId: tmdbData.tmdbId,
                        mediaType: tmdbData.mediaType,
                    };
                });
                return;
            }
            // 本地没有，就去 TMDB 获取
            tmdbStore.search(detail.title).then((res) => {
                if (!res || res.length === 0) {
                    return;
                }
                setWatchData((data) => {
                    return {
                        ...data!,
                        tmdbId: res[0].id,
                        mediaType: res[0].media_type,
                    };
                });
            });
        });
    }, []);

    // 通过 TMDB 获取详情
    useEffect(() => {
        if (!tmdbId || extension.type !== "bangumi") {
            return;
        }
        tmdbStore.getDetails(tmdbId, media_type!).then((res) => {
            const map = new Map<string, string>();
            if (res) {
                map.set(
                    t("detail.original-name"),
                    res.original_name ?? res.original_title
                );
                map.set(t("detail.language"), res.original_language);
                map.set(
                    t("detail.release-date"),
                    res.first_air_date ?? res.release_date
                );
                map.set(t("detail.status"), res.status);
                map.set(
                    t("detail.production-company"),
                    res.production_companies.map((c) => c.name).join(",")
                );
                map.set(
                    t("detail.production-country"),
                    res.production_countries.map((c) => c.name).join(",")
                );
                map.set(t("detail.vote-average"), res.vote_average.toString());
                map.set(t("detail.vote-count"), res.vote_count.toString());
                if (media_type === "movie") {
                    map.set(t("detail.runtime"), res.runtime.toString());
                } else {
                    map.set(
                        t("detail.episode-run-time"),
                        res.episode_run_time.join(",")
                    );
                    map.set(
                        t("detail.number-of-episodes"),
                        res.number_of_episodes.toString()
                    );
                    map.set(
                        t("detail.number-of-seasons"),
                        res.number_of_seasons.toString()
                    );
                }
                map.set(
                    t("detail.spoken-language"),
                    res.spoken_languages.map((c) => c.name).join(",")
                );
                map.set(t("detail.popularity"), res.popularity.toString());
                map.set(t("detail.homepage"), res.homepage ?? "");
                setOverview(res.overview);
                setGenres(res.genres.map((g) => g.name));
            }
            setMetaData(map);

            // 设置背景
            setWatchData((data) => {
                return {
                    ...data!,
                    background: tmdbStore.getImageUrl(res!.backdrop_path),
                };
            });
        });
    }, [tmdbId]);

    return (
        <div className="mb-5 flex  md:mb-16 items-end ">
            <div className="w-56 flex-col items-center mb-0 md:flex md:w-1/4 lg:w-1/5">
                <LoadingImg
                    className="mb-3 rounded-xl shadow-2xl ring-4 ring-gray-300 md:block w-full"
                    src={detail?.cover}
                    alt={detail.title}
                />
                <div className="mt-3 flex w-full flex-col justify-between md:mt-0 xl:flex-row">
                    <LoveButton
                        pkg={pkg}
                        url={url}
                        data={detail}
                        type={extension.type}
                    ></LoveButton>
                </div>
            </div>
            <div className="w-full ml-5 md:mt-10 md:w-3/4 lg:w-4/5">
                <div className="mb-1 text-xl md:text-3xl">{detail?.title}</div>
                <div className="mb-3 text-gray-500 dark:text-white dark:text-opacity-60">
                    {genres?.map((g, index) => (
                        <span key={index} className="mr-1">
                            {g}
                        </span>
                    ))}
                </div>
                <div className="max-h-48 overflow-hidden">
                    <div className="mb-3 hidden md:block" >
                        {Array.from(metaData.entries()).map((item, index) => (
                            <p key={index} className="mb-1">
                                <span className="font-bold">{item[0]}</span>
                                {item[1]}
                            </p>
                        ))}
                        {/* 如果tmdb找不到数据就会显示扩展的元数据 */}
                        {detail.metadata &&
                            Object.keys(detail.metadata).map((key, index) => (
                                <p key={index} className="mb-1">
                                    <span className="font-bold">{key}: </span>
                                    {detail.metadata![key]}
                                </p>
                            ))}
                        <p className="mb-1 flex items-center">
                            <span className="mr-2 font-bold">
                                {t("origin-site")}
                            </span>
                            <a
                                href={extension.webSite + url}
                                target="_blank"
                                rel="noreferrer"
                            >
                                <ExternalLink size={20} />
                            </a>
                        </p>
                    </div>
                    <div className="max-h-24 overflow-auto md:h-full">
                        <p>{overview}</p>
                    </div>
                </div>
                {/* 展开按钮 */}
                <div className="flex ">
                    <button
                        className="text-gray-500 dark:text-white dark:text-opacity-60 "
                        onClick={() => setShowMore(!showMore)}
                    >
                        <MoreHorizontal />
                    </button>
                </div>
                <Modal
                    show={showMore}
                    onClose={() => {
                        setShowMore(false);
                    }}
                    title={detail.title}
                >
                    <div className="mb-3">
                        {metaData.size > 0 && (
                                <h3 className="mb-3 border-b pb-2 font-bold">
                                    {t("from-tmdb")}
                                </h3>
                            ) && (
                                <div className="mb-3 grid grid-cols-2">
                                    {Array.from(metaData.entries()).map(
                                        (item, index) => (
                                            <p key={index} className="mb-1">
                                                <span className="font-bold">
                                                    {item[0]}
                                                </span>
                                                {item[1]}
                                            </p>
                                        )
                                    )}
                                </div>
                            )}
                        <h3 className="mb-3 border-b pb-2 font-bold">
                            {t("from-extension")}
                        </h3>
                        {detail.metadata &&
                            Object.keys(detail.metadata).map((key, index) => (
                                <p key={index} className="mb-1">
                                    <span className="font-bold">{key}: </span>
                                    {detail.metadata![key]}
                                </p>
                            ))}
                        <p className="mb-1 flex items-center">
                            <span className="mr-2 font-bold">
                                {t("origin-site")}
                            </span>
                            <a
                                href={extension.webSite + url}
                                target="_blank"
                                rel="noreferrer"
                            >
                                <ExternalLink size={20} />
                            </a>
                        </p>
                    </div>
                    <div className="max-h-52 overflow-auto md:h-full">
                        <p>{overview}</p>
                    </div>
                </Modal>
            </div>
        </div>
    );
}

function LoveButton({
    pkg,
    url,
    type,
    data,
}: {
    pkg: string;
    url: string;
    type: any;
    data: Detail;
}) {
    const [isLove, setIsLove] = useState(false);
    const { t } = useTranslation("watch");
    useEffect(() => {
        checkLove();
    }, []);

    const handleLove = () => {
        loveDB
            .loveOrUnLove({
                package: pkg,
                url: url,
                title: data.title,
                cover: data.cover,
                type: type,
            })
            .finally(() => {
                checkLove();
            });
    };

    const checkLove = () => {
        loveDB.isLove(pkg, url).then((res) => {
            setIsLove(res);
        });
    };

    return (
        <button
            onClick={handleLove}
            className="w-full rounded-xl border bg-black pl-4 pr-4 pt-2 pb-2 text-lg text-white focus:ring-2 focus:ring-gray-500"
        >
            <div className="flex items-center justify-center">
                <Heart className="mr-1" fill={isLove ? "#fff" : ""}></Heart>
                {isLove ? t("collected") : t("collect")}
            </div>
        </button>
    );
}
