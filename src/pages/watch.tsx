import BaseMargin from "@/components/BaseMargin";
import Button from "@/components/common/Button";
import ErrorView from "@/components/ErrorView";
import IconLink from "@/components/icons/IconLink";
import IconLove from "@/components/icons/IconLove";
import Layout from "@/components/Layout";
import LoadingBox from "@/components/LoadingBox";
import MangaPlayer from "@/components/Player/Manga";
import BangumiPlayer from "@/components/Player/Bangumi";
import Tab, { Tabs } from "@/components/Tab";
import { useRootStore } from "@/context/root-context";
import { WatchData, useWatchContext, WatchProvider } from "@/context/watch-context";
import { loveDB } from "@/db";
import { Detail } from "@/types/extension";
import { Credits } from "@/types/tmdb";
import { observer } from "mobx-react-lite";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { enqueueSnackbar, closeSnackbar } from "notistack";
import { useEffect, useRef, useState } from "react";
import { useQuery } from "react-query";
import FikushonPlayer from "@/components/Player/Fikushon";
import clsx from "clsx";
import IconClose from "@/components/icons/IconClose";


const Watch = observer(() => {
    const { query } = useRouter()
    const { extensionStore } = useRootStore()
    const pkg = query.pkg as string
    const url = query.url as string
    const extension = extensionStore.getExtension(pkg)
    const [watchData, setWatchData] = useState<WatchData>()
    const { isLoading, error, isError, data } = useQuery(`getDetail${pkg}${url}`,
        () => extension?.detail(url)
    )
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

    if (!data || !watchData) {
        return (
            <ErrorView error={"未找到数据"}></ErrorView>
        )
    }

    return (
        <>
            <Head>
                <title>{data.title}</title>
            </Head>
            <WatchProvider value={watchData}>
                <Background />
                <Layout>
                    <BaseMargin>
                        <Play />
                        <BaseDetail />
                        <Episodes />
                        <Credits />
                        <Footer />
                    </BaseMargin>
                </Layout>
            </WatchProvider>
        </>
    )
})

export default Watch


function Footer() {
    const { extension } = useWatchContext()
    return (
        <div className="flex justify-center items-center mb-3">
            <div className="text-center text-black text-opacity-40">
                <p>页面数据来自扩展 <span className="font-bold">{extension?.name}</span></p>
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
        <button
            onClick={handleLove}
            className="focus:ring-2 focus:ring-gray-500 border pl-4 pr-4 pt-2 pb-2 text-lg w-full bg-black text-white rounded-xl">
            <div className="flex justify-center items-center">
                <IconLove solid={isLove} className="mr-1" width={25} fill="#fff"></IconLove>{isLove ? "已收藏" : "收藏"}
            </div>
        </button>
    )
}


// 背景图片
function Background() {
    const { background } = useWatchContext()
    return (
        <>
            <div className="fixed left-0 right-0 bottom-0 top-0 -z-30 bg-cover bg-no-repeat p-4"
                style={{ backgroundImage: `url(${background})`, minHeight: "20rem" }}>
            </div>
            <div className="fixed left-0 lg:left-230px right-0 bottom-0 top-0 -z-10 bg-white bg-opacity-95"></div>
        </>
    )
}

function BaseDetail() {
    const { tmdbStore } = useRootStore()
    const { pkg, url, detail, extension, setWatchData, tmdbId, mediaType: media_type } = useWatchContext()
    const [metaData, setMetaData] = useState<Map<string, string>>(new Map())
    const [overview, setOverview] = useState<string | undefined>(detail.desc)
    const [genres, setGenres] = useState<string[]>()

    // 获取 TMDB ID
    // 也许可以获取个背景（（就不判断了
    useEffect(() => {
        tmdbStore.search(detail.title).then((res) => {
            if (!res || res.length === 0) {
                return
            }
            setWatchData((data) => {
                return {
                    ...data!,
                    tmdbId: res[0].id,
                    mediaType: res[0].media_type,
                    background: tmdbStore.getImageUrl(res[0].backdrop_path),
                }
            })

        })
    }, [])

    // 通过 TMDB 获取详情
    useEffect(() => {
        if (!tmdbId || extension.type !== "bangumi") {
            return
        }
        tmdbStore.getDetails(tmdbId, media_type!).then((res) => {
            const map = new Map<string, string>()
            if (res) {
                map.set("原产地片名", res.original_name ?? res.original_title)
                map.set("语言", res.original_language)
                map.set("上映时间", res.first_air_date ?? res.release_date)
                map.set("状态", res.status)
                map.set("制作公司", res.production_companies.map((c) => c.name).join(","))
                setOverview(res.overview)
                setGenres(res.genres.map((g) => g.name))
            }
            setMetaData(map)
        })
    }, [tmdbId])


    return (
        <div className="md:items-end mb-5 md:mb-16 flex flex-col-reverse md:flex-row">
            <div className="md:flex flex-col items-center md:w-1/4 lg:w-1/5">
                <img
                    className="hidden md:block w-56 md:w-full ring-4 ring-gray-300 rounded-xl shadow-2xl mb-3"
                    src={detail?.cover} alt={detail.title} />
                <div className="mt-3 md:mt-0 flex justify-between w-full md:flex-col xl:flex-row">
                    <LoveButton pkg={pkg} url={url} data={detail} type={extension.type}></LoveButton>
                    <a target="_blank" rel="noreferrer" href={extension.webSite + url}
                        className="focus:ring-2 focus:ring-gray-500 border pl-4 pr-4 pt-2 pb-2 text-lg w-full bg-black text-white rounded-xl">
                        <div className="flex justify-center items-center">
                            <IconLink className="mr-1" width={25} fill="#fff"></IconLink>源站
                        </div>
                    </a>
                </div>
            </div>
            <div className=" md:w-3/4 lg:w-4/5 md:ml-5 md:mt-10">
                <div className="text-3xl mb-1">{detail?.title}</div>
                <div className="mb-3 text-gray-500">
                    {
                        genres?.map((g, index) => (
                            <span key={index} className="mr-1">{g}</span>
                        ))
                    }
                </div>
                <div className="mb-3">
                    {
                        Array.from(metaData.entries()).map((item, index) => (
                            <p key={index} className="mb-1"><span className="font-bold">{item[0]}：</span>{item[1]}</p>
                        ))
                    }
                </div>
                <div className="overflow-auto max-h-52 md:h-full">
                    <p>
                        {overview}
                    </p>
                </div>

            </div>
        </div>
    )
}

// 播放
function Play() {
    const { watchData, extension, nextChapter, prevChapter, showPlayer, setWatchData } = useWatchContext()
    const [player, setPlayer] = useState<JSX.Element | undefined>(undefined)
    const playerContainer = useRef<HTMLDivElement | null>(null)

    useEffect(() => {
        if (!watchData) {
            return
        }
        switch (extension.type) {
            case "bangumi":
                {
                    setPlayer(<BangumiPlayer />)
                }
                break;
            case "manga":
                {
                    setPlayer(<MangaPlayer />)
                }
                break;
            case "fikushon":
                {
                    setPlayer(<FikushonPlayer />)
                }
        }
        // 平滑滚动到顶部
        setTimeout(() => {
            playerContainer.current?.scrollTo({
                top: 0,
                behavior: "smooth"
            })
        }, 100)
    }, [watchData, nextChapter, prevChapter])

    if (!showPlayer) {
        return <></>
    }

    const handleClose = () => {
        setWatchData((data) => {
            return {
                ...data!,
                showPlayer: false,
            }
        })
    }

    return (
        <div className="fixed left-0 right-0 top-0 bottom-0 z-50">
            <div className="fixed left-0 right-0 top-0 bottom-0 bg-black opacity-75 -z-20" onClick={handleClose}></div>
            <div
                ref={playerContainer}
                className={clsx("absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 w-full md:w-2/3 max-h-screen overflow-auto", {
                    "bg-white": extension.type !== "bangumi",
                })}>
                {player}
            </div>
            <div className="fixed right-0 bottom-0 p-2">
                <Button onClick={handleClose} ><IconClose /></Button>
            </div>
        </div>
    )
}

// 剧集
function Episodes() {
    const { historyStore } = useRootStore()
    const { detail, setWatchData, url, pkg } = useWatchContext()
    const [episodesTabs, setEpisodesTabs] = useState<Tabs[]>([])
    const [playUrl, setPlayUrl] = useState<string>("")

    const handlePlay = (url: string, chapter: string) => {
        setPlayUrl(url)
        setWatchData((data) => {
            return {
                ...data!,
                showPlayer: true,
                watchData: {
                    url,
                    chapter,
                }
            }
        })
    }

    useEffect(() => {
        if (!detail.episodes) {
            return
        }

        setEpisodesTabs(detail.episodes.map((item, _) => {
            return {
                title: item.title,
                content: (
                    <div className="max-h-80 overflow-auto p-1">
                        {item.urls.map((value, index) => {
                            // 设置下一章和上一章的方法
                            if (playUrl === value.url) {
                                setWatchData((data) => {
                                    return {
                                        ...data!,
                                        nextChapter: () => {
                                            const next = item.urls[index + 1]
                                            if (next) {
                                                handlePlay(next.url, `${item.title}|${next.name}`)
                                            } else {
                                                enqueueSnackbar("已经是第一章/集了", { variant: "info" })
                                            }
                                        },
                                        prevChapter: () => {
                                            const prev = item.urls[index - 1]
                                            if (prev) {
                                                handlePlay(prev.url, `${item.title}|${prev.name}`)
                                            } else {
                                                enqueueSnackbar("已经是最后一章/集了", { variant: "info" })

                                            }
                                        },
                                    }
                                })
                            }
                            return (
                                <Button
                                    onClick={() => handlePlay(
                                        value.url,
                                        `${item.title}|${value.name}`,
                                    )}
                                    key={index}
                                    className={`mr-1 mb-1 ${playUrl === value.url ? "ring-2 ring-gray-500" : ""}`}>
                                    {value.name}
                                </Button>
                            )
                        })
                        }
                    </div >
                )
            }
        }))

    }, [detail, playUrl])

    useEffect(() => {
        // 获取历史记录提示播放到哪一集
        historyStore.getHistory(url, pkg).then((res) => {
            if (!res) {
                return
            }
            enqueueSnackbar(`上次观看到 ${res.chapter}`, {
                persist: false,
                action: (key) => (
                    <Button onClick={() => {
                        // 通过detail.episodes找到对应的url
                        let url = ""
                        const chap = res?.chapter.split("|")
                        if (!chap || chap.length !== 2) {
                            enqueueSnackbar("播放记录异常", {
                                variant: "error"
                            })
                            return
                        }
                        detail.episodes?.map((item, _) => {
                            item.urls.map((value, _) => {
                                if (item.title === chap[0] && value.name === chap[1]) {
                                    url = value.url
                                }
                            })
                        })
                        handlePlay(url, res?.chapter!)
                        closeSnackbar(key)
                    }}>
                        继续观看
                    </Button>
                )
            })
        })
    }, [])

    return (
        <div className="mb-6" >
            <div className="text-3xl mb-6 text-gray-500">
                剧集
            </div>
            <div>
                <Tab tabs={episodesTabs}></Tab>
            </div>
        </div>
    )
}

// 主演
function Credits() {
    const { tmdbStore } = useRootStore()
    const { tmdbId, mediaType: media_type, extension } = useWatchContext()
    const [cast, setCast] = useState<Credits.Cast[]>([])

    useEffect(() => {
        if (!tmdbId) {
            return
        }
        tmdbStore.getCredits(tmdbId, media_type!).then((res) => {
            if (res) {
                setCast(res.cast)
            }
        })
    }, [tmdbId])

    if (extension.type !== "bangumi") {
        return <></>
    }

    return (
        <div className="mb-3" >
            <div className="text-3xl mb-6 text-gray-500">
                主演
            </div>

            <div className="overflow-auto flex pb-3 scrollbar-none " >
                {
                    cast.map((item, index) => (
                        <div key={index} className="mr-3" style={{ minWidth: "130px", maxWidth: "130px" }} >
                            <img className="w-full rounded-lg" src={tmdbStore.getImageUrl(item.profile_path)} />
                            <a href={`https://www.themoviedb.org/person/${item.id}`} target="_blank" rel="noreferrer">
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
    )
}