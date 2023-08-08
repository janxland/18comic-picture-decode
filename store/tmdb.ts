import { Credits, Details, SearchResult } from "@/types/tmdb";
import Cookies from "js-cookie";
import { autorun } from "mobx";
import { extend, RequestMethod } from "umi-request";
import SettingsStore from "./settings";

export class TMDBStore {
    req: RequestMethod<false> | undefined;
    key: string | undefined;

    constructor(settingsStore: SettingsStore) {
        autorun(() => {
            this.key = settingsStore.getSetting("TMDBKey");
        });
    }

    async request(path: string, options?: any): Promise<any> {
        while (!this.key) {
            await new Promise((resolve) => setTimeout(resolve, 100));
        }
        this.req = extend({
            prefix: "https://api.themoviedb.org",
            params: {
                api_key: this.key,
                language: Cookies.get("language"),
            },
        });
        return this.req(path, options);
    }

    async search(
        kw: string,
        page: number = 1
    ): Promise<SearchResult[] | undefined> {
        const data = await this.request("/3/search/multi", {
            params: {
                query: kw,
                page,
            },
        });
        return data.results;
    }

    async getDetails(
        tvid: number,
        mediaType: "movie" | "tv"
    ): Promise<Details.RootObject | undefined> {
        const data = await this.request(`/3/${mediaType}/${tvid}`);
        return data;
    }

    async getCredits(
        mbid: number,
        mediaType: "movie" | "tv"
    ): Promise<Credits.RootObject | undefined> {
        const data = await this.request(`/3/${mediaType}/${mbid}/credits`);
        return data;
    }

    getImageUrl(path: string): string | undefined {
        return path ? `https://image.tmdb.org/t/p/original/${path}` : undefined;
    }
}
