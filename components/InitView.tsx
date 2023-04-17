import { DefaultTFuncReturn } from "i18next";
import LoadingBox from "./LoadingBox";
import IconLogo from "./icons/IconLogo";

export default function InitView({
    msg,
}: {
    msg?: string | DefaultTFuncReturn;
}) {
    return (
        <div className="h-screen flex justify-center items-center">
            <div className="flex flex-col items-center">
                <IconLogo className="mb-3" width={110} />
                <LoadingBox />
                <p className="mt-3">{msg}</p>
            </div>
        </div>
    );
}
