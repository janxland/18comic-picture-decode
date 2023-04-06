import { useRootStore } from "@/context/root-context"
import { useQuery } from "react-query"

export default function CheckUpdate({ pkg, url }: { pkg: string, url: string }) {
    const { extensionStore } = useRootStore()
    const { data, error } = useQuery(`checkUpdate${pkg}${url}`, () => {
        return extensionStore.getExtension(pkg)?.checkUpdate(url)
    })
    if (!data || error) {
        return <></>
    }
    return (
        <>{data}</>
    )
}