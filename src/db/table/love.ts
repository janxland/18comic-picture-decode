import { db } from "..";

export interface Love {
    id?: number;
    title: string;
    package: string;
    url: string;
    cover: string;
    type: "bangumi" | "manga" | "novel";
}

export namespace loveDB {

    export function getAllLove() {
        return db.love.toArray();
    }

    export function getAllLoveByType(type: "bangumi" | "manga" | "novel") {
        return db.love.where("type").equals(type).reverse().toArray();
    }

    export function addLove(love: Love) {
        return db.love.add(love);
    }

    export async function loveOrUnLove(love: Love) {
        const isLove = await loveDB.isLove(love.package, love.url);
        if (isLove) {
            return deleteLove(love.package, love.url);
        } else {
            return addLove(love);
        }
    }

    export function deleteLove(pkg: string, url: string) {
        return db.love.where({ package: pkg, url }).delete();
    }

    export function deleteAllLove() {
        return db.love.clear();
    }

    export function getLove(pkg: string, url: string) {
        return db.love.where({ package: pkg, url }).first();
    }

    export async function isLove(pkg: string, url: string) {
        return !!(await getLove(pkg, url));
    }
}