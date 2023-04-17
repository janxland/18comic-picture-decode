import { HtmlHTMLAttributes } from "react";
import { clsx } from "clsx";

export default function Button(props: HtmlHTMLAttributes<HTMLButtonElement>) {
    return (
        <button
            {...props}
            className={clsx(
                "rounded-3xl border bg-black pl-4 pr-4 pt-2 pb-2 text-sm text-white focus:ring-2 focus:ring-gray-500",
                props.className
            )}
        >
            {props.children}
        </button>
    );
}
