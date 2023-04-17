import Dexie, { Table } from "dexie";
import { Extension, ExtensionSettings } from "./table/extension";
import { History } from "./table/history";
import { Love } from "./table/love";
import { Settings } from "./table/settings";
import { TMDB } from "./table/tmdb";

export * from "./table/extension";
export * from "./table/history";
export * from "./table/love";
export * from "./table/settings";
export * from "./table/tmdb";

export class MiruDB extends Dexie {
    history!: Table<History>;
    extension!: Table<Extension>;
    love!: Table<Love>;
    settings!: Table<Settings>;
    extensionSettings!: Table<ExtensionSettings>;
    tmdb!: Table<TMDB>;

    constructor() {
        super("MiruDB");
        this.version(5).stores({
            history:
                "++id, url, title, package, cover, type, time,&[url+package]",
            extension:
                "++id, id, name, &package, version, lang, type, script, enable, description, webSite, scriptUrl, author, icon, settings",
            love: "++id, title, package, url, cover, type,&[url+package]",
            settings: "++id, &key, value",
            extensionSettings:
                "++id, title, package, key, value, type, options, defaultValue, description, &[package+key]",
            tmdb: "++id, tmdb_id, mediaType, pkg, url,&[url+pkg]",
        });
    }
}

export const db = new MiruDB();

export function exportData() {
    return Promise.all([
        db.history.toArray(),
        db.extension.toArray(),
        db.love.toArray(),
        db.settings.toArray(),
    ]);
}

export function importData(data: any) {
    return Promise.all([
        db.history.bulkPut(data[0]),
        db.extension.bulkPut(data[1]),
        db.love.bulkPut(data[2]),
        db.settings.bulkPut(data[3]),
    ]);
}
