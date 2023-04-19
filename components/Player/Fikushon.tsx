import { useRootStore } from "@/context/root-context";
import { FikushonWatch } from "@/types/extension";
import { useQuery } from "@tanstack/react-query";
import clsx from "clsx";
import { observer } from "mobx-react-lite";
import { useEffect } from "react";
import Button from "../common/Button";
import ErrorView from "../ErrorView";
import LoadingBox from "../LoadingBox";
import Control from "./control";

const FikushonPlayer = observer(() => {
    const { extensionStore, historyStore, playerStore } = useRootStore();
    const { pkg, pageUrl, title, chapter, url, type } = playerStore.currentPlay;
    const extension = extensionStore.getExtension(pkg);

    const { data, error, isLoading } = useQuery({
        queryKey: ["fikushon", url, pkg],
        queryFn: () => extension?.watch(url) as FikushonWatch,
    });

    useEffect(() => {
        if (!data || type !== "fikushon") {
            return;
        }

        playerStore.toggleFloatPlayList(true);
        playerStore.toggleShowPlayList(false);

        historyStore.addHistory({
            package: pkg,
            url: pageUrl,
            title: title,
            chapter: chapter!,
            type: "fikushon",
            cover: data.content[0],
        });
    }, [data]);

    if (type !== "fikushon") {
        return null;
    }

    if (isLoading) {
        return <LoadingBox className="!h-screen" ></LoadingBox>;
    }

    if (error) {
        return <ErrorView error={error} />;
    }

    if (!data) {
        return <ErrorView error={new Error("No data")} />;
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
                <div className="mb-16 max-w-5xl bg-slate-200 p-3 text-left dark:bg-zinc-700">
                    <div className="mb-6 text-center">
                        <h1 className="text-2xl font-bold">{data.title}</h1>
                        <h2 className="text-lg">{data.subtitle}</h2>
                    </div>
                    {data.content.map((item, index) => {
                        return (
                            <p className="mb-3 text-lg" key={index}>
                                {item}
                            </p>
                        );
                    })}
                </div>
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

export default FikushonPlayer;
