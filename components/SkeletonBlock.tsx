import clsx from "clsx";
import { HTMLProps } from "react";

export default function SkeletonBlock(props: HTMLProps<HTMLDivElement>) {
    return (
        <div
            {...props}
            className={clsx(
                "h-full w-full animate-pulse rounded-xl bg-slate-200 dark:bg-zinc-700",
                props.className
            )}
        ></div>
    );
}
