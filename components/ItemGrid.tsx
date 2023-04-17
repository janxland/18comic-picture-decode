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
            <div className="h-60vw md:h-30vw lg:h-20vw max-h-96 w-full">
                {(itemData.cover && (
                    <LoadingImg
                        className="rounded-lg object-cover h-full w-full"
                        src={itemData.cover}
                        alt={itemData.title}
                    />
                )) || (
                    <div className="rounded-lg w-full h-full bg-gray-200 p-3 flex justify-center items-center text-xl ">
                        {itemData.title}
                    </div>
                )}
            </div>
            <div>
                <p className="text-gray-400 text-xs mt-3 mb-1">
                    {" "}
                    {itemData.update}
                </p>
                <p>{itemData.title}</p>
            </div>
        </>
    );
}

const BangumiGrid = {
    Grid,
    Fragment,
};

export default BangumiGrid;
