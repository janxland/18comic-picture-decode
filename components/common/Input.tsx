import clsx from "clsx";
import { InputHTMLAttributes } from "react";

export default function Input(props: InputHTMLAttributes<HTMLInputElement>) {
    return (
        <input
            {...props}
            className={clsx(
                "rounded-3xl border pl-4 pr-4 pt-2 pb-2 text-sm dark:bg-black dark:text-white",
                props.className
            )}
        />
    );
}
