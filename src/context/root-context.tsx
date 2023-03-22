import { RootStore } from "@/store/root";
import { createContext, useContext, useEffect, useState } from "react";
import { enableStaticRendering } from "mobx-react-lite";
import { configure } from "mobx";
import { isClient } from "@/utils/is-client";
import LoadingBox from "@/components/LoadingBox";
import { motion } from "framer-motion";
import IconLogo from "@/components/icons/IconLogo";


enableStaticRendering(!isClient)

configure({
    useProxies: 'always',
})

let $store: RootStore
const RootContext = createContext<RootStore | undefined>(undefined);


export function useRootStore() {
    const context = useContext(RootContext);
    if (context === undefined) {
        throw new Error('useRootStore must be used within RootStoreProvider')
    }
    return context;
}

export const store = initializeStore()
export function RootStoreProvider({ children }: { children: React.ReactNode }) {
    const [ok, setOk] = useState(false);
    const [initMsg, setInitMsg] = useState<string>("")

    useEffect(() => {
        if (isClient()) {
            (async () => {
                setInitMsg('正在初始化设置...')
                await store.settingsStore.init()
                setInitMsg('正在初始化扩展...')
                await store.extensionStore.init()
                setOk(true)
            })()
        }
    }, [])

    if (!ok) {
        return (
            <div className="h-screen flex justify-center items-center">
                <div>
                    <IconLogo className="mb-3" />
                    <LoadingBox />
                    <p className="mt-3">{initMsg}</p>
                </div>
            </div>
        )
    }

    return (
        <RootContext.Provider value={store} >
            {children}
        </RootContext.Provider>
    );
}


function initializeStore(): RootStore {
    const _store = $store ?? new RootStore()

    // For SSG and SSR always create a new store
    if (typeof window === 'undefined') return _store
    // Create the store once in the client
    if (!$store) $store = _store

    return _store
} 