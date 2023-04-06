import { useRootStore } from "@/context/root-context";
import { useWatchContext } from "@/context/watch-context";
import { MangaWatch } from "@/types/extension";
import { useEffect } from "react";
import { useQuery } from "react-query";
import Button from "../common/Button";
import ErrorView from "../ErrorView";
import LoadingBox from "../LoadingBox";

export default function MangaPlayer() {
    const { url, pkg, watchData, detail, prevChapter, nextChapter } = useWatchContext()
    const { extensionStore, historyStore } = useRootStore()
    const extension = extensionStore.getExtension(pkg)

    const { data, error, isLoading } = useQuery(
        `manga-${watchData!.url}-${pkg}`,
        async () => extension?.watch(watchData!.url) as MangaWatch
    )

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
        <div className="text-center p-3 max-h-screen overflow-auto">
            <Button className="mb-3" onClick={() => prevChapter?.()}>
                上一章
            </Button>
            {
                data.urls.map((url, index) => {
                    return <img key={index} src={url} alt="Manga" referrerPolicy="no-referrer" />
                })
            }
            <Button className="mt-3" onClick={() => nextChapter?.()}>
                下一章
            </Button>
        </div>
    )
} 