import { useRootStore } from "@/context/root-context";
import { MangaWatch } from "@/types/extension";
import { useEffect } from "react";
import { useQuery } from "react-query";
import Button from "../common/Button";
import ErrorView from "../ErrorView";
import LoadingBox from "../LoadingBox";

interface MangaPlayerProps {
    url: string;
    pkg: string;
    pageUrl: string;
    title: string;
    chapter: string;
    nextChapter?: () => void;
    prevChapter?: () => void;
}
export default function MangaPlayer(props: MangaPlayerProps) {
    const { extensionStore, historyStore } = useRootStore()
    const extension = extensionStore.getExtension(props.pkg)

    const { data, error, isLoading } = useQuery(
        `manga-${props.url}-${props.pkg}`,
        async () => extension?.watch(props.url) as MangaWatch
    )

    useEffect(() => {
        if (!data) {
            return
        }
        historyStore.addHistory({
            package: props.pkg,
            url: props.pageUrl,
            title: props.title,
            chapter: props.chapter,
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
        <div className="m-auto md:w-3/4 text-center">
            <Button className="mb-3" onClick={() => props.prevChapter?.()}>
                上一章
            </Button>
            {
                data.urls.map((url, index) => {
                    return <img key={index} src={url} alt="Manga" referrerPolicy="no-referrer" />
                })
            }
            <Button className="mt-3" onClick={() => props.nextChapter?.()}>
                下一章
            </Button>
            {/* <div className="fixed top-1/2 right-0 flex flex-col">
                <Button className="mb-3" onClick={() => props.nextChapter?.()}>
                    下一章
                </Button>
                <Button onClick={() => props.prevChapter?.()}>
                    上一章
                </Button>
            </div> */}
        </div>
    )
} 