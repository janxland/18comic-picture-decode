import { db } from "..";

export interface Settings {
    id?: number;
    key: string;
    value: any;
}

export namespace settingsDB {
    export function getAllSettings() {
        return db.settings.toArray();
    }

    export function getSettings(key: string) {
        return db.settings.where("key").equals(key).first();
    }

    export async function setSettings(key: string, value: any) {
        if (await getSettings(key)) {
            return db.settings.where("key").equals(key).modify({ value });
        }
        return db.settings.add({ key, value });
    }

    export function deleteSettings(key: string) {
        return db.settings.where("key").equals(key).delete();
    }

    export function deleteAllSettings() {
        return db.settings.clear();
    }
}