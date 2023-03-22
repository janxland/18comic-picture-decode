import { extensionDB } from "@/db";
import { Extension } from "@/extension/extension";
import { readExtensionMateData, verExtensionMateData } from "@/utils/extension";
import { isClient } from "@/utils/is-client";
import { encode } from "js-base64";
import { autorun, makeAutoObservable } from "mobx";
import SettingsStore from "./settings";

export default class ExtensionStore {

    extensionsMap: Map<string, Extension> = new Map();
    extensionsErrorMap: Map<string, Error> = new Map();
    proxyUrl: string | undefined

    constructor(settingsStore: SettingsStore) {
        makeAutoObservable(this)

        if (isClient()) {
            // 给 window 添加 Extension 对象
            Object.defineProperty(window, "Extension", {
                value: Extension,
            })
        }
        autorun(() => {
            this.proxyUrl = settingsStore.getSetting("miruProxy")
            // 重载扩展proxy地址
            this.extensionsMap.forEach((extension, pkg) => {
                console.log("proxyUrl", this.proxyUrl);
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

                            this.setExtension(pkg, extension);
                            return resolve(pkg);
                        })
                        .catch((error) => {
                            console.log(error);
                            this.extensionsErrorMap.set(pkg, error)
                            return reject(error);
                        });
                }
            }).catch((error) => {
                this.extensionsErrorMap.set(pkg, error)
                return reject(error);
            })
        });
    }

    // 卸载扩展
    unloadExtension(pkg: string) {
        this.extensionsMap.get(pkg)?.unload();
        this.extensionsMap.delete(pkg);
        extensionDB.deleteExtension(pkg)
    }

    getExtension(pkg: string) {
        return this.extensionsMap.get(pkg);
    }

    getExtensionsByType(type: "bangumi" | "manga" | "novel") {
        return Array.from(this.extensionsMap.values()).filter((extension) => extension.type === type);
    }

    getExtensionsError(pkg: string) {
        return this.extensionsErrorMap.get(pkg);
    }

    // 初始化加载所有已存储扩展
    async init() {
        const extensions = await extensionDB.getAllExtensions();
        await Promise.all(extensions.map((extension) => {
            return this.loadExtension(extension.package);
        }));
        
    }

    // 设置Extension
    setExtension(pkg: string, extension: Extension) {
        this.extensionsMap.set(pkg, extension);
    }
}