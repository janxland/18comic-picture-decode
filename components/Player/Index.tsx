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
            transition={{ type: "tween" }}
            ref={playRef}
            layoutId="player"
            className={clsx(
                "fixed z-50 bg-neutral-100  dark:bg-neutral-700  lg:shadow-2xl ",
                {
                    "top-0 left-0 right-0 h-screen": !playerStore.mini,
                },
                {
                    "left-0 right-0 bottom-24 h-20 w-full lg:left-auto lg:right-4 lg:bottom-4 lg:max-w-md lg:w-auto lg:h-auto lg:max-h-64 overflow-hidden lg:rounded-lg":
                        playerStore.mini,
                }
            )}
        >
            {/* 操作栏 */}
            {playerStore.mini && (
                <div className="hidden lg:flex w-full justify-between bg-black text-white dark:bg-zinc-700  p-2">
                    <button onClick={() => playerStore.clearPlayList()}>
                        <X />
                    </button>
                    <button onClick={() => playerStore.toggleMini()}>
                        <ChevronUp />
                    </button>
                </div>
            )}
            {/* 播放器内容 */}
            <div className="flex flex-col lg:flex-row h-full">
                <div
                    className={clsx("w-full",{
                        "flex h-full justify-between items-center px-3 lg:p-0":
                            playerStore.mini,
                    })}
                >
                    {/* 关闭按钮 */}
                    {playerStore.mini && (
                        <button
                            onClick={() => playerStore.clearPlayList()}
                            className="flex items-center justify-center w-10 h-10 lg:hidden"
                        >
                            <X />
                        </button>
                    )}
                    <div
                        className={clsx(
                            "h-full flex justify-center relative",
                            {
                                "w-full": !playerStore.mini,
                                "w-48 overflow-hidden mx-6 lg:m-0 lg:w-auto": playerStore.mini,
                            }
                        )}
                    >
                        {player}
                    </div>
                    {/* 标题 */}
                    {playerStore.mini && (
                        <div className="flex items-center justify-center h-10 lg:hidden">
                            <div className="truncate">
                                {playerStore.currentPlay?.title}
                            </div>
                        </div>
                    )}
                    {/* 展开按钮 */}
                    {playerStore.mini && (
                        <button
                            onClick={() => playerStore.toggleMini()}
                            className="flex items-center justify-center w-10 h-10 lg:hidden"
                        >
                            <ChevronUp />
                        </button>
                    )}
                </div>
                <div
                    hidden={playerStore.mini}
                    className={clsx(
                        "w-full h-full transition-all flex flex-col bg-neutral-100  dark:bg-neutral-700  ",
                        {
                            "w-0 overflow-hidden": !playerStore.showPlayList,
                            "lg:w-1/4": playerStore.showPlayList,
                            "absolute right-0 lg:relative":
                                playerStore.floatPlayList,
                            hidden: playerStore.mini,
                        }
                    )}
                >
                    <div className="flex justify-between items-center px-2 h-10 flex-shrink-0">
                        <div >播放列表</div>
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
                    <div className="w-full overflow-y-auto">
                        {playerStore.playlist.map((item, index) => (
                            <div
                                key={item.url}
                                className="flex items-center px-2 my-2 cursor-pointer"
                                onClick={() => {
                                    playerStore.togglePlay(index);
                                }}
                            >
                                <div
                                    className={clsx(
                                        "rounded-xl flex transition truncate hover:bg-black hover:bg-opacity-40 w-full p-2",
                                        {
                                            "ring-2 ring-black dark:ring-white bg-black bg-opacity-20":
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
