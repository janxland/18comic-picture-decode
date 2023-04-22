import { db } from "@/db";
import { Files, GistItem } from "@/types/sync";
import { autorun, makeAutoObservable } from "mobx";
import { extend, RequestMethod } from "umi-request";
import SettingsStore from "./settings";

export default class SyncStore {
    req: RequestMethod<false> | undefined;
    gid: string | undefined;
    token: string | undefined;
    settingsStore: SettingsStore;

    constructor(settingsStore: SettingsStore) {
        makeAutoObservable(this);
        this.settingsStore = settingsStore;
        autorun(() => {
            this.token = settingsStore.getSetting("githubToken");
        });
    }

    async request(path: string, options?: any): Promise<any> {
        let count = 0;
        while (!this.token) {
            if (count > 10) {
                throw new Error("Github Token 未设置");
            }
            await new Promise((resolve) => setTimeout(resolve, 100));
        }
        this.req = extend({
            prefix: "https://api.github.com",
            headers: {
                Authorization: `Bearer ${this.token}`,
            },
        });
        return this.req(path, options);
    }

    async getRemoteGid() {
        // 避免重复获取gid
        if (this.gid) {
            return this.gid;
        }
        const list = (await this.request("/gists")) as GistItem[];
        const gist = list.find((item: GistItem) => {
            return item.description === "MiruAync";
        });
        this.gid = gist?.id;
        return this.gid;
    }

    // 从远程获取数据
    async pull() {
        // 获取gid
        const gid = await this.getRemoteGid();
        if (!gid) {
            return;
        }
        const gist = (await this.request(`/gists/${gid}`)) as GistItem;
        const file = gist.files["MiruAsync.json"];
        return { rawUrl: file.raw_url, updatedAt: gist.updated_at };
    }

    // 将数据推送到远程
    async push(data: any) {
        let gist: GistItem;
        let files: Files;
        // 获取gid
        const gid = await this.getRemoteGid();
        if (!gid) {
            // 不存在则创建
            gist = (await this.request("/gists", {
                method: "POST",
                data: {
                    description: "MiruAync",
                    public: false,
                    files: {
                        "MiruAsync.json": {
                            content: JSON.stringify(data, null, 2),
                        },
                    },
                },
            })) as GistItem;
            files = gist.files;
        } else {
            gist = (await this.request(`/gists/${gid}`, {
                method: "PATCH",
                data: {
                    files: {
                        "MiruAsync.json": {
                            content: JSON.stringify(data, null, 2),
                        },
                    },
                },
            })) as GistItem;
            files = gist.files;
        }
        // 存在则更新
        return {
            rawUrl: files["MiruAsync.json"].raw_url,
            updatedAt: gist.updated_at,
        };
    }
}
