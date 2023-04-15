"use client"

import Button from "@/components/common/Button"
import ErrorView from "@/components/ErrorView"
import LoadingBox from "@/components/LoadingBox"
import { useRootStore } from "@/context/root-context"
import { Extension, extensionDB } from "@/db"
import { getModel } from "@/utils/model"
import { useQuery } from "@tanstack/react-query"
import { Download, Trash, Upload } from 'lucide-react'
import { observer } from "mobx-react-lite"
import { useSnackbar } from "notistack"
import { useEffect, useState } from "react"
import request from "umi-request"
import { useTranslation } from "../i18n"
import Item from "./Item"

const RepoTab = observer(() => {
    const { settingsStore, extensionStore } = useRootStore()
    const [extensionMap, setExtensionMap] = useState<Map<string, boolean>>(new Map())
    const { enqueueSnackbar } = useSnackbar()
    const { t } = useTranslation("extensions")

    useEffect(() => {
        extensionDB.getAllExtensions().then((extensions) => {
            const map = new Map();
            extensions.forEach((extension) => {
                map.set(extension.package, true);
            })
            setExtensionMap(map)
        })
    }, [])



    const setExtensionMapAndUpdateView = (pkg: string, installed: boolean) => {
        setExtensionMap((prevMap) => {
            const newMap = new Map(prevMap);
            newMap.set(pkg, installed)
            return newMap;
        });
    }

    const { data, error, isLoading, refetch } = useQuery({
        queryKey: ["getRepoExtensions"],
        queryFn: async () => {
            const res = await request.get(settingsStore.getSetting("miruRepo") + "/index.json");
            return res.filter((extension: Extension) => extension.type === getModel(settingsStore.getSetting("model")));
        }
    })

    useEffect(() => {
        refetch()
    }, [settingsStore.getSetting("model")])


    if (error) {
        return <ErrorView error={error} ></ErrorView>
    }

    if (isLoading) {
        return (
            <div className="m-14">
                <LoadingBox />
            </div>
        )
    }

    if (!data || data.length === 0) {
        return (
            <div className="text-center mt-28">
                <p className="text-2xl font-bold">{t('not-find-extension.title')}</p>
                <p className="text-sm">{t('not-find-extension.message')}</p>
            </div>
        )
    }

    const handleInstall = async (pkg: string) => {
        const script = await request.get(`${settingsStore.getSetting("miruRepo")}/repo/${pkg.trim()}.js`)
        if (!script) {
            enqueueSnackbar(t("download-error"), { variant: "error", })
        }
        extensionStore.installExtension(script).then(
            () => {
                setExtensionMapAndUpdateView(pkg, true)
            }
        ).catch((err) => {
            enqueueSnackbar(err, { variant: "error", })
        })
    }

    const handleUninstall = async (pkg: string) => {
        extensionStore.unloadExtension(pkg)
        setExtensionMapAndUpdateView(pkg, false)
    }

    // 就重新安装（
    const handleUpdate = async (pkg: string) => {
        await handleUninstall(pkg)
        await handleInstall(pkg)
    }

    return (
        <div>
            {
                data.map((extension: Extension, index: number) =>
                    <Item
                        key={index}
                        name={extension.name}
                        pkg={extension.package}
                        version={extension.version}
                        icon={extension.icon}
                    >
                        {extensionMap.get(extension.package) && extension.version !== extensionStore.getExtension(extension.package)?.version && (
                            <Button
                                onClick={() => { handleUpdate(extension.package) }}
                                className="flex items-center ml-1">
                                <Upload size={18}></Upload>
                                <span className="hidden md:inline-block ml-1">{t('update')}</span>
                            </Button>
                        )
                        }
                        {
                            extensionMap.get(extension.package) ?
                                <Button
                                    onClick={() => { handleUninstall(extension.package) }}
                                    className="flex items-center ml-1">
                                    <Trash size={18}></Trash>
                                    <span className="hidden md:inline-block ml-1">{t('remove')}</span>
                                </Button>
                                :
                                <Button
                                    onClick={() => { handleInstall(extension.package) }}
                                    className="flex items-center ml-1">
                                    <Download size={18} ></Download>
                                    <span className="hidden md:inline-block ml-1">{t('install')}</span>
                                </Button>
                        }
                    </Item>
                )
            }
        </div >
    )
})

export default RepoTab