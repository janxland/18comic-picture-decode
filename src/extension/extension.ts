import { extensionSettingsDB } from "@/db";
import { Detail, ListItem, MangaWatch, BangumiWatch as BangumiWatch } from "@/types/extension";
import request from "umi-request";


export class Extension {

    package = "";
    proxyUrl = "";
    webSite = "";
    name = "";
    version = "";
    language = "";
    script = "";
    scriptUrl = ""
    type: "bangumi" | "manga" | "novel" = "bangumi"

    request(url: string, options?: any) {
        if (!options) {
            options = {};
        }
        if (!options.headers) {
            options.headers = { "Miru-Url": this.webSite };
        }
        if (!options.headers["Miru-Url"]) {
            options.headers = { ...options.headers, "Miru-Url": this.webSite };
        }
        const miruProxy = this.proxyUrl + url
        return request(miruProxy, options);
    }


    // 最近更新
    latest(page: number): ListItem[] {
        throw new Error("not implement");
    }

    // 搜索
    search(kw: string, page: number): ListItem[] {
        throw new Error("not implement");
    }

    // 获取详情
    detail(url: string): Detail {
        throw new Error("not implement");
    }

    // 观看
    watch(url: string): BangumiWatch | MangaWatch {
        throw new Error("not implement");
    }

    // 检查更新剧集/章节
    checkUpdate(url: string): string {
        throw new Error("not implement");
    }

    // 读取设置
    async getSettings(key: string) {
        const settings = await extensionSettingsDB.getSetting(this.package, key);
        if (settings) {
            return settings.value;
        }
        return "";
    }


    unload() { }
}