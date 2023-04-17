"use client";

import Button from "@/components/common/Button";
import BangumiPlayer from "@/components/Player/Bangumi";
import FikushonPlayer from "@/components/Player/Fikushon";
import MangaPlayer from "@/components/Player/Manga";
import { useWatchContext } from "@/context/watch-context";
import clsx from "clsx";
import { X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

// 播放
export default function Player() {
    const {
        watchData,
        extension,
        nextChapter,
        prevChapter,
        showPlayer,
        fullscreenWeb,
        setWatchData,
    } = useWatchContext();
    const [player, setPlayer] = useState<JSX.Element | undefined>(undefined);
    const playerContainer = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (!watchData) {
            return;
        }
        switch (extension.type) {
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
        // 平滑滚动到顶部
        setTimeout(() => {
            playerContainer.current?.scrollTo({
                top: 0,
                behavior: "smooth",
            });
        }, 100);
    }, [watchData, nextChapter, prevChapter]);

    if (!showPlayer) {
        return <></>;
    }

    const handleClose = () => {
        setWatchData((data) => {
            return {
                ...data!,
                showPlayer: false,
            };
        });
    };

    return (
        <div className="fixed left-0 right-0 top-0 bottom-0 z-50">
            <div
                className="fixed left-0 right-0 top-0 bottom-0 -z-20 bg-black opacity-75"
                onClick={handleClose}
            ></div>
            <div
                ref={playerContainer}
                className={clsx("absolute w-full md:w-2/3", {
                    "bg-white dark:bg-black": extension.type !== "bangumi",
                    "left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2":
                        fullscreenWeb !== true,
                })}
            >
                {player}
            </div>
            <div className="fixed right-0 bottom-0 p-2">
                <Button onClick={handleClose}>
                    <X />
                </Button>
            </div>
        </div>
    );
}
