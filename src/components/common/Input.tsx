import clsx from "clsx";
import { InputHTMLAttributes } from "react";

export default function Input(props: InputHTMLAttributes<HTMLInputElement>) {
    const classNames = clsx(
        props.className,
        "focus:ring-2",
        "focus:ring-gray-500",
        "border",
        "pl-4",
        "pr-4",
        "pt-2",
        "pb-2",
        "text-sm",
        "bg-black",
        "text-white",
        "rounded-3xl",
    )

    return (
        <input {...props} className={classNames} />
    )
}