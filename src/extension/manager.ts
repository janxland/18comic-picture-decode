import { extensionDB } from "@/db";
import SettingsStore from "@/store/settings";
import { readExtensionMateData, verExtensionMateData } from "@/utils/extension";
import { autorun, makeAutoObservable } from "mobx";
import { Extension } from "./extension";
import { encode } from "js-base64";
import { isClient } from "@/utils/is-client";

export class ExtensionManager {
    private extensions = new Map<string, Extension>;
    private extensionsErrorMap = new Map<string, Error>;
    proxyUrl: string | undefined

    constructor(settingsStore: SettingsStore) {
        if (isClient()) {
            // 创建Extension windows对象
            Object.defineProperty(window, "Extension", {
                value: Extension,
            })
        }

        autorun(() => {
            this.proxyUrl = settingsStore.getSetting("miruProxy")

            // 重载扩展proxy地址
            this.extensions.forEach((extension, pkg) => {
                if (this.proxyUrl) {
                    extension.proxyUrl = this.proxyUrl;
                }
            })
        })
    }

    // 通过脚本安装
    // @param script 未base64编码的脚本
    installExtension(script: string) {
        return new Promise((resolve, reject) => {
            // 先保存到本地数据库
            const extensionData = readExtensionMateData(script);

            if (!extensionData || !verExtensionMateData(extensionData)) {
                return reject("扩展元数据错误");
            }

            // 将 script 转为 base64
            extensionData.script = `data:text/javascript;base64,${encode(script)}`;

            // 保存到数据库
            extensionDB.addExtension(extensionData).then(() => {
                // 加载扩展
                this.loadExtension(extensionData.package).then(() => {
                    return resolve(extensionData.package);
                }).catch((error) => {
                    return reject(error);
                })
            })
        })
    }

    // 从已保存的数据中通过包名加载扩展
    loadExtension(pkg: string) {
        return new Promise<string>((resolve, reject) => {
            extensionDB.getExtension(pkg).then((extensionData) => {
                if (!extensionData) {
                    return reject("Extension not found");
                }
                if (isClient()) {
                    import(/* webpackIgnore: true */ extensionData.script)
                        .then((module) => {
                            const extension = new module.default();
                            // 将扩展的属性复制到扩展实例上
                            Object.assign(extension, extensionData);

                            // 设置代理地址
                            extension.proxyUrl = this.proxyUrl;

                            this.extensions.set(pkg, extension);
                            return resolve(pkg);
                        })
                        .catch((error) => {
                            console.log(error);

                            this.extensionsErrorMap.set(pkg, error)
                            return reject(error);
                        });
                }
            }).catch((error) => {
                return reject(error);
            })
        });
    }

    // 卸载扩展
    unloadExtension(pkg: string) {
        this.extensions.get(pkg)?.unload();
        this.extensions.delete(pkg);
    }

    getExtension(pkg: string) {
        return this.extensions.get(pkg);
    }

    getExtensionsByType(type: "bangumi" | "manga" | "fikushon") {
        return Array.from(this.extensions.values()).filter((extension) => extension.type === type);
    }

    getExtensionsError(pkg: string) {
        return this.extensionsErrorMap.get(pkg);
    }

}