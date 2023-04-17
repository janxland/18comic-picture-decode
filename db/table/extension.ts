import { db } from "..";

export interface Extension {
    id?: number;
    // 名称
    name: string;
    // 包名
    package: string;
    // 版本
    version: string;
    // 语言
    lang: string;
    // NSFW
    nsfw: boolean;
    // 脚本类型
    type: "bangumi" | "manga" | "fikushon";
    // 脚本
    script: string;
    // 介绍
    description?: string;
    // 网站
    webSite?: string;
    // 作者
    author?: string;
    // 图标
    icon?: string;
    // 许可证
    license?: string;
}

export interface ExtensionSettings {
    id?: number;
    title: string;
    package: string;
    key: string;
    value: string | boolean;
    type: "input" | "select" | "checkbox";
    options?: {
        label: string;
        value: string;
    }[];
    defaultValue: string | boolean;
    description?: string;
}

export namespace extensionDB {
    export function getAllExtensions() {
        return db.extension.toArray();
    }

    export function getAllExtensionsForType(type: Extension["type"]) {
        return db.extension.where("type").equals(type).toArray();
    }

    export function deleteExtension(packageName: string) {
        return db.extension.where("package").equals(packageName).delete();
    }

    export async function addExtension(extension: Extension) {
        // 如果已经存在则更新
        const ext = await getExtension(extension.package);
        if (ext) {
            return db.extension
                .where("package")
                .equals(extension.package)
                .modify(extension);
        }
        return db.extension.add(extension);
    }

    export function getExtension(packageName: string) {
        return db.extension.where("package").equals(packageName).first();
    }
}

export namespace extensionSettingsDB {
    export function getSettings(packageName: string) {
        return db.extensionSettings
            .where("package")
            .equals(packageName)
            .toArray();
    }

    export function getSetting(packageName: string, key: string) {
        return db.extensionSettings
            .where("package")
            .equals(packageName)
            .and((item) => {
                return item.key === key;
            })
            .first();
    }

    export function setSetting(
        packageName: string,
        key: string,
        value: string | boolean
    ) {
        return db.extensionSettings
            .where("package")
            .equals(packageName)
            .and((item) => {
                return item.key === key;
            })
            .modify({
                value,
            });
    }

    export async function addSettings(settings: ExtensionSettings) {
        // 如果已经有了则只更新除 value 以外的属性
        const setting = await getSetting(settings.package, settings.key);
        if (setting) {
            return db.extensionSettings
                .where("package")
                .equals(settings.package)
                .and((item) => {
                    return item.key === settings.key;
                })
                .modify({
                    title: settings.title,
                    type: settings.type,
                    options: settings.options,
                    defaultValue: settings.defaultValue,
                    description: settings.description,
                });
        }
        return db.extensionSettings.add(settings);
    }

    export function deleteExtensionSettings(pkg: string) {
        return db.extensionSettings.where("package").equals(pkg).delete();
    }
}
