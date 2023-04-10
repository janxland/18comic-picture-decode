import { useRootStore } from "@/context/root-context";
import { useWatchContext } from "@/context/watch-context";
import { MangaWatch } from "@/types/extension";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import Button from "../common/Button";
import ErrorView from "../ErrorView";
import LoadingBox from "../LoadingBox";

export default function MangaPlayer() {
    const { url, pkg, watchData, detail, prevChapter, nextChapter } = useWatchContext()
    const { extensionStore, historyStore } = useRootStore()
    const extension = extensionStore.getExtension(pkg)

    const { data, error, isLoading } = useQuery({
        queryKey: ['manga', watchData?.url, pkg],
        queryFn: () => extension?.watch(watchData!.url) as MangaWatch
    })

    useEffect(() => {
        if (!data) {
            return
        }
        historyStore.addHistory({
            package: pkg,
            url,
            title: detail.title,
            chapter: watchData!.chapter,
            type: "manga",
            cover: data.urls[0],
        })
    }, [data])

    if (isLoading) {
        return <LoadingBox></LoadingBox>
    }

    if (error) {
        return <ErrorView error={error} />
    }

    if (!data) {
        return <ErrorView error={new Error("No data")} />
    }


    return (
        <div className="text-center md:p-3 py-2 max-h-screen overflow-auto">
            <Button className="mb-3" onClick={() => prevChapter?.()}>
                上一章
            </Button>
            <div className="w-full md:w-auto">
                {
                    data.urls.map((url, index) => {
                        return <img key={index} className="m-auto" src={url} alt="Manga" referrerPolicy="no-referrer" />
                    })
                }
            </div>
            <Button className="mt-3" onClick={() => nextChapter?.()}>
                下一章
            </Button>
        </div>
    )
} 