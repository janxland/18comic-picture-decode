import { useTranslation } from "@/app/i18n";
import InitView from "@/components/InitView";
import { RootStore } from "@/store/root";
import { isClient } from "@/utils/is-client";
import { DefaultTFuncReturn } from "i18next";
import { configure } from "mobx";
import { enableStaticRendering } from "mobx-react-lite";
import { createContext, useContext, useEffect, useState } from "react";


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
    const { t } = useTranslation("init")
    const [initMsg, setInitMsg] = useState<DefaultTFuncReturn>()

    useEffect(() => {
        if (isClient()) {
            setInitMsg(t('initializing'));
            (async () => {
                setInitMsg(t('initialization-settings'))
                await store.settingsStore.init()
                setInitMsg(t('initialization-extensions'))
                await store.extensionStore.init()
                setInitMsg(t('initialization-historys'))
                await store.historyStore.init()
                setOk(true)
            })()
        }
    }, [])

    if (!ok) {
        return (
            <InitView msg={initMsg} />
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