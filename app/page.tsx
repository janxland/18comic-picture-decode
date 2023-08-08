"use client";
import BaseMargin from "@/components/BaseMargin";
import Layout from "@/components/Layout";
import SwitchTitle from "@/components/SwitchTitle";
import Collection from "./Collection";
import ContinueViewing from "./ContinueViewing";
import { useTranslation } from "@/app/i18n";
import { useEffect } from "react";
import changeTitle from "@/utils/title-change";

export default function Home() {
    const { t } = useTranslation("home");
    useEffect(() => {
        changeTitle(t("title"));
    }, []);
    return (
        <Layout>
            <BaseMargin>
                <SwitchTitle title={t("title")}></SwitchTitle>
                <h2 className="mb-5 text-2xl font-bold">
                    {t("continue-viewing")}
                </h2>
                <ContinueViewing />
                <h2 className="mb-5 text-2xl font-bold">{t("collection")}</h2>
                <Collection />
            </BaseMargin>
        </Layout>
    );
}
