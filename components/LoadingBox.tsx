import { Loader2 } from "lucide-react";

export default function LoadingBox() {
    return (
        <div className="flex justify-center items-center h-full w-full">
            <Loader2 size={50} className="animate-spin"></Loader2>
        </div>
    )
}