import { db } from "..";

export interface TMDB {
    id?: number;
    tmdbId: number;
    mediaType: "movie" | "tv";
    pkg: string;
    url: string;
}

export namespace tmdbDB {
    // 通过 pkg url 查询保存的 id
    export function getTMDB(pkg: string, url: string) {
        return db.tmdb.where({ pkg, url }).first();
    }

    // 保存 查询到的数据
    export async function saveTMDB(tmdb: TMDB) {
        // 判断是否存在
        // 存在则更新
        // 不存在则插入
        const data = await getTMDB(tmdb.pkg, tmdb.url);
        if (data) {
            return db.tmdb.update(data.id!, tmdb);
        } else {
            return db.tmdb.add(tmdb);
        }
    }
}
