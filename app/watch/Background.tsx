"use client"

import { useWatchContext } from "@/context/watch-context"

// 背景图片
export function Background() {
    const { background } = useWatchContext()
    return (
        <>
            <div className="fixed left-0 right-0 bottom-0 top-0 -z-30 bg-cover bg-no-repeat p-4"
                style={{ backgroundImage: `url(${background})`, minHeight: "20rem" }}>
            </div>
            <div className="fixed left-0 lg:left-230px right-0 bottom-0 top-0 -z-10 bg-white bg-opacity-95 dark:bg-zinc-700 dark:bg-opacity-95"></div>
        </>
    )
}