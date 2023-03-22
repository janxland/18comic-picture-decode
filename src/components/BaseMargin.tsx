import clsx from "clsx";
import { HTMLProps } from "react";

export default function BaseMargin(props: HTMLProps<HTMLDivElement>) {
    const classNames = clsx(
        props.className,
        "pl-5",
        "pt-5",
        "pr-5",
        "md:pl-10",
        "md:pr-10",
        "md:pt-10",
    )
    return (
        <div
            {...props}
            className={classNames} >
            {props.children}
        </div>
    )

}