"use client";
import { useTranslation } from "@/app/i18n";
import Button from "@/components/common/Button";
import { useRootStore } from "@/context/root-context";
import {
    db,
    exportData,
    Extension,
    ExtensionSettings,
    History,
    historyDB,
    importData,
    Love,
    loveDB,
    TMDB,
} from "@/db";
import { Settings } from "http2";
import { observer } from "mobx-react-lite";
import { enqueueSnackbar } from "notistack";
import { useEffect, useState } from "react";
import request from "umi-request";
import Input from "./Input";
import Title from "./Title";

export default function DataTab() {
    const { historyStore } = useRootStore();
    const { t } = useTranslation("settings");
    return (
        <div>
            <Title>同步</Title>
            <Sync />
            <Title>存储</Title>
            <ClearCacheBotton
                title={t("data.history")}
                count={historyStore.history.length}
                clearCallBack={() => {
                    historyStore.clearHistory();
                }}
            />
            <ClearCacheBotton
                title={t("data.collection")}
                count={loveDB.getAllLove}
                clearCallBack={loveDB.deleteAllLove}
            />
        </div>
    );
}

function ClearCacheBotton(props: {
    title: string;
    count: (() => Promise<Array<any>>) | number;
    clearCallBack: () => void;
}) {
    const [count, setCount] = useState(0);
    const { t } = useTranslation("settings");

    useEffect(() => {
        if (typeof props.count === "number") {
            setCount(props.count);
            return;
        }
        props.count().then((res) => {
            setCount(res.length);
        });
    }, []);

    return (
        <div className="mb-3">
            <span className="mr-3">
                {" "}
                {props.title}{" "}
                <span className="rounded-lg bg-black  pl-2 pr-2 text-white">
                    {count}
                </span>{" "}
            </span>
            <Button
                onClick={() => {
                    props.clearCallBack();
                    // 直接给他显示0（
                    setCount(0);
                }}
            >
                {t("data.clear")}
            </Button>
        </div>
    );
}

const Sync = observer(() => {
    const { syncStore, historyStore, extensionStore, settingsStore } =
        useRootStore();
    const [cloudUpdateTime, setCloudUpdateTime] = useState<string>();
    const [fileUrl, setFileUrl] = useState<string>();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        (async () => {
            const res = await syncStore.pull();
            setCloudUpdateTime(res?.updatedAt);
            setFileUrl(res?.rawUrl);
        })();
    }, [settingsStore.getSetting("githubToken")]);

    const handlePush = async () => {
        try {
            setLoading(true);
            // 固化缓存的历史记录
            historyStore.init();

            // 导出数据不包含视频封面
            const data = await exportData();
            data[0].map((item) => {
                if (item.type === "bangumi") {
                    item.cover = "";
                }
            });
            const { rawUrl, updatedAt } = await syncStore.push(data);
            setCloudUpdateTime(updatedAt);
            enqueueSnackbar("备份成功", { variant: "success" });
            setFileUrl(rawUrl);
        } catch (error) {
            enqueueSnackbar("备份失败: " + error, { variant: "error" });
        } finally {
            setLoading(false);
        }
    };

    const handleRestore = async () => {
        try {
            setLoading(true);
            if (!fileUrl) {
                enqueueSnackbar("请先备份", { variant: "error" });
                return;
            }
            const res = (await request(fileUrl)) as [
                History[],
                Extension[],
                Love[],
                Settings[],
                ExtensionSettings[],
                TMDB[]
            ];

            // 如果本地历史记录有视频封面则不替换
            await Promise.all(
                res[0].map(async (item) => {
                    if (item.type === "bangumi") {
                        item.cover =
                            (await historyDB.getHistory(item.url, item.package))
                                ?.cover || "";
                    }
                })
            );

            // 重置数据库
            await db.delete();
            await db.open();

            await importData(res);

            // 重新加载
            await historyStore.init();
            await extensionStore.init();
            await settingsStore.init();

            enqueueSnackbar("恢复成功", { variant: "success" });
        } catch (error) {
            enqueueSnackbar("恢复失败: " + error, {
                variant: "error",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="mb-3">
            <Input title="Github Token" bindKey="githubToken"></Input>
            {settingsStore.getSetting("githubToken") && (
                <div className="w-full items-center rounded-lg border p-2 md:w-96">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2>存储时间</h2>
                            <p>{cloudUpdateTime}</p>
                        </div>
                        <div>
                            <Button
                                className="mr-2"
                                loading={loading}
                                onClick={handlePush}
                            >
                                备份
                            </Button>
                            <Button loading={loading} onClick={handleRestore}>
                                恢复
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
});
