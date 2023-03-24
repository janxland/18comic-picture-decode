import BaseMargin from "@/components/BaseMargin"
import Layout from "@/components/Layout"
import LoadingBox from "@/components/LoadingBox"
import { loveDB, historyDB } from "@/db"
import Head from "next/head"
import Link from "next/link"
import { useQuery } from "react-query"
import SwitchTitle from "@/components/SwitchTitle"
import { useRootStore } from "@/context/root-context"
import { useEffect, useState } from "react"
import { observer } from "mobx-react-lite"
import BangumiGrid from "@/components/BangumiGrid"
import ErrorView from "@/components/ErrorView"
import { getModel } from "@/utils/model"
import CheckUpdate from "@/components/CheckUpdata"

export default function Home() {
    return (
        <Layout>
            <Head>
                <title>首页-Miru</title>
            </Head>
            <BaseMargin>
                <SwitchTitle title="首页"></SwitchTitle>
                <h2 className="text-2xl font-bold mb-5">继续观看</h2>
                <ContinueVewing />
                <h2 className="text-2xl font-bold mb-5">收藏</h2>
                <LoveVewing />
            </BaseMargin>
        </Layout>
    )
}



const ContinueVewing = observer(() => {
    const { settingsStore, extensionStore } = useRootStore()
    const { error, data, isLoading, refetch } = useQuery("getHistoryData",
        () => {
            return historyDB.getAllHistoryByType(getModel(settingsStore.getSetting("model")), 8)
        }, {
        cacheTime: 0
    })

    useEffect(() => {
        refetch()
    }, [settingsStore.getSetting("model")])



    if (isLoading) {
        return <LoadingBox></LoadingBox>
    }

    if (error) {
        return (
            <ErrorView error={error}></ErrorView>
        )
    }

    if (!data || data.length === 0) {
        return (
            <div className="text-gray-400 text-center m-14">
                <p>暂无观看记录</p>
                <p>快去观看你喜欢的内容吧</p>
            </div>
        )
    }

    const getObjUrl = (url: ArrayBuffer | string) => {
        // 图片
        return URL.createObjectURL(new Blob([url], { type: "image/png" }))
    }


    return (
        <div className="flex overflow-auto pb-3 scrollbar-none -ml-230px">
            <div className="ml-230px"></div>
            {
                data.map((history, index) => (
                    <div className="mr-4 relative rounded-lg overflow-hidden" key={index} style={{ minWidth: "320px" }}>
                        <Link href={{
                            pathname: "/watch",
                            query: {
                                pkg: history.package,
                                url: history.url
                            }
                        }}>
                            <img
                                className="object-cover w-full h-full" style={{ height: "200px", maxWidth: "400px" }}
                                src={getObjUrl(history.cover)} alt="" />
                            <div className="absolute left-0 right-0 bottom-0 p-2 bg-gradient-to-t from-black">
                                <p className=" text-neutral-300 text-xs mt-3 mb-1"> <CheckUpdate pkg={history.package} url={history.url}></CheckUpdate> 看到 {history.chapter}</p>
                                <p className="text-white">{history.title}</p>
                            </div>
                        </Link>
                    </div >
                ))
            }
        </div >

    )
})

const LoveVewing = observer(() => {
    const { settingsStore } = useRootStore()

    const { error, data, isLoading, refetch } = useQuery("getLoveData",
        () => {
            return loveDB.getAllLoveByType(getModel(settingsStore.getSetting("model")))
        }, {
        cacheTime: 0
    }
    )

    useEffect(() => {
        refetch()
    }, [settingsStore.getSetting("model")])

    if (isLoading) {
        return <LoadingBox></LoadingBox>
    }

    if (error) {
        return (
            <ErrorView error={error}></ErrorView>
        )
    }

    if (!data || data.length === 0) {
        return (
            <div className="text-gray-400 text-center m-28">
                <p>暂无收藏</p>
                <p>快去收藏你喜欢的内容吧</p>
            </div>
        )
    }

    return (
        <BangumiGrid.Grid>
            {
                data.map(love => (
                    <Link key={love.id} href={{
                        pathname: "/watch",
                        query: {
                            pkg: love.package,
                            url: love.url
                        }
                    }}>
                        <BangumiGrid.Fragment itemData={love}></BangumiGrid.Fragment>
                    </Link>
                ))
            }
        </BangumiGrid.Grid>
    )
})