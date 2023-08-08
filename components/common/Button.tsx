import { HtmlHTMLAttributes } from "react";
import { clsx } from "clsx";
import { Loader2 } from "lucide-react";

interface ButtonProps extends HtmlHTMLAttributes<HTMLButtonElement> {
    loading?:boolean
}

export default function Button(props: ButtonProps) {
    return (
        <button
            {...props}
            className={clsx(
                "rounded-3xl border bg-black pl-4 pr-4 pt-2 pb-2 text-sm text-white focus:ring-2 focus:ring-gray-500",
                props.className
            )}
        >
          {props.loading && 
            <Loader2 className="animate-spin" /> ||
            props.children
          } 
        </button>
    );
}
