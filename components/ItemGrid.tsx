import { ListItem } from "@/types/extension";
import clsx from "clsx";
import { HTMLProps } from "react";
import LoadingImg from "./common/LoadingImg";

function Grid(props: HTMLProps<HTMLDivElement>) {
    return (
        <div
            className={clsx(
                "grid grid-cols-2 gap-3 md:grid-cols-4 lg:grid-cols-5",
                props.className
            )}
        >
            {props.children}
        </div>
    );
}
function Fragment({ itemData }: { itemData: ListItem }) {
    return (
        <>
            <div className="h-60vw max-h-96 w-full md:h-30vw lg:h-20vw">
                {(itemData.cover && (
                    <LoadingImg
                        className="h-full w-full rounded-lg object-cover"
                        src={itemData.cover}
                        alt={itemData.title}
                    />
                )) || (
                    <div className="flex h-full w-full items-center justify-center rounded-lg bg-gray-200 p-3 text-xl ">
                        {itemData.title}
                    </div>
                )}
            </div>
            <div>
                <p className="mt-3 mb-1 text-xs text-gray-400">
                    {" "}
                    {itemData.update}
                </p>
                <p>{itemData.title}</p>
            </div>
        </>
    );
}

const ItemGrid = {
    Grid,
    Fragment,
};

export default ItemGrid;
