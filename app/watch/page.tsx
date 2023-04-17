"use client"
import BaseMargin from "@/components/BaseMargin";
import ErrorView from "@/components/ErrorView";
import { useRootStore } from "@/context/root-context";
import { WatchData, WatchProvider } from "@/context/watch-context";
import { useQuery } from "@tanstack/react-query";
import { observer } from "mobx-react-lite";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useTranslation } from "@/app/i18n";
import { Background } from "./Background";
import BaseDetail from "./BaseDetail";
import Credits from "./Credits";
import Episodes from "./Episodes";
import Footer from "./Footer";
import Player from "./Player";
import Skeletion from "./Skeletion";

const WatchPage = observer(() => {
    const searchParams = useSearchParams()
    const route = useRouter()
    const { extensionStore } = useRootStore()
    const pkg = searchParams?.get("pkg") as string
    const url = searchParams?.get("url") as string
    const cover = searchParams?.get("cover") as string
    const extension = extensionStore.getExtension(pkg)
    const { t } = useTranslation("watch")
    const [watchData, setWatchData] = useState<WatchData>()
    const { isLoading, error, isError, data } = useQuery({
        queryKey: ["watch", pkg, url],
        queryFn: () => extension?.detail(url)
    })
    useEffect(() => {
        if (data) {
            setWatchData({
                detail: data!,
                pkg,
                url,
                extension: extension!,
                setWatchData,
            })
        }
    }, [data])

    if (!pkg || !url) {
        // 跳转到404
        route.push("/404")
        return <></>
    }
    if (!extension) {
        return (
            <ErrorView error={t('extension-lost', { pkg })} ></ErrorView>
        )
    }

    if (isError) {
        return (
            <ErrorView error={error} />
        )
    }

    if (isLoading || !watchData) {
        return (
            <Skeletion cover={cover} />
        )
    }

    if (!data) {
        return (
            <ErrorView error={t('not-found-data')}></ErrorView>
        )
    }

    return (
        <WatchProvider value={watchData} >
            <Background />
            <BaseMargin>
                <div className="min-h-screen">
                    <Player />
                    <BaseDetail />
                    <Episodes />
                    <Credits />
                </div>
                <Footer />
            </BaseMargin>
        </ WatchProvider>
    )
})

export default WatchPage

