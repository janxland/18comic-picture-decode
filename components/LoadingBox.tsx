import { Loader2 } from "lucide-react";

export default function LoadingBox() {
    return (
        <div className="flex h-full w-full items-center justify-center">
            <Loader2 size={50} className="animate-spin"></Loader2>
        </div>
    );
}
