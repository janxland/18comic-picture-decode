export const fallbackLng = 'en'
export const languages = [fallbackLng, 'zh-CN']
export const defaultNS = 'common'

export function getOptions(lng: string = fallbackLng, ns: string[] | string = defaultNS) {
    return {
        // debug: true,
        supportedLngs: languages,
        fallbackLng,
        lng,
        fallbackNS: defaultNS,
        defaultNS,
        ns
    }
}