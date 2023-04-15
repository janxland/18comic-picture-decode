"use client"
import ErrorView from "@/components/ErrorView"
import ItemGrid from "@/components/ItemGrid"
import LoadingBox from "@/components/LoadingBox"
import { useRootStore } from "@/context/root-context"
import { loveDB } from "@/db"
import { getModel } from "@/utils/model"
import { useQuery } from "@tanstack/react-query"
import { observer } from "mobx-react-lite"
import Link from "next/link"
import { useEffect } from "react"
import { useTranslation } from "./i18n"

const Collection = observer(() => {
    const { settingsStore } = useRootStore()
    const { t } = useTranslation("home")
    const { error, data, isLoading, refetch } = useQuery({
        queryKey: ["getLoveData"],
        queryFn: async () => loveDB.getAllLoveByType(getModel(settingsStore.getSetting("model")))
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
            <div className="text-gray-400 text-center m-28">
                <p>{t('no-collection.title')}</p>
                <p>{t('no-collection.message')}</p>
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
                            url: love.url,
                            cover: love.cover
                        }
                    }}>
                        <ItemGrid.Fragment itemData={love}></ItemGrid.Fragment>
                    </Link>
                ))
            }
        </ItemGrid.Grid>
    )
})

export default Collection