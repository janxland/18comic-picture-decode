import { ReactNode } from "react";

export default function Title({ children, className }: { children: ReactNode, className?: string }) {
    return (
        <h1 className={`text-1xl font-bold mb-3 ${className}`}>
            {children}
        </h1>
    )
}