import { Metadata } from "next";
import { useTranslation } from "../i18n";
import WatchPage from "./watch-page";

export async function generateMetadata(): Promise<Metadata> {
    const { t } = await useTranslation("watch")
    return { title: t('title') }
}

export default function Page() {
    return (
        <WatchPage />
    )
}