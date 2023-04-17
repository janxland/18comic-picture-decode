"use client";
import { useTranslation } from "@/app/i18n";
import Button from "@/components/common/Button";
import { useRootStore } from "@/context/root-context";
import { loveDB } from "@/db";
import { useEffect, useState } from "react";

export default function DataTab() {
    const { historyStore } = useRootStore();
    const { t } = useTranslation("settings");
    return (
        <div>
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
                <span className="pl-2 pr-2  bg-black text-white rounded-lg">
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
