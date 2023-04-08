import { Metadata } from "next";
import { GetPageTitle } from "../i18n";
import SearchPage from "./search-page";

export async function generateMetadata(): Promise<Metadata> {
    const title = await GetPageTitle('search')
    return { title }
}

export default function Page() {
    return (
        <SearchPage />
    )
}