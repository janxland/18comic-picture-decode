"use client";

import Button from "@/components/common/Button";
import Tab, { Tabs } from "@/components/Tab";
import { useRootStore } from "@/context/root-context";
import { useWatchContext } from "@/context/watch-context";
import { closeSnackbar, enqueueSnackbar } from "notistack";
import { useEffect, useState } from "react";
import { useTranslation } from "@/app/i18n";
import Title from "./Title";

// 剧集
export default function Episodes() {
    const { historyStore, playerStore } = useRootStore();
    const { detail, url: pageUrl, pkg, extension } = useWatchContext();
    const [episodesTabs, setEpisodesTabs] = useState<Tabs[]>([]);
    const { t } = useTranslation("watch");

    const handlePlay = (
        index: number,
        nextPlayers: { url: string; chapter: string }[]
    ) => {
        // 清空列表
        playerStore.clearPlayList();

        nextPlayers.map((item, _) => {
            playerStore.addNextPlay({
                url: item.url,
                chapter: item.chapter,
                pageUrl,
                pkg: pkg,
                title: detail.title,
                type: extension.type,
            });
        });

        // 切换播放
        playerStore.togglePlay(index);
        playerStore.toggleMini(false);
    };

    useEffect(() => {
        if (!detail.episodes) {
            return;
        }

        setEpisodesTabs(
            detail.episodes.map((item, _) => {
                return {
                    title: item.title,
                    content: (
                        <div className="max-h-80 overflow-auto p-1">
                            {item.urls.map((value, index) => {
                                return (
                                    <Button
                                        onClick={() =>
                                            handlePlay(
                                                index,
                                                item.urls.map((value, _) => ({
                                                    url: value.url,
                                                    chapter: `${item.title}|${value.name}`,
                                                }))
                                            )
                                        }
                                        key={index}
                                        className={`mr-1 mb-1 ${
                                            playerStore.currentPlay &&
                                            playerStore.currentPlay.url ===
                                                value.url
                                                ? "ring-2 ring-gray-700 dark:ring-gray-200"
                                                : ""
                                        }`}
                                    >
                                        {value.name}
                                    </Button>
                                );
                            })}
                        </div>
                    ),
                };
            })
        );
    }, [detail, playerStore.index]);

    useEffect(() => {
        // 获取历史记录提示播放到哪一集
        historyStore.getHistory(pageUrl, pkg).then((res) => {
            if (!res) {
                return;
            }
            enqueueSnackbar(t("last-watch", { chapter: res.chapter }), {
                persist: false,
                action: (key) => (
                    <Button
                        onClick={() => {
                            // 通过detail.episodes找到对应的url
                            const chap = res?.chapter.split("|");
                            if (!chap || chap.length !== 2) {
                                enqueueSnackbar(t("watch-record-error"), {
                                    variant: "error",
                                });
                                return;
                            }
                            detail.episodes?.map((item, _) => {
                                item.urls.map((value, index) => {
                                    if (
                                        item.title === chap[0] &&
                                        value.name === chap[1]
                                    ) {
                                        handlePlay(
                                            index,
                                            item.urls.map((value, _) => ({
                                                url: value.url,
                                                chapter: `${item.title}|${value.name}`,
                                            }))
                                        );
                                    }
                                });
                            });
                            closeSnackbar(key);
                        }}
                    >
                        {t("continue-watch")}
                    </Button>
                ),
            });
        });
    }, []);

    return (
        <div className="mb-6">
            <Title>{t("episodes")}</Title>
            <div>
                <Tab tabs={episodesTabs}></Tab>
            </div>
        </div>
    );
}
