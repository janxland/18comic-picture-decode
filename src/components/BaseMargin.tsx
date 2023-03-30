import clsx from "clsx";
import { HTMLProps } from "react";

export default function BaseMargin(props: HTMLProps<HTMLDivElement>) {
    return (
        <div
            {...props}
            className={clsx("pl-5 pt-5 md:pl-10 md:pr-10 md:pt-10",props.className)} >
            {props.children}
        </div>
    )

}