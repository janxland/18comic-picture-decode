import { Metadata } from "next";
import { useTranslation } from "../i18n";
import ExtensionsPage from "./extension-page";

export async function generateMetadata(): Promise<Metadata> {
    const { t } = await useTranslation("extensions")
    return { title: t('title') }
}


export default function Page() {
    return (
        <ExtensionsPage />
    )
}