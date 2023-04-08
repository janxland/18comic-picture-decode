"use client"
import BaseMargin from "@/components/BaseMargin";
import Button from "@/components/common/Button";
import ErrorView from "@/components/ErrorView";
import Layout from "@/components/Layout";
import LoadingBox from "@/components/LoadingBox";
import SwitchTitle from "@/components/SwitchTitle";
import Tab from "@/components/Tab";
import { useRootStore } from "@/context/root-context";
import { Extension, extensionDB } from "@/db";
import { getModel } from "@/utils/model";
import {
    Download as IconDownload, Settings as IconSettings, Trash as IconTrash, Upload as IconUpload
} from 'lucide-react';
import { observer } from "mobx-react-lite";
import { useSnackbar } from "notistack";
import { ReactNode, useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import request from "umi-request";
import { useTranslation } from "../i18n/client";
export default function ExtensionsPage() {
    const { t } = useTranslation("extensions")
    return (
        <>
            <Layout>
                <BaseMargin>
                    <SwitchTitle title={t('title')}></SwitchTitle>
                    <Tab
                        tabs={[
                            { title: t('installed'), content: <InstalledTab /> },
                            { title: t('repository'), content: <RepoTab /> },
                        ]}
                    />
                </BaseMargin>
            </Layout>
        </>
    )
}


function InstalledTab() {

    const { extensionStore } = useRootStore()
    const { enqueueSnackbar } = useSnackbar()
    const { t } = useTranslation("extensions")

    const { data, error, isLoading } = useQuery("getInstalledExtensions",
        () => {
            return extensionDB.getAllExtensions()
        }
    )

    const queryClient = useQueryClient()

    const mutation = useMutation(extensionDB.deleteExtension, {
        onSuccess: () => {
            queryClient.invalidateQueries('getInstalledExtensions')
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
                    <ListItem
                        key={index}
                        name={extension.name}
                        pkg={extension.package}
                        version={extension.version}
                        icon={extension.icon}
                    >
                        <Button
                            onClick={() => { handleSettings(extension.package) }}
                            className="flex items-center ml-1">
                            <IconSettings size={18}></IconSettings>
                            <span className="hidden md:inline-block ml-1">{t('settings')}</span>
                        </Button>
                        <Button
                            onClick={() => { handleUninstall(extension.package) }}
                            className="flex items-center ml-1">
                            <IconTrash size={18}></IconTrash>
                            <span className="hidden md:inline-block ml-1">{t('remove')}</span>
                        </Button>
                    </ListItem>
                )
            }
        </div>
    )
}

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

    const { data, error, isLoading, refetch } = useQuery("getRepoExtensions",
        () => {
            return request.get(settingsStore.getSetting("miruRepo") + "/index.json")
                .then((res: Extension[]) => {
                    return res.filter((extension) => extension.type === getModel(settingsStore.getSetting("model")))
                })
        }
    )

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
                data.map((extension, index) =>
                    <ListItem
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
                                <IconUpload size={18}></IconUpload>
                                <span className="hidden md:inline-block ml-1">{t('update')}</span>
                            </Button>
                        )
                        }
                        {
                            extensionMap.get(extension.package) ?
                                <Button
                                    onClick={() => { handleUninstall(extension.package) }}
                                    className="flex items-center ml-1">
                                    <IconTrash size={18}></IconTrash>
                                    <span className="hidden md:inline-block ml-1">{t('remove')}</span>
                                </Button>
                                :
                                <Button
                                    onClick={() => { handleInstall(extension.package) }}
                                    className="flex items-center ml-1">
                                    <IconDownload size={18} ></IconDownload>
                                    <span className="hidden md:inline-block ml-1">{t('install')}</span>
                                </Button>
                        }
                    </ListItem>
                )
            }
        </div >
    )
})



interface ExtensionProps {
    name: string,
    pkg: string,
    version: string,
    icon?: string,
    children?: ReactNode,
}

function ListItem(props: ExtensionProps) {
    return (
        <div className="flex justify-between transition-all text-black border rounded-xl  p-3 mb-3">
            <div className="flex">
                {
                    props.icon
                        ?
                        <img className="hidden md:block object-contain mr-3 h-16 w-24" src={props.icon} alt={props.name} />
                        :
                        null
                }
                <div>
                    <p className="text-lg mb-1">
                        {props.name}
                        <span className="text-xs ml-1 pl-2 pr-2 pt-1 pb-1 rounded-full bg-black text-white">{props.version}</span>
                    </p>
                    <p className="text-sm">{props.pkg}</p>
                </div>
            </div>
            <div className="flex justify-end items-end">
                {props.children}
            </div>
        </div>
    )
}

