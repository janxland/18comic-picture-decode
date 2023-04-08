import { Metadata } from "next";
import { GetPageTitle } from "../i18n";
import SettingsPage from "./settings-page";

export async function generateMetadata(): Promise<Metadata> {
    const title = await GetPageTitle('settings')
    return { title }
}

export default function Page() {
    return (
        <SettingsPage />
    )
}