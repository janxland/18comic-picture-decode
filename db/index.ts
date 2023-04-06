import Dexie, { Table } from "dexie";
import { Extension, ExtensionSettings } from "./table/extension";
import { History } from "./table/history";
import { Love } from "./table/love";
import { Settings } from "./table/settings";

export * from "./table/extension"
export * from "./table/history"
export * from "./table/love"
export * from "./table/settings"



export class MiruDB extends Dexie {

    history!: Table<History>
    extension!: Table<Extension>
    love!: Table<Love>
    settings!: Table<Settings>
    extensionSettings!: Table<ExtensionSettings>

    constructor() {
        super("MiruDB");
        this.version(2).stores({
            history: "++id, url, title, package, cover, type, time,&[url+package]",
            extension: "++id, id, name, &package, version, language, type, script, enable, description, webSite, scriptUrl, author, icon, settings",
            love: "++id, title, package, url, cover, type,&[url+package]",
            settings: "++id, &key, value",
            extensionSettings: "++id, package, key, value, title, defaultValue, description",
        });
    }
}


export const db = new MiruDB()

export function exportData() {
    return Promise.all([
        db.history.toArray(),
        db.extension.toArray(),
        db.love.toArray(),
        db.settings.toArray(),
    ])
}

export function importData(data: any) {
    return Promise.all([
        db.history.bulkPut(data[0]),
        db.extension.bulkPut(data[1]),
        db.love.bulkPut(data[2]),
        db.settings.bulkPut(data[3]),
    ])
}

