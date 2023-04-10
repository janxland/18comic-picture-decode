import BaseMargin from "@/components/BaseMargin";
import Layout from "@/components/Layout";
import Tab from "@/components/Tab";
import { Metadata } from "next";
import { GetPageTitle, useTranslation } from "../i18n";
import AboutTab from "./AboutTab";
import DataTab from "./DataTab";
import GeneralTab from "./GeneralTab";

export async function generateMetadata(): Promise<Metadata> {
    const title = await GetPageTitle('settings')
    return { title }
}

export default async function Page() {
    const { t } = await useTranslation("settings")
    return (
        <Layout>
            <BaseMargin>
                <h1 className="text-3xl font-bold mb-6">{t("title")}</h1>
                <Tab
                    className="mb-6"
                    tabs={[
                        { title: t('general.title'), content: <GeneralTab /> },
                        { title: t('data.title'), content: <DataTab /> },
                        { title: t('about.title'), content: <AboutTab /> }
                    ]}
                />
            </BaseMargin>
        </Layout>
    )
}

