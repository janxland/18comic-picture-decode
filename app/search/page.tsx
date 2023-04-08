import { Metadata } from "next";
import { useTranslation } from "../i18n";
import SearchPage from "./search-page";

export async function generateMetadata(): Promise<Metadata> {
    const { t } = await useTranslation("search")
    return { title: t('title') }
}

export default function Page() {
    return (
        <SearchPage />
    )
}