"use client";
import { useTranslation } from "@/app/i18n";
import { languages } from "@/app/i18n/settings";
import { useRootStore } from "@/context/root-context";
import { ChangeEvent } from "react";
import Input from "./Input";
import Select from "./Select";

export default function GeneralTab() {
    const { t, i18n } = useTranslation("settings");
    const { settingsStore } = useRootStore();

    const languageOptions: {
        value: string;
        label: string;
    }[] = [];
    languages.forEach((language) => {
        languageOptions.push({
            value: language,
            label: language,
        });
    });

    const handleLanguageChange = (e: ChangeEvent<HTMLSelectElement>) => {
        settingsStore.setSetting("language", e.target.value);
        i18n.changeLanguage(e.target.value);
    };

    const themeOptions = [
        {
            value: "auto",
            label: t("general.theme.auto"),
        },
        {
            value: "light",
            label: t("general.theme.light"),
        },
        {
            value: "dark",
            label: t("general.theme.dark"),
        },
    ];

    const handleThemeChange = (e: ChangeEvent<HTMLSelectElement>) => {
        settingsStore.setSetting("theme", e.target.value);
    };

    return (
        <div>
            <Input title={t("general.miru-proxy")} bindKey="miruProxy" />
            <Input title={t("general.repository")} bindKey="miruRepo" />
            <Input title={t("general.tmdb-key")} bindKey="TMDBKey" />
            <Select
                title={t("general.language")}
                onChange={handleLanguageChange}
                options={languageOptions}
                selected={i18n.language}
            />
            <Select
                title={t("general.theme.title")}
                onChange={handleThemeChange}
                options={themeOptions}
                selected={settingsStore.getSetting("theme")}
            />
        </div>
    );
}
