import { useRootStore } from "@/context/root-context";
import { useQuery } from "@tanstack/react-query";

export default function CheckUpdate({
    pkg,
    url,
}: {
    pkg: string;
    url: string;
}) {
    const { extensionStore } = useRootStore();
    const { data, error } = useQuery({
        queryKey: ["checkUpdate", pkg, url],
        queryFn: () => extensionStore.getExtension(pkg)?.checkUpdate(url),
    });
    if (!data || error) {
        return <></>;
    }
    return <>{data}</>;
}
