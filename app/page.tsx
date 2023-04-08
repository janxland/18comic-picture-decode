import BaseMargin from "@/components/BaseMargin"
import Layout from "@/components/Layout"
import SwitchTitle from "@/components/SwitchTitle"
import { Metadata } from "next"
import Collection from "./client/Collection"
import ContinueViewing from "./client/ContinueViewing"
import { GetPageTitle, useTranslation } from "./i18n"

export async function generateMetadata(): Promise<Metadata> {
    const title = await GetPageTitle('home')
    return { title }
}

export default async function Home() {
    const { t } = await useTranslation("home")
    return (
        <Layout>
            <BaseMargin>
                <SwitchTitle title={t("title")}></SwitchTitle>
                <h2 className="text-2xl font-bold mb-5">{t('continue-viewing')}</h2>
                <ContinueViewing />
                <h2 className="text-2xl font-bold mb-5">{t('collection')}</h2>
                <Collection />
            </BaseMargin>
        </Layout>
    )
}


