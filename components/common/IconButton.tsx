import clsx from "clsx";
import { ButtonHTMLAttributes } from "react";

export default function IconButton(
    props: ButtonHTMLAttributes<HTMLButtonElement>
) {
    return (
        <button
            {...props}
            className={clsx(
                "rounded-full p-2 hover:bg-black hover:bg-opacity-20",
                props.className
            )}
        >
            {props.children}
        </button>
    );
}
