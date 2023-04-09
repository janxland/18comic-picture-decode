"use client"
import BaseMargin from "@/components/BaseMargin";
import Button from "@/components/common/Button";
import ErrorView from "@/components/ErrorView";
import Layout from "@/components/Layout";
import LoadingBox from "@/components/LoadingBox";
import Modal from "@/components/Modal";
import BangumiPlayer from "@/components/Player/Bangumi";
import FikushonPlayer from "@/components/Player/Fikushon";
import MangaPlayer from "@/components/Player/Manga";
import Tab, { Tabs } from "@/components/Tab";
import { useRootStore } from "@/context/root-context";
import { useWatchContext, WatchData, WatchProvider } from "@/context/watch-context";
import { loveDB } from "@/db";
import { Detail } from "@/types/extension";
import { Credits } from "@/types/tmdb";
import clsx from "clsx";
import { ExternalLink as IconLink, Heart as IconLove, MoreHorizontal, X as IconClose } from 'lucide-react';
import { observer } from "mobx-react-lite";
import { useRouter, useSearchParams } from "next/navigation";
import { closeSnackbar, enqueueSnackbar } from "notistack";
import { useEffect, useRef, useState } from "react";
import { useQuery } from "react-query";
import { useTranslation } from "../i18n/client";

const WatchPage = observer(() => {
    const searchParams = useSearchParams()
    const route = useRouter()
    const { extensionStore } = useRootStore()
    const pkg = searchParams?.get("pkg") as string
    const url = searchParams?.get("url") as string
    const extension = extensionStore.getExtension(pkg)
    const { t } = useTranslation("watch")
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

    if (isLoading) {
        return (
            <div className="h-screen w-full flex justify-center items-center">
                <LoadingBox></LoadingBox>
            </div>
        )
    }

    if (!data || !watchData) {
        return (
            <ErrorView error={t('not-found-data')}></ErrorView>
        )
    }

    return (
        <>
            <WatchProvider value={watchData}>
                <Background />
                <Layout>
                    <BaseMargin>
                        <div className="min-h-screen">
                            <Play />
                            <BaseDetail />
                            <Episodes />
                            <Credits />
                        </div>
                        <Footer />
                    </BaseMargin>
                </Layout>
            </WatchProvider>
        </>
    )
})

export default WatchPage


function Footer() {
    const { extension } = useWatchContext()
    const { t } = useTranslation("watch")
    return (
        <div className="flex justify-center items-center mb-3">
            <div className="text-center text-black text-opacity-40 dark:text-white dark:text-opacity-40">
                <p>{t('footer.origin', { ext: extension.name })}</p>
                <p>{t('footer.infomation-error')} <span className="font-bold" >{t('footer.change')}</span></p>
            </div>
        </div>
    )
}

function LoveButton({ pkg, url, type, data }: { pkg: string, url: string, type: any, data: Detail }) {
    const [isLove, setIsLove] = useState(false)
    const { t } = useTranslation("watch")
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
                <IconLove className="mr-1" fill={isLove ? "#fff" : ''}></IconLove>{isLove ? t('collected') : t('collect')}
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
            <div className="fixed left-0 lg:left-230px right-0 bottom-0 top-0 -z-10 bg-white bg-opacity-95 dark:bg-zinc-700 dark:bg-opacity-95"></div>
        </>
    )
}

function BaseDetail() {
    const { tmdbStore } = useRootStore()
    const { pkg, url, detail, extension, setWatchData, tmdbId, mediaType: media_type } = useWatchContext()
    const [metaData, setMetaData] = useState<Map<string, string>>(new Map())
    const [overview, setOverview] = useState<string | undefined>(detail.desc)
    const [showMore, setShowMore] = useState<boolean>(false)
    const [genres, setGenres] = useState<string[]>()
    const { t } = useTranslation("watch")

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
                map.set(t('detail.original-name'), res.original_name ?? res.original_title)
                map.set(t('detail.language'), res.original_language)
                map.set(t('detail.release-date'), res.first_air_date ?? res.release_date)
                map.set(t('detail.status'), res.status)
                map.set(t('detail.production-company'), res.production_companies.map((c) => c.name).join(","))
                map.set(t('detail.production-country'), res.production_countries.map((c) => c.name).join(","))
                map.set(t('detail.vote-average'), res.vote_average.toString())
                map.set(t('detail.vote-count'), res.vote_count.toString())
                if (media_type === "movie") {
                    map.set(t('detail.runtime'), res.runtime.toString())
                } else {
                    map.set(t('detail.episode-run-time'), res.episode_run_time.join(","))
                    map.set(t('detail.number-of-episodes'), res.number_of_episodes.toString())
                    map.set(t('detail.number-of-seasons'), res.number_of_seasons.toString())
                }
                map.set(t('detail.spoken-language'), res.spoken_languages.map((c) => c.name).join(","))
                map.set(t('detail.popularity'), res.popularity.toString())
                map.set(t('detail.homepage'), res.homepage ?? "")
                setOverview(res.overview)
                setGenres(res.genres.map((g) => g.name))
            }
            setMetaData(map)
        })
    }, [tmdbId])


    return (
        <div className="md:items-end mb-5 md:mb-16 flex flex-col items-center md:flex-row">
            <div className="mb-6 md:mb-0 md:flex flex-col items-center md:w-1/4 lg:w-1/5">
                <img
                    className="md:block w-56 md:w-full ring-4 ring-gray-300 rounded-xl shadow-2xl mb-3 "
                    src={detail?.cover} alt={detail.title} />
                <div className="mt-3 md:mt-0 flex justify-between w-full flex-col xl:flex-row">
                    <LoveButton pkg={pkg} url={url} data={detail} type={extension.type}></LoveButton>

                </div>
            </div>
            <div className="w-full md:w-3/4 lg:w-4/5 md:ml-5 md:mt-10">
                <div className="text-3xl mb-1">{detail?.title}</div>
                <div className="mb-3 text-gray-500 dark:text-white dark:text-opacity-60">
                    {
                        genres?.map((g, index) => (
                            <span key={index} className="mr-1">{g}</span>
                        ))
                    }
                </div>
                <div className="max-h-48 overflow-hidden">
                    <div className="mb-3" >
                        {
                            Array.from(metaData.entries()).map((item, index) => (
                                <p key={index} className="mb-1"><span className="font-bold">{item[0]}</span>{item[1]}</p>
                            ))
                        }
                        <p className="mb-1 flex items-center">
                            <span className="font-bold mr-2">{t('origin-site')}</span>
                            <a href={extension.webSite + url} target="_blank" rel="noreferrer"><IconLink size={20} /></a>
                        </p>
                    </div>
                    <div className="overflow-auto max-h-52 md:h-full">
                        <p>
                            {overview}
                        </p>
                    </div>
                </div>
                {/* 展开按钮 */}
                <div className="flex ">
                    <button className="text-gray-500 dark:text-white dark:text-opacity-60 " onClick={() => setShowMore(!showMore)}>
                        <MoreHorizontal />
                    </button>
                </div>
                <Modal show={showMore} onClose={() => { setShowMore(false) }} title={detail.title}>
                    <div className="mb-3">
                        {
                            Array.from(metaData.entries()).map((item, index) => (
                                <p key={index} className="mb-1"><span className="font-bold">{item[0]}</span>{item[1]}</p>
                            ))
                        }
                        <p className="mb-1 flex items-center">
                            <span className="font-bold mr-2">{t('origin-site')}</span>
                            <a href={extension.webSite + url} target="_blank" rel="noreferrer"><IconLink size={20} /></a>
                        </p>
                    </div>
                    <div className="overflow-auto max-h-52 md:h-full">
                        <p>
                            {overview}
                        </p>
                    </div>
                </Modal>
            </div>
        </div >
    )
}

// 播放
function Play() {
    const { watchData, extension, nextChapter, prevChapter, showPlayer, fullscreenWeb, setWatchData } = useWatchContext()
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
                className={clsx("absolute w-full md:w-2/3", {
                    "bg-white dark:bg-black": extension.type !== "bangumi",
                    "left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2": fullscreenWeb !== true,
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
    const { t } = useTranslation("watch")
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
                                                enqueueSnackbar(t('no-next'), { variant: "info" })
                                            }
                                        },
                                        prevChapter: () => {
                                            const prev = item.urls[index - 1]
                                            if (prev) {
                                                handlePlay(prev.url, `${item.title}|${prev.name}`)
                                            } else {
                                                enqueueSnackbar(t('no-previous'), { variant: "info" })

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
            enqueueSnackbar(t('last-watch', { chapter: res.chapter }), {
                persist: false,
                action: (key) => (
                    <Button onClick={() => {
                        // 通过detail.episodes找到对应的url
                        let url = ""
                        const chap = res?.chapter.split("|")
                        if (!chap || chap.length !== 2) {
                            enqueueSnackbar(t('watch-record-error'), {
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
                        {t("continue-watch")}
                    </Button>
                )
            })
        })
    }, [])

    return (
        <div className="mb-6" >
            <Title>
                {t('episodes')}
            </Title>
            <div>
                <Tab tabs={episodesTabs}></Tab>
            </div>
        </div >
    )
}

// 主演
function Credits() {
    const { tmdbStore } = useRootStore()
    const { tmdbId, mediaType: media_type, extension } = useWatchContext()
    const [cast, setCast] = useState<Credits.Cast[]>([])
    const { t } = useTranslation("watch")
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

    if (!cast.length) {
        return <></>
    }

    return (
        <div className="mb-3" >
            <Title>
                {t('starring')}
            </Title>

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


function Title({ children }: { children: React.ReactNode }) {
    return (
        <div className="text-3xl mb-6 text-gray-500 dark:text-white dark:text-opacity-60">
            {children}
        </div>
    )
}