import { Credits, Details, SearchResult } from "@/types/tmdb";
import { autorun } from "mobx";
import { extend, RequestMethod } from "umi-request";
import SettingsStore from "./settings";

export class TMDBStore {

    req: RequestMethod<false> | undefined
    key: string | undefined
    language: string | undefined

    constructor(settingsStore: SettingsStore) {
        autorun(() => {
            this.key = settingsStore.getSetting("TMDBKey")
            this.language = settingsStore.getSetting("language")
        })
    }

    async request(path: string, options?: any): Promise<any> {
        while (!this.key || !this.language) {
            await new Promise(resolve => setTimeout(resolve, 100));
        }
        this.req = extend({
            prefix: "https://api.themoviedb.org",
            params: {
                "api_key": this.key,
                "language": this.language
            }
        });
        return this.req(path, options);
    }


    async search(kw: string): Promise<SearchResult[] | undefined> {
        const data = await this.request("/3/search/tv", {
            params: {
                query: kw,
            }
        })
        return data.results
    }

    async getDetails(tvid: number): Promise<Details.RootObject | undefined> {
        const data = await this.request(`/3/tv/${tvid}`)
        return data
    }

    async getCredits(tbid: number): Promise<Credits.RootObject | undefined> {
        const data = await this.request(`/3/tv/${tbid}/credits`)
        return data
    }


    getImageUrl(path: string): string | undefined {
        return path ? `https://image.tmdb.org/t/p/original/${path}` : undefined
    }
}
