import { createInstance } from 'i18next';
import resourcesToBackend from 'i18next-resources-to-backend';
import { cookies } from "next/headers";
import { initReactI18next } from 'react-i18next/initReactI18next';
import { fallbackLng, getOptions } from './settings';

const initI18next = async (lng: string, ns?: string[] | string) => {
    const i18nInstance = createInstance()
    await i18nInstance
        .use(initReactI18next)
        .use(resourcesToBackend((language: string, namespace: string) => import(`./locales/${language}/${namespace}.json`)))
        .init(getOptions(lng, ns))
    return i18nInstance
}

export async function useTranslation(ns?: string[] | string, options: any = {}) {
    const cookie = cookies()
    const lng = cookie.get("language")?.value || fallbackLng
    const i18nextInstance = await initI18next(lng, ns)
    return {
        t: i18nextInstance.getFixedT(lng, Array.isArray(ns) ? ns[0] : ns, options.keyPrefix),
        i18n: i18nextInstance
    }
}