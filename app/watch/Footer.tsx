"use client"

import { useWatchContext } from "@/context/watch-context"
import { useTranslation } from "../i18n/client"

export default function Footer() {
    const { extension } = useWatchContext()
    const { t } = useTranslation("watch")
    return (
        <div className="flex justify-center items-center mb-3">
            <div className="text-center text-black text-opacity-40 dark:text-white dark:text-opacity-40">
                <p>{t('footer.origin', { ext: extension.name })}</p>
                <p>{t('footer.infomation-error')} <span className="font-bold" >{t('footer.change')}</span></p>
            </div>
        </div>
    )
}