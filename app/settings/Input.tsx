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
                    className="text-sm w-full md:w-96 pl-3 pt-2 pb-2 pr-3 mr-3  border rounded-3xl mb-3 dark:bg-black"
                    type="text"
                    value={value || ""}
                    onChange={handleChange}
                />
            </div>
        );
    }
);

export default Input;
