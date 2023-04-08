import { Metadata } from "next";
import { GetPageTitle } from "../i18n";
import ExtensionsPage from "./extension-page";

export async function generateMetadata(): Promise<Metadata> {
    const title = await GetPageTitle('extensions')
    return { title }
}

export default function Page() {
    return (
        <ExtensionsPage />
    )
}