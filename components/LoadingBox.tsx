import clsx from "clsx";
import { Loader2 } from "lucide-react";

export default function LoadingBox({ className }: { className?: string }) {
    return (
        <div
            className={clsx(
                "flex h-full w-full items-center justify-center",
                className
            )}
        >
            <Loader2 size={50} className="animate-spin"></Loader2>
        </div>
    );
}
