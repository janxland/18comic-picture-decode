"use client"
import ErrorView from "@/components/ErrorView"
import ItemGrid from "@/components/ItemGrid"
import LoadingBox from "@/components/LoadingBox"
import { useRootStore } from "@/context/root-context"
import { loveDB } from "@/db"
import { getModel } from "@/utils/model"
import { observer } from "mobx-react-lite"
import Link from "next/link"
import { useEffect } from "react"
import { useQuery } from "react-query"

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
        <ItemGrid.Grid>
            {
                data.map(love => (
                    <Link key={love.id} href={{
                        pathname: "/watch",
                        query: {
                            pkg: love.package,
                            url: love.url
                        }
                    }}>
                        <ItemGrid.Fragment itemData={love}></ItemGrid.Fragment>
                    </Link>
                ))
            }
        </ItemGrid.Grid>
    )
})

export default LoveVewing