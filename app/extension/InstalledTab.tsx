"use client"

import ErrorView from "@/components/ErrorView"
import LoadingBox from "@/components/LoadingBox"
import Button from "@/components/common/Button"
import { useRootStore } from "@/context/root-context"
import { extensionDB } from "@/db"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { Settings, Trash } from 'lucide-react'
import { useSnackbar } from "notistack"
import { useTranslation } from "react-i18next"
import Item from "./Item"

export default function InstalledTab() {

    const { extensionStore } = useRootStore()
    const { enqueueSnackbar } = useSnackbar()
    const { t } = useTranslation("extensions")

    const { data, error, isLoading } = useQuery({
        queryKey: ["getInstalledExtensions"],
        queryFn: () => extensionDB.getAllExtensions()
    })

    const queryClient = useQueryClient()

    const mutation = useMutation(extensionDB.deleteExtension, {
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["getInstalledExtensions"]
            })
        }
    })


    if (error) {
        return <ErrorView error={error} ></ErrorView>
    }

    if (isLoading) {
        return (
            <LoadingBox />
        )
    }

    if (!data || data.length === 0) {
        return (
            <div className="text-center mt-28">
                <p className="text-2xl font-bold">{t("no-installed-extension.title")}</p>
                <p className="text-sm">{t("no-installed-extension.message")}</p>
            </div>
        )
    }

    const handleUninstall = (pkg: string) => {
        extensionStore.unloadExtension(pkg)
        mutation.mutate(pkg)
    }

    const handleSettings = (pkg: string) => {
        enqueueSnackbar("还没实现的（", { variant: "info", })
    }

    return (
        <div>
            {
                data.map((extension, index) =>
                    <Item
                        key={index}
                        name={extension.name}
                        pkg={extension.package}
                        version={extension.version}
                        icon={extension.icon}
                    >
                        <Button
                            onClick={() => { handleSettings(extension.package) }}
                            className="flex items-center ml-1">
                            <Settings size={18}></Settings>
                            <span className="hidden md:inline-block ml-1">{t('settings')}</span>
                        </Button>
                        <Button
                            onClick={() => { handleUninstall(extension.package) }}
                            className="flex items-center ml-1">
                            <Trash size={18}></Trash>
                            <span className="hidden md:inline-block ml-1">{t('remove')}</span>
                        </Button>
                    </Item>
                )
            }
        </div>
    )
}