import { useRootStore } from "@/context/root-context";
import { MangaWatch } from "@/types/extension";
import { useQuery } from "@tanstack/react-query";
import clsx from "clsx";
import { ChevronDown, ChevronFirst, ChevronLast, List } from "lucide-react";
import { observer } from "mobx-react-lite";
import { useEffect } from "react";
import Button from "../common/Button";
import LazyElement from "../common/LazyElement";
import LoadingImg from "../common/LoadingImg";
import ErrorView from "../ErrorView";
import LoadingBox from "../LoadingBox";
import Control from "./control";

const MangaPlayer = observer(() => {
    const { extensionStore, historyStore, playerStore } = useRootStore();
    const { pkg, pageUrl, title, chapter, url, type } = playerStore.currentPlay;
    const extension = extensionStore.getExtension(pkg);

    const { data, error, isLoading } = useQuery({
        queryKey: ["manga", url, pkg],
        queryFn: () => extension?.watch(url) as MangaWatch,
    });

    useEffect(() => {
        if (!data || type !== "manga") {
            return;
        }
        // 切换列表为悬浮模式
        playerStore.toggleFloatPlayList(true);
        playerStore.toggleShowPlayList(false);

        historyStore.addHistory({
            package: pkg,
            url: pageUrl,
            title,
            chapter,
            type: "manga",
            cover: data.urls[0],
        });
    }, [data]);

    if (isLoading) {
        return <LoadingBox className="!h-screen"></LoadingBox>;
    }

    if (error) {
        return <ErrorView error={error} />;
    }

    if (!data) {
        return <ErrorView error={new Error("No data")} />;
    }

    if (type !== "manga") {
        return null;
    }

    return (
        <>
            <div
                className={clsx(
                    "relative max-w-5xl text-center",
                    {
                        "max-h-screen overflow-auto": !playerStore.mini,
                    },
                    // mini 时不显示滚动条 且不能滚动 只做预览
                    {
                        "max-h-56 overflow-hidden scrollbar-none":
                            playerStore.mini,
                    }
                )}
            >
                <div className="mb-16 w-full md:w-auto">
                    {data.urls.map((url, index) => {
                        return (
                            <LazyElement
                                key={index}
                                placeholder={
                                    <div className="h-40 w-full">
                                        <LoadingBox></LoadingBox>
                                    </div>
                                }
                            >
                                <LoadingImg
                                    loadview={
                                        <div className="h-40 w-full">
                                            <LoadingBox></LoadingBox>
                                        </div>
                                    }
                                    className="m-auto"
                                    src={url}
                                    alt="Manga"
                                    referrerPolicy="no-referrer"
                                />
                            </LazyElement>
                        );
                    })}
                </div>
                {/* mini 时显示的按钮 */}
                {playerStore.mini && (
                    <div className="absolute left-0 right-0 bottom-0 top-0 opacity-0 hover:opacity-100">
                        <div className="flex h-full w-full items-center justify-center bg-black bg-opacity-60">
                            <Button
                                onClick={() => playerStore.toggleMini(false)}
                            >
                                继续观看
                            </Button>
                        </div>
                    </div>
                )}
            </div>
            <Control />
        </>
    );
});
export default MangaPlayer;
