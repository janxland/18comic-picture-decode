import { ReactNode } from "react";
import clsx from "clsx";

export default function Title({
    children,
    className,
}: {
    children: ReactNode;
    className?: string;
}) {
    return (
        <h1 className={clsx("text-1xl mb-3 font-bold", className)}>
            {children}
        </h1>
    );
}
