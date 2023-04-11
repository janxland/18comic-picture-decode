"use client"

import Tab, { Tabs } from "@/components/Tab"
import Button from "@/components/common/Button"
import { useRootStore } from "@/context/root-context"
import { useWatchContext } from "@/context/watch-context"
import { closeSnackbar, enqueueSnackbar } from "notistack"
import { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import Title from "./Title"

// 剧集
export default function Episodes() {
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
                                    className={`mr-1 mb-1 ${playUrl === value.url ? "ring-2 ring-gray-700 dark:ring-gray-200" : ""}`}>
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
