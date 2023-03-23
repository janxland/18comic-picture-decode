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

    // 通过脚本加载扩展
    installExtension(script: string) {
        return new Promise<string>((resolve, reject) => {
            const extensionData = readExtensionMateData(script);
            if (!extensionData || !verExtensionMateData(extensionData)) {
                return reject("扩展元数据错误");
            }
            extensionData.script = script;
            script = `data:text/javascript;base64,${encode(script)}`;
            if (isClient()) {
                import(/* webpackIgnore: true */ script)
                    .then((module) => {
                        const extension = new module.default();
                        // 将扩展的属性复制到扩展实例上
                        Object.assign(extension, extensionData);

                        // 设置代理地址
                        extension.proxyUrl = this.proxyUrl;

                        // 保存扩展
                        extensionDB.addExtension(extensionData)
                        this.setExtension(extension.package, extension);
                        return resolve(extension.package);
                    })
                    .catch((error) => {
                        this.extensionsErrorMap.set(extensionData.package, error)
                        return reject(error);
                    });
            }

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
            this.installExtension(extension.script);
        }));

    }

    // 设置Extension
    setExtension(pkg: string, extension: Extension) {
        this.extensionsMap.set(pkg, extension);
    }
}