import { useRootStore } from "@/context/root-context";
import { MangaWatch } from "@/types/extension";
import { useQuery } from "react-query";
import ErrorView from "../ErrorView";
import LoadingBox from "../LoadingBox";

interface MangaPlayerProps {
    nextChapter: () => void;
    prevChapter: () => void;
    watchData: WatchData;
}
interface WatchData {
    url: string;
    pkg: string;
    chapter: string;
}

export default function MangaPlayer(props: MangaPlayerProps) {
    const { extensionStore, historyStore } = useRootStore()
    const extension = extensionStore.getExtension(props.watchData.pkg)

    const { data, error, isLoading } = useQuery(
        `manga-${props.watchData.url}-${props.watchData.pkg}`,
        async () => extension?.watch(props.watchData.url) as MangaWatch
    )

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
        <div>
            {
                data.urls.map((url, index) => {
                    return <img key={index} src={url} alt="Manga" referrerPolicy="no-referrer" />
                })
            }
        </div>
    )
} 