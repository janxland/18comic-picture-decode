import { useRootStore } from "@/context/root-context";
import { useWatchContext } from "@/context/watch-context";
import { FikushonWatch } from "@/types/extension";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import Button from "../common/Button";
import ErrorView from "../ErrorView";
import LoadingBox from "../LoadingBox";

export default function FikushonPlayer() {
    const { url, pkg, watchData, detail, prevChapter, nextChapter } =
        useWatchContext();
    const { extensionStore, historyStore } = useRootStore();
    const extension = extensionStore.getExtension(pkg);

    const { data, error, isLoading } = useQuery({
        queryKey: ["fikushon", watchData?.url, pkg],
        queryFn: () => extension?.watch(watchData!.url) as FikushonWatch,
    });

    useEffect(() => {
        if (!data) {
            return;
        }
        historyStore.addHistory({
            package: pkg,
            url,
            title: detail.title,
            chapter: watchData?.chapter!,
            type: "fikushon",
            cover: data.content[0],
        });
    }, [data]);

    if (isLoading) {
        return <LoadingBox></LoadingBox>;
    }

    if (error) {
        return <ErrorView error={error} />;
    }

    if (!data) {
        return <ErrorView error={new Error("No data")} />;
    }

    return (
        <div className="text-center md:p-3 py-2 max-h-screen overflow-auto">
            <Button className="mb-3" onClick={() => prevChapter?.()}>
                上一章
            </Button>

            <div className="border text-left p-5 bg-slate-200 dark:bg-zinc-700 ">
                <div className="text-center mb-6">
                    <h1 className="text-2xl font-bold">{data.title}</h1>
                    <h2 className="text-lg">{data.subtitle}</h2>
                </div>
                {data.content.map((item, index) => {
                    return (
                        <p className="text-lg mb-3" key={index}>
                            {item}
                        </p>
                    );
                })}
            </div>

            <Button className="mt-3" onClick={() => nextChapter?.()}>
                下一章
            </Button>
        </div>
    );
}
