import { Settings, settingsDB } from "@/db";
import { isClient } from "@/utils/is-client";
import { autorun, makeAutoObservable } from "mobx";


export default class SettingsStore {

    items: Map<string, any> = new Map()

    envItems: Map<string, any> = new Map()

    ready: boolean = false

    constructor() {
        makeAutoObservable(this)
        autorun(
            () => {
                if (isClient()) {
                    const theme = this.getSetting("theme")
                    const setDark = () => document.documentElement.classList.add("dark")
                    const setLight = () => document.documentElement.classList.remove("dark")
                    if (theme === "auto") {
                        const prefersDark = window.matchMedia("(prefers-color-scheme: dark)")
                        prefersDark.matches ? setDark() : setLight()
                        prefersDark.addEventListener("change", (e) => {
                            if (this.getSetting("theme") !== "auto") {
                                return
                            }
                            if (e.matches) {
                                setDark()
                                return
                            }
                            setLight()
                        })
                    }
                    if (theme === "dark") {
                        setDark()
                    }
                    if (theme === "light") {
                        setLight()
                    }
                }
            }
        )
    }

    async init() {
        if (!isClient()) {
            return
        }

        const settings = await settingsDB.getAllSettings()

        settings.forEach((setting: Settings) => {
            this.setSetting(setting.key, setting.value)
        })

        this.envItems.set("theme", process.env.NEXT_PUBLIC_MIRU_THEME);
        this.envItems.set("miruProxy", process.env.NEXT_PUBLIC_MIRU_PROXY_URL);
        this.envItems.set("miruRepo", process.env.NEXT_PUBLIC_MIRU_REPO_URL);
        this.envItems.set("kanban", process.env.NEXT_PUBLIC_MIRU_KANBAN);
        this.envItems.set("TMDBKey", process.env.NEXT_PUBLIC_MIRU_TMDB_KEY);
        this.envItems.set("model", process.env.NEXT_PUBLIC_MIRU_MODEL);

        this.envItems.forEach((value, key) => {
            if (!this.getSetting(key)) {
                this.setSetting(key, value)
            }
        })
    }

    getSetting(key: string) {
        return this.items.get(key)
    }

    setSetting(key: string, value: any) {
        this.items.set(key, value)
        settingsDB.setSettings(key, value)
    }

    resetSetting(key: string) {
        this.setSetting(key, this.envItems.get(key))
    }


}

