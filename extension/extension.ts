import { ExtensionSettings, extensionSettingsDB } from "@/db";
import { BangumiWatch, Detail, FikushonWatch, ListItem, MangaWatch } from "@/types/extension";
import Artplayer from "artplayer";
import request from "umi-request";


export class Extension {

    package = "";
    proxyUrl = "";
    webSite = "";
    name = "";
    version = "";
    lang = "";
    script = "";
    scriptUrl = "";
    author = "";
    license = "";
    description = "";
    type = "bangumi";
    nsfw: boolean = false;

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
    watch(url: string): BangumiWatch | MangaWatch | FikushonWatch {
        throw new Error("not implement");
    }

    // 检查更新剧集/章节
    checkUpdate(url: string): string {
        throw new Error("not implement");
    }

    // 读取设置
    async getSetting(key: string) {
        const settings = await extensionSettingsDB.getSetting(this.package, key);
        if (settings) {
            return settings.value;
        }
        return "";
    }

    // 自定义播放器
    customPlayer(video: HTMLMediaElement, url: string, art: Artplayer) {
        art.notice.show = "not implement customPlayer";
    }

    // 注册设置
    async registerSetting(settings: {
        title: string;
        key: string;
        type: ExtensionSettings["type"];
        defaultValue: string;
        description?: string;
        options?: {
            label: string;
            value: string;
        }[]
    }) {
        await extensionSettingsDB.addSettings({
            package: this.package,
            ...settings,
            value: settings.defaultValue,
        });
    }

    load() { }
    unload() { }
}