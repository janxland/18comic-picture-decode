"use client";
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
import changeTitle from "@/utils/title-change";
import SearchAll from "@/app/search/SearchAll";
import { useRouter, useSearchParams } from "next/navigation";

const SearchPage = observer(() => {
    const { extensionStore, settingsStore } = useRootStore();
    const [tabs, setTabs] = useState<Array<Tabs>>([]);
    const { t } = useTranslation("search");
    const [tabIndex, setTabIndex] = useState(0);
    const param = useSearchParams();
    const route = useRouter();
    const [kw, setKW] = useState("");
    const [inputKW, setInputKW] = useState("");


    useEffect(() => {
        if (param) {
            setKW(param.get("kw") as string);
            setInputKW(param.get("kw") as string);
        }
    }, [param]);

    useEffect(() => {
        changeTitle(t("title"));
    }, []);

    useEffect(() => {
        setTabIndex(0);
    }, [settingsStore.getSetting("model")]);

    useEffect(() => {
        const newTabs: Array<Tabs> = [];
        const extensions = extensionStore
            .getExtensionsByType(getModel(settingsStore.getSetting("model")));

        // 搜索全部扩展

        extensions.map((value: Extension) => {
            newTabs.push({
                title: value.name,
                content: <Result extension={value} kw={kw} />
            });
        });

        if (newTabs.length > 1) {
            newTabs.unshift({
                title: t("all"),
                content: <SearchAll toTab={(index) => setTabIndex(index)} extensions={extensions} kw={kw} />
            });
        }
        setTabs(newTabs);
    }, [settingsStore.getSetting("model"), kw]);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        route.replace(`/search?kw=${inputKW}`);
    };

    return (
        <Layout>
            <BaseMargin>
                <SwitchTitle title={t("title")} />
                <form className="mb-6" onSubmit={handleSubmit}>
                    <input
                        type="text"
                        value={inputKW}
                        className="w-full rounded-3xl border p-4 dark:bg-black dark:text-white"
                        placeholder={t("search-placeholder") as string}
                        onChange={(e) => setInputKW(e.target.value)}
                    />
                </form>

                {/*无扩展时显示的界面*/}
                {tabs.length === 0 && (
                    <div className="mt-28 text-center">
                        <p className="text-2xl font-bold">
                            {t("no-extension")}
                        </p>
                        <p className="text-sm">{t("no-extension-tips")}</p>
                    </div>
                ) || (
                    <Tab className="mb-6" tabs={tabs} index={tabIndex} onChange={(index) => setTabIndex(index)}></Tab>
                )}
            </BaseMargin>
        </Layout>
    );
});

export default SearchPage;
