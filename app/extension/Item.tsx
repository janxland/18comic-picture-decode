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
        <div className="mb-3 flex justify-between rounded-xl border p-3 text-black transition-all dark:bg-zinc-800  dark:text-white">
            <div className="flex">
                {props.icon ? (
                    <img
                        className="mr-3 hidden h-16 w-24 object-contain md:block"
                        src={props.icon}
                        alt={props.name}
                    />
                ) : null}
                <div>
                    <p className="mb-1 text-lg">
                        {props.name}
                        <span className="ml-1 rounded-full bg-black pl-2 pr-2 pt-1 pb-1 text-xs text-white dark:bg-neutral-600 dark:text-zinc-50">
                            {props.version}
                        </span>
                    </p>
                    <p className="text-sm">{props.pkg}</p>
                </div>
            </div>
            <div className="flex items-end justify-end">{props.children}</div>
        </div>
    );
}
