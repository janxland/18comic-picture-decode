import clsx from "clsx";
import { ChangeEventHandler } from "react";

export interface SelectProps {
    options: Array<{ value: string; label: string }>;
    selected: string;
    onChange?: ChangeEventHandler<HTMLSelectElement>;
    className?: string;
}

export default function Select({
    options,
    selected,
    onChange,
    className,
}: SelectProps) {
    return (
        <select
            onChange={onChange}
            defaultValue={selected}
            className={clsx(
                "mr-3 mb-3 w-full rounded-3xl border pl-3 pt-2 pb-2  pr-3 text-sm dark:bg-black md:w-96",
                className
            )}
        >
            {options.map((option, index) => {
                return (
                    <option key={index} value={option.value}>
                        {option.label}
                    </option>
                );
            })}
        </select>
    );
}
