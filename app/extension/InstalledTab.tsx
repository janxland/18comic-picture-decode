"use client";

import Button from "@/components/common/Button";
import Input from "@/components/common/Input";
import Select from "@/components/common/Select";
import ErrorView from "@/components/ErrorView";
import LoadingBox from "@/components/LoadingBox";
import Modal from "@/components/Modal";
import { useRootStore } from "@/context/root-context";
import { extensionDB, ExtensionSettings, extensionSettingsDB } from "@/db";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Settings, Trash } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "@/app/i18n";
import Item from "./Item";

export default function InstalledTab() {
    const { extensionStore } = useRootStore();
    const { t } = useTranslation("extensions");
    const [extSettingsPackage, setExtSettingsPackage] = useState<string>("");

    const { data, error, isLoading } = useQuery({
        queryKey: ["getInstalledExtensions"],
        queryFn: () => extensionDB.getAllExtensions(),
    });

    const queryClient = useQueryClient();

    const mutation = useMutation(extensionDB.deleteExtension, {
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["getInstalledExtensions"],
            });
        },
    });

    if (error) {
        return <ErrorView error={error}></ErrorView>;
    }

    if (isLoading) {
        return <LoadingBox />;
    }

    if (!data || data.length === 0) {
        return (
            <div className="mt-28 text-center">
                <p className="text-2xl font-bold">
                    {t("no-installed-extension.title")}
                </p>
                <p className="text-sm">{t("no-installed-extension.message")}</p>
            </div>
        );
    }

    const handleUninstall = (pkg: string) => {
        extensionStore.unloadExtension(pkg);
        mutation.mutate(pkg);
    };

    const handleSettings = (pkg: string) => {
        setExtSettingsPackage(pkg);
    };

    return (
        <div>
            {data.map((extension, index) => (
                <Item
                    key={index}
                    name={extension.name}
                    pkg={extension.package}
                    version={extension.version}
                    icon={extension.icon}
                >
                    <Button
                        onClick={() => {
                            handleSettings(extension.package);
                        }}
                        className="ml-1 flex items-center"
                    >
                        <Settings size={18}></Settings>
                        <span className="ml-1 hidden md:inline-block">
                            {t("settings")}
                        </span>
                    </Button>
                    <Button
                        onClick={() => {
                            handleUninstall(extension.package);
                        }}
                        className="ml-1 flex items-center"
                    >
                        <Trash size={18}></Trash>
                        <span className="ml-1 hidden md:inline-block">
                            {t("remove")}
                        </span>
                    </Button>
                </Item>
            ))}
            <ExtSettingsModal
                pkg={extSettingsPackage}
                onClose={() => setExtSettingsPackage("")}
            />
        </div>
    );
}

function ExtSettingsModal({
    pkg,
    onClose,
}: {
    pkg: string;
    onClose: () => void;
}) {
    const { extensionStore } = useRootStore();
    const extension = extensionStore.getExtension(pkg);
    const { t } = useTranslation("extensions");

    const Settings = () => {
        const { error, isLoading, data, refetch } = useQuery({
            queryKey: [pkg, "settings"],
            queryFn: () => extensionSettingsDB.getSettings(pkg),
        });

        if (error) {
            return <ErrorView error={error} />;
        }

        if (isLoading) {
            return <LoadingBox />;
        }

        if (!data || !data.length) {
            return null;
        }

        const handleChange = (key: string, val: string | boolean) => {
            extensionSettingsDB.setSetting(pkg, key, val);
            refetch();
        };

        return (
            <div>
                <hr className="m-4" />
                {data.map((item, index) => (
                    <div key={index} className="mb-3">
                        <ExtensionSettingsItem
                            settings={item}
                            onChange={(v) => {
                                handleChange(item.key, v);
                            }}
                        />
                        <p className="text-sm text-black text-opacity-70">
                            {item.description}
                        </p>
                    </div>
                ))}
            </div>
        );
    };
    const metadata = [
        {
            name: t("ext-metadata.name"),
            value: extension?.name,
        },
        {
            name: t("ext-metadata.package"),
            value: extension?.package,
        },
        {
            name: t("ext-metadata.version"),
            value: extension?.version,
        },
        {
            name: t("ext-metadata.language"),
            value: extension?.lang,
        },
        {
            name: t("ext-metadata.ext-type"),
            value: extension?.type,
        },
        {
            name: t("ext-metadata.original-site"),
            value: extension?.webSite,
        },
        {
            name: t("ext-metadata.author"),
            value: extension?.author,
        },
        {
            name: t("ext-metadata.license"),
            value: extension?.license,
        },
        {
            name: t("ext-metadata.description"),
            value: extension?.description,
        },
    ];

    return (
        <Modal
            show={Boolean(pkg)}
            onClose={onClose}
            title={t("ext-metadata.title", { extName: extension?.name })}
        >
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                {metadata.map(
                    (item, index) =>
                        item.value && (
                            <p key={index}>
                                <span className="font-bold">{item.name}: </span>
                                {item.value}
                            </p>
                        )
                )}
            </div>
            <Settings />
        </Modal>
    );
}

function ExtensionSettingsItem({
    settings,
    onChange,
}: {
    settings: ExtensionSettings;
    onChange: (v: string | boolean) => void;
}) {
    const [value, setValue] = useState(settings.value ?? settings.defaultValue);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        setValue(e.target.value);
        onChange(e.target.value);
    };

    if (settings.type === "input") {
        return (
            <div>
                <h2 className="mb-3 font-bold">{settings.title}</h2>
                <Input
                    className="mb-3 w-full"
                    value={String(value)}
                    onChange={handleChange}
                />
            </div>
        );
    }

    if (settings.type === "select") {
        if (!settings.options) {
            return null;
        }
        return (
            <div>
                <h2 className="mb-2 font-bold">{settings.title}</h2>
                <Select
                    className="!w-full"
                    options={settings.options}
                    selected={String(value)}
                    onChange={handleChange}
                />
            </div>
        );
    }

    if (settings.type === "checkbox") {
        return (
            <div>
                <label htmlFor={settings.key}>
                    <input
                        className="mr-1 inline-block"
                        type="checkbox"
                        id={settings.key}
                        checked={Boolean(value)}
                        onChange={(e) => {
                            onChange(e.target.checked ? true : false);
                            setValue(e.target.checked ? true : false);
                        }}
                    />
                    {settings.title}
                </label>
            </div>
        );
    }

    return null;
}
