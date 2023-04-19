import { motion } from "framer-motion";
import {
    ChevronDown,
    ChevronUp,
    Maximize,
    Minimize,
    SidebarClose,
    SidebarOpen,
    X,
} from "lucide-react";
import { ReactElement, useEffect, useRef, useState } from "react";
import BangumiPlayer from "./Bangumi";
import { useRootStore } from "@/context/root-context";
import { observer } from "mobx-react-lite";
import clsx from "clsx";
import MangaPlayer from "./Manga";
import FikushonPlayer from "./Fikushon";

const Player = observer(() => {
    const { playerStore } = useRootStore();
    const [player, setPlayer] = useState<ReactElement | undefined>(undefined);
    const playRef = useRef<HTMLDivElement>(null);

    // 如果全屏 取消body滚动
    useEffect(() => {
        if (!playerStore.mini) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "auto";
        }
    }, [playerStore.mini]);

    useEffect(() => {
        if (!playerStore.currentPlay) {
            return;
        }
        switch (playerStore.currentPlay.type) {
            case "bangumi":
                {
                    setPlayer(<BangumiPlayer />);
                }
                break;
            case "manga":
                {
                    setPlayer(<MangaPlayer />);
                }
                break;
            case "fikushon": {
                setPlayer(<FikushonPlayer />);
            }
        }
    }, [playerStore.currentPlay]);

    // 全屏切换
    useEffect(() => {
        if (!playRef.current) {
            return;
        }
        if (!document.fullscreenElement && playerStore.fullScreen) {
            playRef.current.requestFullscreen({
                navigationUI: "hide",
            });
            // 全屏时要收起播放列表
            playerStore.toggleShowPlayList(false);
            return;
        }
        document.exitFullscreen();
        playerStore.toggleShowPlayList(true);
    }, [playerStore.fullScreen]);

    // 如果是按esc退出全屏
    playRef.current?.addEventListener("fullscreenchange", () => {
        // 如果退出显示播放列表
        if (!document.fullscreenElement) {
            playerStore.toggleShowPlayList(true);
        }
    });

    // 切换迷你时需要先退出全屏
    useEffect(() => {
        if (!playerStore.mini) {
            return;
        }
        playerStore.toggleFullScreen(false);
    }, [playerStore.mini]);

    if (!playerStore.playlist.length) {
        return null;
    }

    return (
        <motion.div
            layout="preserve-aspect"
            ref={playRef}
            layoutId="player"
            className={clsx(
                "fixed right-0 z-50 bg-neutral-100  dark:bg-neutral-700  lg:shadow-2xl ",
                {
                    "top-0 left-0  h-screen": !playerStore.mini,
                },
                {
                    "left-0 bottom-24 h-16 w-full overflow-hidden lg:left-auto lg:right-4 lg:bottom-4 lg:h-auto lg:max-h-64 lg:w-auto lg:max-w-md lg:rounded-lg":
                        playerStore.mini,
                }
            )}
        >
            {/* 操作栏 */}
            {playerStore.mini && (
                <div className="hidden w-full justify-between bg-black p-2 text-white dark:bg-zinc-700  lg:flex">
                    <button onClick={() => playerStore.clearPlayList()}>
                        <X />
                    </button>
                    <button onClick={() => playerStore.toggleMini()}>
                        <ChevronUp />
                    </button>
                </div>
            )}
            {/* 播放器内容 */}
            <div
                className={clsx("flex h-full lg:flex-row", {
                    "flex-col": !playerStore.fullScreen,
                    "flex-row": playerStore.fullScreen,
                })}
            >
                <div
                    className={clsx("w-full", {
                        "flex h-full items-center justify-between lg:p-0":
                            playerStore.mini,
                    })}
                >
                    <div className="flex h-full items-center overflow-hidden">
                        <div
                            className={clsx(
                                "relative flex h-full justify-center",
                                {
                                    "w-full": !playerStore.mini,
                                    "mr-2 w-48 overflow-hidden lg:m-0 lg:w-auto":
                                        playerStore.mini,
                                }
                            )}
                        >
                            {player}
                        </div>
                        {/* 标题 */}
                        {playerStore.mini && (
                            <div className="flex h-10 items-center justify-center lg:hidden">
                                <div className="truncate">
                                    {playerStore.currentPlay?.title}
                                </div>
                            </div>
                        )}
                    </div>
                    <div className="flex">
                        {/* 展开按钮 */}
                        {playerStore.mini && (
                            <button
                                onClick={() => playerStore.toggleMini()}
                                className="flex h-10 w-10 items-center justify-center lg:hidden"
                            >
                                <ChevronUp />
                            </button>
                        )}
                        {/* 关闭按钮 */}
                        {playerStore.mini && (
                            <button
                                onClick={() => playerStore.clearPlayList()}
                                className="flex h-10 w-10 items-center justify-center lg:hidden"
                            >
                                <X />
                            </button>
                        )}
                    </div>
                </div>
                <div
                    hidden={playerStore.mini}
                    className={clsx(
                        "flex h-full w-full flex-col overflow-auto bg-neutral-100 transition-all dark:bg-neutral-700 lg:overflow-hidden",
                        {
                            "w-0 overflow-hidden": !playerStore.showPlayList,
                            "lg:w-1/4": playerStore.showPlayList,
                            "absolute right-0 lg:relative":
                                playerStore.floatPlayList,
                            hidden: playerStore.mini,
                        }
                    )}
                >
                    <div className="flex h-10 flex-shrink-0 items-center justify-between px-2">
                        <div>播放列表</div>
                        <div className="flex">
                            <button
                                onClick={() => playerStore.toggleShowPlayList()}
                            >
                                {playerStore.showPlayList ? (
                                    <SidebarOpen />
                                ) : (
                                    <SidebarClose />
                                )}
                            </button>
                            <button
                                className="mx-3"
                                onClick={() => playerStore.toggleFullScreen()}
                            >
                                {playerStore.fullScreen ? (
                                    <Minimize />
                                ) : (
                                    <Maximize />
                                )}
                            </button>
                            <button onClick={() => playerStore.toggleMini()}>
                                <ChevronDown />
                            </button>
                        </div>
                    </div>
                    <div className="w-full h-full lg:overflow-auto">
                        {playerStore.playlist.map((item, index) => (
                            <div
                                key={item.url}
                                className="my-2 flex cursor-pointer items-center px-2"
                                onClick={() => {
                                    playerStore.togglePlay(index);
                                }}
                            >
                                <div
                                    className={clsx(
                                        "flex w-full truncate rounded-xl p-2 transition hover:bg-black hover:bg-opacity-40",
                                        {
                                            "bg-black bg-opacity-20 ring-2 ring-black dark:ring-white":
                                                item.url ===
                                                playerStore.currentPlay?.url,
                                        }
                                    )}
                                >
                                    {item.title} {item.chapter}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </motion.div>
    );
});

export default Player;
