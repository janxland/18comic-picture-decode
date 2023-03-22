import { ListItem } from "@/types/extension";
import clsx from "clsx";
import { HTMLProps, ReactNode } from "react";


function Grid(props: HTMLProps<HTMLDivElement>) {
    return (
        <div className={clsx("grid grid-cols-2 gap-3 md:grid-cols-4 lg:grid-cols-5", props.className)}>
            {props.children}
        </div>
    )
}
function Fragment({ itemData }: { itemData: ListItem }) {
    return (
        <>
            <img className="rounded-lg object-cover h-4/5 w-full" src={itemData.cover} alt={itemData.title} />
            <div className="h-2/5">
                <p className="text-gray-400 text-xs mt-3 mb-1"> {itemData.update}</p>
                <p>{itemData.title}</p>
            </div>
        </>
    )
}

const BangumiGrid = {
    Grid,
    Fragment
}

export default BangumiGrid