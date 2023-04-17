import { ReactNode } from "react";

export default function Title({
    children,
    className,
}: {
    children: ReactNode;
    className?: string;
}) {
    return (
        <h1 className={`text-1xl mb-3 font-bold ${className}`}>{children}</h1>
    );
}
