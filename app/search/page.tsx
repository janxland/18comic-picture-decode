"use client"
import BaseMargin from "@/components/BaseMargin";
import Layout from "@/components/Layout";
import SwitchTitle from "@/components/SwitchTitle";
import Tab, { Tabs } from "@/components/Tab";
import { useRootStore } from "@/context/root-context";
import { Extension } from "@/extension/extension";
import { getModel } from "@/utils/model";
import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";
import { useTranslation } from "@/app/i18n";
import Result from "./Result";



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
                    content: <Result extension={value} kw={kw} />
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
        <Layout>
            <BaseMargin>
                <SwitchTitle title={t('title')} />
                <form className="mb-6" onSubmit={handleSubmit}>
                    <input type="text" className="w-full border rounded-3xl p-4 dark:text-white dark:bg-black" placeholder={t('search-placeholder') as string} />
                </form>
                <Tab className="mb-6" tabs={tabs}></Tab>
                {
                    tabs.length === 0 &&
                    <div className="text-center mt-28">
                        <p className="text-2xl font-bold">{t("no-extension")}</p>
                        <p className="text-sm">{t("no-extension-tips")}</p>
                    </div>
                }
            </BaseMargin>
        </Layout>
    )
})

export default SearchPage


