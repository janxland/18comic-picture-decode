import ItemGrid from "@/components/ItemGrid";
import BaseMargin from "@/components/BaseMargin";
import Button from "@/components/common/Button";
import ErrorView from "@/components/ErrorView";
import Layout from "@/components/Layout";
import LoadingBox from "@/components/LoadingBox";
import SwitchTitle from "@/components/SwitchTitle";
import Tab, { Tabs } from "@/components/Tab";
import { useRootStore } from "@/context/root-context";
import { Extension } from "@/extension/extension";
import { getModel } from "@/utils/model";
import { observer } from "mobx-react-lite";
import Head from "next/head";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useInfiniteQuery } from "react-query";

const Search = observer(() => {

    const { extensionStore, settingsStore } = useRootStore()

    const [tabs, setTabs] = useState<Array<Tabs>>([])

    const [kw, setKw] = useState<string>("")

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
            <Head>
                <title>探索</title>
            </Head>
            <Layout>
                <BaseMargin>
                    <SwitchTitle title="探索" />
                    <form className="mb-6" onSubmit={handleSubmit}>
                        <input type="text" className="w-full border rounded-3xl p-4" placeholder="找点什么好康的呢" />
                    </form>
                    <Tab className="mb-6" tabs={tabs}></Tab>
                </BaseMargin>
            </Layout>
        </>
    )
})

export default Search


function Items({ extension, kw }: { extension: Extension, kw?: string }) {

    const {
        data,
        isLoading,
        isError,
        error,
        hasNextPage,
        fetchNextPage,
        isFetchingNextPage,
    } = useInfiniteQuery([`getSearchItems${extension.package}${kw}`], ({ pageParam = 1 }) => {
        if (!kw) {
            return extension?.latest(pageParam)
        }
        return extension?.search(kw, pageParam)
    }, {
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
                <p className="text-2xl font-bold">没有找到任何内容＞﹏＜</p>
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
                        {isFetchingNextPage ? '加载中...' : '更多'}
                    </Button>
                )}
            </div>
        </div>

    )
}