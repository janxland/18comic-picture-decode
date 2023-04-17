"use client";
import BaseMargin from "@/components/BaseMargin";
import Layout from "@/components/Layout";
import SwitchTitle from "@/components/SwitchTitle";
import Collection from "./Collection";
import ContinueViewing from "./ContinueViewing";
import { useTranslation } from "@/app/i18n";

export default function Home() {
    const { t } = useTranslation("home");
    return (
        <Layout>
            <BaseMargin>
                <SwitchTitle title={t("title")}></SwitchTitle>
                <h2 className="text-2xl font-bold mb-5">
                    {t("continue-viewing")}
                </h2>
                <ContinueViewing />
                <h2 className="text-2xl font-bold mb-5">{t("collection")}</h2>
                <Collection />
            </BaseMargin>
        </Layout>
    );
}
