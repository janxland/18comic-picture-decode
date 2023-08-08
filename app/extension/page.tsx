"use client";
import BaseMargin from "@/components/BaseMargin";
import Layout from "@/components/Layout";
import SwitchTitle from "@/components/SwitchTitle";
import Tab from "@/components/Tab";
import { useTranslation } from "@/app/i18n";
import InstalledTab from "./InstalledTab";
import RepoTab from "./RepoTab";
import changeTitle from "@/utils/title-change";
import { useEffect } from "react";

export default function Page() {
    const { t } = useTranslation("extensions");
    useEffect(() => {
        changeTitle(t("title"));
    }, []);
    return (
        <Layout>
            <BaseMargin>
                <SwitchTitle title={t("title")}></SwitchTitle>
                <Tab
                    tabs={[
                        { title: t("installed"), content: <InstalledTab /> },
                        { title: t("repository"), content: <RepoTab /> },
                    ]}
                />
            </BaseMargin>
        </Layout>
    );
}
