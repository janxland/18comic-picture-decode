import { historyDB, History } from "@/db";
import { isClient } from "@/utils/is-client";
import { autorun, makeAutoObservable } from "mobx";

export default class HistoryStore {

    history: History[] = []
    historyTemp: History[] = []

    constructor() {
        makeAutoObservable(this)
        autorun(() => {
            if (isClient() && this.historyTemp.length > 0) {
                localStorage.setItem("historyTemp", JSON.stringify(this.historyTemp));
            }
        })
    }

    // 初始化数据
    // 先读取本地数据如果有则添加到数据库
    // 然后从数据库读取数据
    async init() {
        const localHistory = JSON.parse(localStorage.getItem("historyTemp") || "[]") as History[];
        await Promise.all(localHistory.reverse().map(async (history) => historyDB.addHistory(history)));
        localStorage.removeItem("historyTemp");
        this.history = await historyDB.getAllHistory();
    }

    getHistoryByType(type: "bangumi" | "manga" | "fikushon", limit: number) {
        return this.history.filter((history) => history.type === type).slice(0, limit);
    }

    async addHistory(history: History) {
        // 先删除原有的再往后添加
        const index = this.historyTemp.findIndex((item) => item.package === history.package && item.url === history.url);
        const dbIndex = this.history.findIndex((item) => item.package === history.package && item.url === history.url);
        if (index !== -1) {
            this.historyTemp.splice(index, 1);
        }
        if (dbIndex !== -1) {
            this.history.splice(dbIndex, 1);
        }
        this.historyTemp.unshift(history);
        this.history.unshift(history);
    }

    async getHistory(url: string, pkg: string) {
        return this.history.find((item) => item.package === pkg && item.url === url);
    }
}