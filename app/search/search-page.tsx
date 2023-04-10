"use client"
import BaseMargin from "@/components/BaseMargin";
import Button from "@/components/common/Button";
import ErrorView from "@/components/ErrorView";
import ItemGrid from "@/components/ItemGrid";
import Layout from "@/components/Layout";
import LoadingBox from "@/components/LoadingBox";
import SwitchTitle from "@/components/SwitchTitle";
import Tab, { Tabs } from "@/components/Tab";
import { useRootStore } from "@/context/root-context";
import { Extension } from "@/extension/extension";
import { getModel } from "@/utils/model";
import { useInfiniteQuery } from "@tanstack/react-query";
import { observer } from "mobx-react-lite";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useTranslation } from "../i18n/client";



const SearchPage = observer(() => {

    const { extensionStore, settingsStore } = useRootStore()
    const [tabs, setTabs] = useState<Array<Tabs>>([])
    const [kw, setKw] = useState<string>("")
    const { t } = useTranslation("search")

    useEffect(() => {
        const newTabs: Array<Tabs> = []

        extensionStore.getExtensionsByType(getModel(settingsStore.getSetting("model")))
            .map((value: Extension) => {
                newTabs.push({
                    title: value.name,
                    content: <Items extension={value} kw={kw} />
                })
            })
        setTabs(newTabs)
    }, [settingsStore.getSetting("model"), kw])

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const str = ((e.target as HTMLFormElement).elements[0] as HTMLInputElement).value
        setKw(str)
    }


    return (
        <>
            <Layout>
                <BaseMargin>
                    <SwitchTitle title={t('title')} />
                    <form className="mb-6" onSubmit={handleSubmit}>
                        <input type="text" className="w-full border rounded-3xl p-4 dark:text-white dark:bg-black" placeholder={t('search-placeholder') as string} />
                    </form>
                    <Tab className="mb-6" tabs={tabs}></Tab>
                </BaseMargin>
            </Layout>
        </>
    )
})

export default SearchPage


function Items({ extension, kw }: { extension: Extension, kw?: string }) {
    const { t } = useTranslation("search")
    const {
        data,
        isLoading,
        isError,
        error,
        hasNextPage,
        fetchNextPage,
        isFetchingNextPage,
    } = useInfiniteQuery({
        queryKey: ["getSearchItems", extension.package, kw],
        queryFn: ({ pageParam = 1 }) => {
            if (!kw) {
                return extension?.latest(pageParam)
            }
            return extension?.search(kw, pageParam)
        },
        retry: false,
        getNextPageParam: (lastPage, pages) => {
            if (!lastPage) {
                return undefined
            }
            if (lastPage.length === 0) {
                return undefined
            }
            return pages.length + 1
        }
    })

    if (isError) {
        return (
            <ErrorView error={error}></ErrorView>
        )
    }

    if (isLoading) {
        return (
            <LoadingBox />
        )
    }


    if (!data?.pages || data.pages.length === 0) {
        return (
            <div className="text-center mt-28">
                <p className="text-2xl font-bold">{t('no-content')}</p>
            </div>
        )
    }

    return (
        <div>
            <ItemGrid.Grid>
                {data.pages && data.pages.map((value, index) =>
                    value.map((value, index) =>
                        <Link
                            key={index}
                            href={{
                                pathname: "/watch",
                                query: {
                                    pkg: extension.package,
                                    url: value.url
                                }
                            }}
                            className="w-full h-full"
                        >
                            <ItemGrid.Fragment itemData={value}></ItemGrid.Fragment>
                        </Link>
                    )
                )}
            </ItemGrid.Grid>
            <div className="text-center">
                {hasNextPage && (
                    <Button className="m-4" onClick={() => fetchNextPage()}>
                        {isFetchingNextPage ? t('loading') : t('more')}
                    </Button>
                )}
            </div>
        </div>

    )
}