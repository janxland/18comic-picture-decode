import { Extension } from "@/db";

// 读取扩展元数据
export function readExtensionMateData(script: string) {
    const scriptMetaData = script.match(
        /MiruExtension([\s\S]+?)\/MiruExtension/
    )?.[1];
    if (!scriptMetaData) {
        return undefined;
    }
    const data: any = {};
    const lines = scriptMetaData.split("\n");
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        if (line.startsWith("// @")) {
            const property = line.slice(4).split(" ");
            data[property[0]] = property.slice(1).join(" ").trim();
        }
    }
    return data as Extension;
}

// 验证是否数据是否合法
export function verExtensionMateData(data: Extension) {
    if (
        !data.name ||
        !data.package ||
        !data.version ||
        !data.webSite ||
        !data.type ||
        !data.lang
    ) {
        return false;
    }
    return true;
}
