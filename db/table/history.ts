import { db } from "..";

export interface History {
    id?: number;
    // 标题
    title: string;
    // 包名
    package: string;
    // 地址
    url: string;
    // 封面
    cover: string | ArrayBuffer;
    // 类型
    type: "bangumi" | "manga" | "fikushon";
    // 章节
    chapter: string;
    // 时间
    time?: number;
}

export namespace historyDB {
    export async function getAllHistory() {
        // 返回最新修改的
        return db.history.reverse().sortBy("time");
    }

    export function getAllHistoryByType(
        type: "bangumi" | "manga" | "fikushon",
        limit: number
    ) {
        return db.history
            .where("type")
            .equals(type)
            .reverse()
            .limit(limit)
            .sortBy("time");
    }

    export async function addHistory(history: History) {
        history.time = Date.now();
        if (await getHistory(history.url, history.package)) {
            return db.history
                .where({ url: history.url, package: history.package })
                .modify(history);
        }
        return db.history.add(history);
    }

    export function deleteHistory(pkg: string, url: string) {
        return db.history.where({ package: pkg, url }).delete();
    }

    export function deleteAllHistory() {
        return db.history.clear();
    }

    export function getHistory(url: string, pkg: string) {
        return db.history.where({ url, package: pkg }).first();
    }
}
