import { useRootStore } from "@/context/root-context";
import { Undo } from "lucide-react";
import { observer } from "mobx-react-lite";
import { ChangeEvent, useEffect, useState } from "react";
import Title from "./Title";

const Input = observer(
    ({ title, bindKey }: { title: string; bindKey: string }) => {
        const { settingsStore } = useRootStore();
        const [value, setValue] = useState("");

        useEffect(() => {
            setValue(settingsStore.getSetting(bindKey));
        }, [settingsStore.getSetting(bindKey)]);

        const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
            settingsStore.setSetting(bindKey, e.target.value);
        };

        return (
            <div>
                <Title className="flex">
                    {title}
                    {settingsStore.envItems.get(bindKey) === value ? null : (
                        <span className="ml-2 cursor-pointer">
                            {" "}
                            <Undo
                                width={20}
                                onClick={() => {
                                    settingsStore.resetSetting(bindKey);
                                }}
                            ></Undo>
                        </span>
                    )}
                </Title>
                <input
                    className="mr-3 mb-3 w-full rounded-3xl border pl-3 pt-2 pb-2  pr-3 text-sm dark:bg-black md:w-96"
                    type="text"
                    value={value || ""}
                    onChange={handleChange}
                />
            </div>
        );
    }
);

export default Input;
