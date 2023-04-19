import { Extension } from "@/extension/extension";
import { Detail } from "@/types/extension";
import { createContext, SetStateAction, useContext } from "react";

export interface WatchData {
    detail: Detail;
    pkg: string;
    url: string;
    extension: Extension;
    background?: string;
    tmdbId?: number;
    mediaType?: "movie" | "tv";
    setWatchData: (value: SetStateAction<WatchData | undefined>) => void;
}

export const WatchContext = createContext<WatchData | undefined>(undefined);

export function useWatchContext() {
    const context = useContext(WatchContext);
    if (context === undefined) {
        throw new Error("useWatchContext must be used within a WatchProvider");
    }
    return context;
}

export function WatchProvider({
    children,
    value,
}: {
    children: React.ReactNode;
    value: WatchData | undefined;
}) {
    return (
        <WatchContext.Provider value={value}>{children}</WatchContext.Provider>
    );
}
