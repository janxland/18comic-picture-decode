"use client";
import Logo from "@/components/Logo";
import packageInfo from "../../package.json";
import { useTranslation } from "@/app/i18n";

export default function AboutTab() {
    const { t } = useTranslation("settings");
    return (
        <div className="prose dark:text-white">
            <Logo />
            <p>
                {t("about.cuurent-version")} {packageInfo.version}
            </p>
            <p>
                {t("about.open-source")}
                <a
                    href="https://github.com/miru-project/miru"
                    target="_blank"
                    rel="noreferrer"
                >
                    Github
                </a>
            </p>
            <p>
                本项目灵感来自{" "}
                <a
                    href="https://tachiyomi.org/"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    tachiyomi
                </a>
            </p>
        </div>
    );
}
