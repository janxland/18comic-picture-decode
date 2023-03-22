import BaseMargin from "@/components/BaseMargin";
import Button from "@/components/common/Button";
import ErrorView from "@/components/ErrorView";
import IconLink from "@/components/icons/IconLink";
import IconLove from "@/components/icons/IconLove";
import Layout from "@/components/Layout";
import LoadingBox from "@/components/LoadingBox";
import VideoPlayer from "@/components/Player/Video";
import Tab, { Tabs } from "@/components/Tab";
import { useRootStore } from "@/context/root-context";
import { loveDB } from "@/db";
import { Extension } from "@/extension/extension";
import { Detail } from "@/types/extension";
import { Credits, Details } from "@/types/tmdb";
import { isClient } from "@/utils/is-client";
import { observer } from "mobx-react-lite";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useQuery } from "react-query";

const Watch = observer(() => {

    const { query } = useRouter()
    const { extensionStore, tmdbStore } = useRootStore()

    const [episodesTabs, setEpisodesTabs] = useState<Tabs[]>([])
    const [TMDBDataDetails, setTMDBDataDetails] = useState<Details.RootObject>()
    const [TMDBCredits, setTMDBCredits] = useState<Credits.Root>()
    const [watchData, setWatchData] = useState<{ pkg: string, url: string, chapter: string }>()

    const pkg = query.pkg as string
    const url = query.url as string

    const extension = extensionStore.getExtension(pkg)

    const { isLoading, error, isError, data } = useQuery(`getDetail${pkg}${url}`, () => extension?.detail(url))

    useEffect(() => {
        const tabs: Tabs[] = []
        data?.episodes?.map((item, _) => {

            tabs.push({
                title: item.title,
                content: (
                    <div className="max-h-80 overflow-auto">
                        {item.urls.map((value, index) => (
                            <Button onClick={() => { setWatchData({ pkg, url: value.url, chapter: `${item.title}|${value.name}` }) }} key={index} className="mr-1 mb-1">{value.name}</Button>
                        ))}
                    </div>
                )
            })
        })
        setEpisodesTabs(tabs)
        if (!data) {
            return
        }
        let title = data.title
        if (title.length > 5) {
            title = title.substring(0, title.length / 2)
        }
        tmdbStore.search(title).then((res) => {
            if (!res || res.length === 0) {
                return
            }
            const tvid = res[0].id
            tmdbStore.details(tvid).then((res) => {
                setTMDBDataDetails(res)
            })
            tmdbStore.credits(tvid).then((res) => {
                setTMDBCredits(res)
            })
        })
    }, [data])

    useEffect(() => {
        if (!watchData || !isClient()) {
            return
        }
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        })
    }, [watchData])



    if (!pkg || !url) {
        return (
            <div>
                <div className="h-screen flex justify-center items-center flex-col">
                    <h1 className="text-2xl mb-3">访问页面出错</h1>
                    <Link href="/">
                        <Button>返回首页</Button>
                    </Link>
                </div>
            </div>
        )
    }


    if (!extension) {
        return (
            <ErrorView error={`扩展 ${pkg} 丢失`} ></ErrorView>
        )
    }

    if (isError) {
        return (
            <ErrorView error={error} />
        )
    }

    if (isLoading) {
        return (
            <div className="h-screen w-full flex justify-center items-center">
                <LoadingBox></LoadingBox>
            </div>
        )
    }

    if (!data) {
        return (
            <ErrorView error={"未找到数据"}></ErrorView>
        )
    }

    const handleLove = () => {
        loveDB.addLove({
            package: pkg,
            url: url,
            title: data.title,
            cover: data.cover,
            type: extension.type,
        })
    }


    return (
        <>
            <Head>
                <title>{data.title}</title>
            </Head>
            <div className="fixed left-0 right-0 bottom-0 top-0 -z-30 bg-cover bg-no-repeat p-4" style={{ backgroundImage: `url(${TMDBDataDetails?.backdrop_path && tmdbStore.getImageUrl(TMDBDataDetails?.backdrop_path)})`, minHeight: "20rem" }}>
            </div>
            <div className="fixed left-0 right-0 bottom-0 top-0 -z-10 bg-white bg-opacity-90"></div>
            <Layout>
                <BaseMargin>
                    {watchData && <VideoPlayer pkg={watchData?.pkg} url={watchData?.url} pageUrl={url} chapter={watchData.chapter} title={data.title} className="mb-6" ></VideoPlayer>}
                    <div className="md:items-end mb-5 md:mb-16 flex flex-col-reverse md:flex-row">
                        <div className="md:flex flex-col items-center md:w-1/4 lg:w-1/5">
                            <img className="hidden md:block w-56 md:w-full ring-4 ring-gray-300 rounded-xl shadow-2xl mb-3" src={data?.cover} alt="" />
                            <div className="mt-3 md:mt-0 flex justify-between w-full">
                                <LoveButton pkg={pkg} url={url} data={data} type={extension.type}></LoveButton>
                                <a target="_blank"  rel="noreferrer" href={extension.webSite + url} className="focus:ring-2 focus:ring-gray-500 border pl-4 pr-4 pt-2 pb-2 text-lg w-full bg-black text-white rounded-xl">
                                    <div className="flex justify-center items-center">
                                        <IconLink className="mr-1" width={25} fill="#fff"></IconLink>源站
                                    </div>
                                </a>
                            </div>
                        </div>
                        <div className=" md:w-3/4 lg:w-4/5 md:ml-5 md:mt-10">
                            <div className="text-xl lg:text-3xl mb-1">{data?.title}</div>
                            <div className="mb-3 text-gray-500">
                                {
                                    TMDBDataDetails?.genres.map((item, index) => (
                                        <span key={index}>{item.name} </span>
                                    ))
                                }
                            </div>
                            <div className="mb-3">
                                {TMDBDataDetails?.original_name && <p className="mb-1"><span className="font-bold">原产地片名: </span>{TMDBDataDetails?.original_name}</p>}
                                {TMDBDataDetails?.status && <p className="mb-1"><span className="font-bold">状态：</span>{TMDBDataDetails?.status}</p>}
                                {TMDBDataDetails?.original_language && <p className="mb-1"><span className="font-bold">原始语言：</span>{TMDBDataDetails.original_language}</p>}
                                {TMDBDataDetails?.type && <p className="mb-1"><span className="font-bold">类型: </span>{TMDBDataDetails?.type}</p>}
                            </div>
                            <div className="overflow-auto max-h-52 md:h-full">
                                <p>
                                    {TMDBDataDetails?.overview ?? data?.desc}
                                </p>
                            </div>

                        </div>
                    </div>
                    <div className="mb-6" >
                        <div className="text-3xl mb-6 text-gray-500">
                            剧集
                        </div>
                        <div>
                            <Tab tabs={episodesTabs}></Tab>
                        </div>
                    </div>
                    <div className="mb-3" >
                        <div className="text-3xl mb-6 text-gray-500">
                            主演
                        </div>
                        <div className="overflow-auto flex pb-3 scrollbar-none " >

                            {
                                TMDBCredits?.cast?.map((item, index) => (

                                    <div key={index} className="shadow mr-3 border rounded-lg bg-white" style={{ minWidth: "130px", maxWidth: "130px" }} >
                                        <img className="w-full rounded-lg" src={tmdbStore.getImageUrl(item.profile_path)} />
                                        <a href={`https://www.themoviedb.org/person/${item.id}`} target="_blank"  rel="noreferrer">
                                            <div className="p-3 break-keep text-sm ">
                                                <div className="font-bold">
                                                    {item.name}
                                                </div>
                                                <div>
                                                    {item.character}
                                                </div>
                                            </div>
                                        </a>
                                    </div>
                                ))
                            }
                        </div>
                    </div>
                    <Footer extension={extension} />
                </BaseMargin>
            </Layout>
        </>
    )
})

export default Watch


function Footer({ extension }: { extension: Extension }) {
    return (
        <div className="flex justify-center items-center mb-3">
            <div className="text-center text-black text-opacity-40">
                <p>页面数据来自扩展 <span className="font-bold">{extension.name}</span></p>
                <p>信息有误? <span className="font-bold" >更改</span></p>
            </div>
        </div>
    )
}

function LoveButton({ pkg, url, type, data }: { pkg: string, url: string, type: any, data: Detail }) {
    const [isLove, setIsLove] = useState(false)

    useEffect(() => {
        checkLove()
    }, [])

    const handleLove = () => {
        loveDB.loveOrUnLove({
            package: pkg,
            url: url,
            title: data.title,
            cover: data.cover,
            type: type,
        }).finally(() => {
            checkLove()
        })
    }

    const checkLove = () => {
        loveDB.isLove(pkg, url).then((res) => {
            setIsLove(res)
        })
    }

    return (
        <button onClick={handleLove} className="focus:ring-2 focus:ring-gray-500 border pl-4 pr-4 pt-2 pb-2 text-lg w-full bg-black text-white rounded-xl">
            <div className="flex justify-center items-center">
                <IconLove solid={isLove} className="mr-1" width={25} fill="#fff"></IconLove>{isLove ? "已收藏" : "收藏"}
            </div>
        </button>
    )
}