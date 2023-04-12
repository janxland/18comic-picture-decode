"use client"

import Button from "@/components/common/Button"
import Input from "@/components/common/Input"
import ErrorView from "@/components/ErrorView"
import LoadingBox from "@/components/LoadingBox"
import Modal from "@/components/Modal"
import { useRootStore } from "@/context/root-context"
import { useWatchContext } from "@/context/watch-context"
import { tmdbDB } from "@/db"
import { SearchResult } from "@/types/tmdb"
import { useInfiniteQuery } from "@tanstack/react-query"
import { useState } from "react"
import { useTranslation } from "../i18n/client"

export default function Footer() {
    const { extension } = useWatchContext()
    const { t } = useTranslation("watch")
    const [showModal, setShowModal] = useState(false)
    const [kw, setKw] = useState("")
    const [serachKw, setSearchKw] = useState("")
    const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setSearchKw(kw)
    }
    return (
        <div className="flex justify-center items-center mb-3">
            <div className="text-center text-black text-opacity-40 dark:text-white dark:text-opacity-40">
                <p>{t('footer.origin', { ext: extension.name })}</p>
                <p>{t('footer.infomation-error')} <span className="font-bold cursor-pointer" onClick={() => setShowModal(true)} >{t('footer.change')}</span></p>
            </div>
            <Modal show={showModal} onClose={() => setShowModal(false)} title={t("changing-tmdb-metadata-targets")}>
                {/* 搜索框 */}
                <form className="mb-3" onSubmit={handleSearch} >
                    <Input className="w-full" value={kw} onChange={(e) => setKw(e.target.value)} placeholder={t("enter-the-current-movie-keyword") as string}></Input>
                </form>
                {/* 搜索结果 */}
                <TMDBModalSearchResult kw={serachKw} onClose={() => setShowModal(false)} />
                <div className="text-center">
                    <p className="text-black text-opacity-40 dark:text-white  dark:text-opacity-40 text-center">
                        {t("changing-tmdb-metadata-targets-tips")}
                    </p>
                </div>
            </Modal >
        </div >
    )
}

function TMDBModalSearchResult({ kw, onClose }: { kw: string, onClose: () => void }) {
    const { t } = useTranslation(["watch", "common"])
    const { url, pkg, setWatchData } = useWatchContext()
    const { settingsStore } = useRootStore()
    const { tmdbStore } = useRootStore()
    const { error, data, isLoading, isFetchingNextPage, fetchNextPage, refetch } = useInfiniteQuery({
        queryKey: ["tmdbsearch", kw],
        queryFn: ({ pageParam }) => tmdbStore.search(kw, pageParam),
        getNextPageParam: (lastPage, pages) => {
            if (!lastPage) {
                return undefined
            }
            if (lastPage.length === 0) {
                return undefined
            }
            return pages.length + 1
        },
    })


    const handleTMDBChange = (tmdbResult: SearchResult) => {
        tmdbDB.saveTMDB({
            tmdbId: tmdbResult.id,
            mediaType: tmdbResult.media_type,
            url,
            pkg,
        })
        setWatchData((data) => {
            return {
                ...data!,
                tmdbId: tmdbResult.id,
                mediaType: tmdbResult.media_type,
            }
        })
        onClose()
    }
    if (!settingsStore.getSetting("TMDBKey")) {
        return (
            <div className="mb-3">
                <ErrorView error={t("no-tmdb-key")}></ErrorView>
            </div>
        )
    }
    if (error) {
        return (
            <div className="mb-3">
                <ErrorView error={error}></ErrorView>
            </div>
        )
    }

    if (isLoading) {
        <div className="mb-3">
            <LoadingBox />
        </div>
    }

    return (
        <div className="mb-3">
            <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
                {data?.pages && data.pages.map((page) => page!.map((item, index) => (
                    <div key={index} className="hover:opacity-80 cursor-pointer" onClick={() => handleTMDBChange(item)}>
                        <img className="rounded-md object-cover w-full" src={tmdbStore.getImageUrl(item.poster_path)} />
                        <div className="my-2 text-center">
                            <p>{item.name ?? item.title}</p>
                        </div>
                    </div>
                )))}

            </div>
            {
                kw && data?.pages && <div className="mb-3 text-center">
                    <Button onClick={() => fetchNextPage()}>{isFetchingNextPage ? t('loading') : t('more')}</Button>
                </div>
            }
        </div>
    )
}