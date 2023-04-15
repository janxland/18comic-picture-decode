"use client"
import BaseMargin from "@/components/BaseMargin";
import Layout from "@/components/Layout";
import SwitchTitle from "@/components/SwitchTitle";
import Tab from "@/components/Tab";
import { useTranslation } from "../i18n";
import InstalledTab from "./InstalledTab";
import RepoTab from "./RepoTab";


export default function Page() {
    const { t } = useTranslation("extensions")
    return (
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
    )
}