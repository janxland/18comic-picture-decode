import { Metadata } from "next";
import { useTranslation } from "../i18n";
import SettingsPage from "./settings-page";

export async function generateMetadata(): Promise<Metadata> {
    const { t } = await useTranslation("settings")
    return { title: t('title') }
}

export default function Page() {
    return (
        <SettingsPage />
    )
}