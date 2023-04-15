import clsx from "clsx";
import { HTMLProps } from "react";

export default function SkeletonBlock(props: HTMLProps<HTMLDivElement>) {
    return (
        <div {...props} className={clsx("w-full h-full bg-slate-200 dark:bg-zinc-700 animate-pulse rounded-xl", props.className)}></div>
    )
}