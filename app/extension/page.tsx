import BaseMargin from "@/components/BaseMargin";
import Layout from "@/components/Layout";
import SwitchTitle from "@/components/SwitchTitle";
import Tab from "@/components/Tab";
import { Metadata } from "next";
import { GetPageTitle, useTranslation } from "../i18n";
import InstalledTab from "./InstalledTab";
import RepoTab from "./RepoTab";

export async function generateMetadata(): Promise<Metadata> {
    const title = await GetPageTitle('extensions')
    return { title }
}

export default async function Page() {
    const { t } = await useTranslation("extensions")
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