import IconLoder from "./icons/Iconloader";

export default function LoadingBox() {
    return (
        <div className="flex justify-center items-center h-full w-full">
            <IconLoder width={50} className="animate-spin"></IconLoder>
        </div>
    )
}