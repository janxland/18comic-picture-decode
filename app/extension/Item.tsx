import { ReactNode } from "react";

interface ExtensionProps {
    name: string;
    pkg: string;
    version: string;
    icon?: string;
    children?: ReactNode;
}

export default function Item(props: ExtensionProps) {
    return (
        <div className="flex justify-between transition-all text-black border rounded-xl p-3 mb-3 dark:bg-zinc-800  dark:text-white">
            <div className="flex">
                {props.icon ? (
                    <img
                        className="hidden md:block object-contain mr-3 h-16 w-24"
                        src={props.icon}
                        alt={props.name}
                    />
                ) : null}
                <div>
                    <p className="text-lg mb-1">
                        {props.name}
                        <span className="text-xs ml-1 pl-2 pr-2 pt-1 pb-1 rounded-full bg-black text-white dark:bg-neutral-600 dark:text-zinc-50">
                            {props.version}
                        </span>
                    </p>
                    <p className="text-sm">{props.pkg}</p>
                </div>
            </div>
            <div className="flex justify-end items-end">{props.children}</div>
        </div>
    );
}
