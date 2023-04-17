"use client";
import BaseMargin from "@/components/BaseMargin";
import Layout from "@/components/Layout";
import Tab from "@/components/Tab";
import { useTranslation } from "@/app/i18n";
import AboutTab from "./AboutTab";
import DataTab from "./DataTab";
import GeneralTab from "./GeneralTab";

export default function Page() {
    const { t } = useTranslation("settings");
    return (
        <Layout>
            <BaseMargin>
                <h1 className="mb-6 text-3xl font-bold">{t("title")}</h1>
                <Tab
                    className="mb-6"
                    tabs={[
                        { title: t("general.title"), content: <GeneralTab /> },
                        { title: t("data.title"), content: <DataTab /> },
                        { title: t("about.title"), content: <AboutTab /> },
                    ]}
                />
            </BaseMargin>
        </Layout>
    );
}
