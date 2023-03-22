import { useEffect, useState } from "react";

export default function ErrorView({ error }: { error: any }) {
    const [msg, setMsg] = useState<string>("")

    useEffect(() => {
        if (typeof error === "object") {
            return setMsg((error as Object).toString())
        }
        setMsg(error)
    }, [error])
    return (
        <div className="text-center mt-28">
            <p className="text-2xl font-bold">发生了错误＞﹏＜</p>
            <p className="text-sm">{msg}</p>
        </div>
    )
}
