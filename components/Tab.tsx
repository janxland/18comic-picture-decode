"use client"
import clsx from "clsx";
import { ReactNode, useEffect, useState } from "react";

export interface Tabs { title: string, content?: ReactNode }

interface TabProps {
    tabs: Array<Tabs>
    index?: number
    className?: string
    onChange?: (index: number) => void
}

export default function Tab(props: TabProps) {
    const [activeTab, setActiveTab] = useState(0);

    const handleClick = (index: number) => {
        setActiveTab(index);
        props.onChange?.(index)
    };

    useEffect(() => {
        if (props.index !== undefined) {
            setActiveTab(Number(props.index))
        }
    }, [props.index])

    const tabs = props.tabs.map((tab, index) => (
        <button
            key={index}
            onClick={() => handleClick(index)}
            className={
                clsx(
                    "pl-3 pr-3 pt-2 pb-2 mr-2 border rounded-full text-sm break-keep ",
                    `${activeTab === index ? "bg-black text-white dark:bg-black " : "bg-white dark:bg-zinc-700"}`
                )
            }
        >
            {tab.title}
        </button>
    ));

    return (
        <div className={clsx("overflow-x-scroll scrollbar-none")}>
            {
                props.tabs.length > 0 && (
                    <>
                        <div className={clsx("overflow-auto flex scrollbar-none", props.className)}>
                            {tabs}
                        </div>
                        <div className="mt-3">{props.tabs[activeTab].content}</div>
                    </>
                )
            }
        </div>
    );
}
