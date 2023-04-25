"use client";

import Button from "@/components/common/Button";
import Tab, { Tabs } from "@/components/Tab";
import { useRootStore } from "@/context/root-context";
import { useWatchContext } from "@/context/watch-context";
import { closeSnackbar, enqueueSnackbar } from "notistack";
import React, { ReactNode, useEffect, useRef, useState } from "react";
import { useTranslation } from "@/app/i18n";
import Title from "./Title";
import clsx from "clsx";
import { MoreVertical } from "lucide-react";
import { observer } from "mobx-react-lite";

// 剧集
const Episodes = observer(() => {
    const { historyStore, playerStore } = useRootStore();
    const { detail, url: pageUrl, pkg, extension } = useWatchContext();
    const [episodesTabs, setEpisodesTabs] = useState<Tabs[]>([]);
    const { t } = useTranslation("watch");
    const [menu, setMenu] = useState<ReactNode | null>(null);
    const menuRef = useRef<HTMLDivElement>(null);

    const handlePlay = (
        index: number,
        nextPlayers: { url: string; chapter: string }[]
    ) => {
        // 清空列表
        playerStore.clearPlayList();

        nextPlayers.map((item, _) => {
            playerStore.pushPlayer({
                url: item.url,
                chapter: item.chapter,
                pageUrl,
                pkg,
                title: detail.title,
                type: extension.type
            });
        });

        // 切换播放
        playerStore.togglePlay(index);
        playerStore.toggleMini(false);
    };

    const handleMore = (e: React.MouseEvent<HTMLDivElement>, url: string, chapter: string) => {

        const play = {
            url,
            pageUrl,
            chapter,
            title: detail.title,
            type: extension.type,
            pkg
        };


        const handleClose = () => {
            setMenu(null);
        };

        // 获取当前window的宽度
        const windowWidth = window.innerWidth;

        const menus: { text: string, action: () => void }[] = [
            {
                text: "添加到接下来",
                action: () => {
                    playerStore.addNextPlay(play);
                }
            }, {
                text: "添加到列队",
                action: () => {
                    playerStore.pushPlayer(play);
                }
            }
        ];


        setMenu(
            <div ref={menuRef}>
                <div className="fixed left-0 right-0 bottom-0 top-0 bg-black opacity-50 md:opacity-0"
                     style={{
                         zIndex: "60"
                     }}
                     onClick={handleClose}></div>
                <div
                    className="fixed bottom-0 md:bottom-auto rounded-t-lg w-full md:absolute md:rounded-lg text-white bg-black md:w-48 overflow-hidden shadow-2xl"
                    onClick={handleClose}
                    style={{
                        top: windowWidth > 1024 ? e.currentTarget.offsetTop + 30 : "auto",
                        left: windowWidth > 1024 ? e.currentTarget.offsetLeft - 30 : 0,
                        zIndex: "70"
                    }}
                >
                    {
                        menus.map((item, index) => (
                            <div key={index} className="mb-1 p-3 cursor-pointer hover:bg-neutral-800"
                                 onClick={item.action}>{item.text} </div>
                        ))
                    }
                </div>
            </div>
        );


        //窗口发生变化时，移除menu
        window.addEventListener("resize", () => {
            handleClose();
        });
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
                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2 p-1">
                            {item.urls.map((value, index) => {
                                // @ts-ignore
                                return (
                                    <div
                                        className={clsx(
                                            "flex justify-between items-center bg-neutral-200 text-black dark:text-white dark:bg-black dark:bg-opacity-60 h-14 overflow-hidden rounded-lg",
                                            {
                                                "ring-2 ring-gray-700 dark:ring-gray-200": playerStore.currentPlay?.url === value.url
                                            }
                                        )}
                                        key={index}>
                                        <span
                                            className="cursor-pointer w-full h-full flex items-center p-2 hover:bg-neutral-300 dark:hover:bg-neutral-800"
                                            onClick={() =>
                                                handlePlay(
                                                    index,
                                                    item.urls.map((value, _) => ({
                                                        url: value.url,
                                                        chapter: `${item.title}|${value.name}`
                                                    }))
                                                )
                                            }
                                        >
                                        {value.name}
                                        </span>
                                        <div className="cursor-pointer hover:opacity-60" onClick={(e) => {
                                            handleMore(e, value.url, `${item.title}|${value.name}`);
                                        }}>
                                            <MoreVertical />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )
                };
            })
        );
    }, [detail, playerStore.currentPlay]);

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
                                    variant: "error"
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
                                                chapter: `${item.title}|${value.name}`
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
                )
            });
        });
    }, []);

    return (
        <div className="mb-6">
            <Title>{t("episodes")}</Title>
            <div>
                <Tab tabs={episodesTabs}></Tab>
            </div>
            {menu}
        </div>
    );
});

export default Episodes;