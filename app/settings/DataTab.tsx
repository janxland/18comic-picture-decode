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
    Settings
} from "@/db";
import { Loader2 } from "lucide-react";
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
            <Title>{t("data.sync")}</Title>
            <Sync />
            <Title>{t("data.storage")}</Title>
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
                {props.title}
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
    const { t } = useTranslation("settings");

    useEffect(() => {
        (async () => {
            try {
                setLoading(true);
                const res = await syncStore.pull();
                setCloudUpdateTime(res?.updatedAt);
                setFileUrl(res?.rawUrl);
            } catch (error) {
                enqueueSnackbar(t("data.get-backup-failed") + error, { variant: "error" });
            } finally {
                setLoading(false);
            }
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

            // 脱敏
            data[3].map((item) => {
                if (item.key === "githubToken") {
                    item.value = "";
                }
            });

            const { rawUrl, updatedAt } = await syncStore.push(data);
            setCloudUpdateTime(updatedAt);
            enqueueSnackbar(t("data.backup-success"), { variant: "success" });
            setFileUrl(rawUrl);
        } catch (error) {
            enqueueSnackbar(t("data.backup-failed") + error, { variant: "error" });
        } finally {
            setLoading(false);
        }
    };

    const handleRestore = async () => {
        try {
            setLoading(true);
            if (!fileUrl) {
                enqueueSnackbar(t("data.please-backup-first"), { variant: "error" });
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

            // 不替换 githubToken
            res[3].map((item) => {
                if (item.key === "githubToken") {
                    item.value = settingsStore.getSetting("githubToken")
                }
            });

            // 重置数据库
            await db.delete();
            await db.open();

            await importData(res);

            // 重新加载
            await historyStore.init();
            await extensionStore.init();
            await settingsStore.init();

            enqueueSnackbar(t("data.restore-success"), { variant: "success" });
        } catch (error) {
            enqueueSnackbar(t("data.restore-failed") + error, {
                variant: "error"
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="mb-3">
            <Input title="Github Token" bindKey="githubToken"></Input>
            {settingsStore.getSetting("githubToken") && (
                <div className="relative w-full items-center overflow-hidden rounded-lg border p-2 md:w-96">
                    <div className=" flex items-center justify-between">
                        <div>
                            <h2>{t("data.storage-time")}</h2>
                            <p>{cloudUpdateTime}</p>
                        </div>
                        <div>
                            <Button className="mr-2" onClick={handlePush}>
                                {t("data.backup")}
                            </Button>
                            <Button onClick={handleRestore}>
                                {t("data.restore")}
                            </Button>
                        </div>
                    </div>
                    {loading && (
                        <div className="absolute left-0 right-0 bottom-0 top-0">
                            <div className="flex h-full w-full items-center justify-center bg-black bg-opacity-50">
                                <Loader2 className="animate-spin" />
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
});
