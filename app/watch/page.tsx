import { Metadata } from "next";
import { GetPageTitle } from "../i18n";
import WatchPage from "./watch-page";

export async function generateMetadata(): Promise<Metadata> {
    const title = await GetPageTitle('watch')
    return { title }
}


export default function Page() {
    return (
        <WatchPage />
    )
}