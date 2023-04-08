"use client"
import BaseMargin from "@/components/BaseMargin";
import Button from "@/components/common/Button";
import IconLogo from "@/components/icons/IconLogo";
import Layout from "@/components/Layout";
import Tab from "@/components/Tab";
import { useRootStore } from "@/context/root-context";
import { loveDB } from "@/db";
import packageInfo from "@/package.json";
import {
    Undo as IconUndo
} from 'lucide-react';
import { observer } from "mobx-react-lite";
import { ChangeEvent, ChangeEventHandler, ReactNode, useEffect, useState } from "react";
import { setLanguage, useTranslation } from "../i18n/client";
import { languages } from "../i18n/settings";


export default function SettingsPage() {
    const { t } = useTranslation("settings")
    return (
        <Layout>
            <BaseMargin>
                <h1 className="text-3xl font-bold mb-6">{t("title")}</h1>
                <Tab
                    className="mb-6"
                    tabs={[
                        { title: t('general.title'), content: <GeneralTab /> },
                        { title: t('data.title'), content: <DataTab /> },
                        { title: t('about.title'), content: <AboutTab /> }
                    ]}
                />
            </BaseMargin>
        </Layout>
    )
}


function GeneralTab() {
    const { t, i18n } = useTranslation('settings')

    const languageOptions: {
        value: string,
        label: string
    }[] = []
    languages.forEach((language) => {
        languageOptions.push({
            value: language,
            label: language,
        })
    })

    const handleLanguageChange = (e: ChangeEvent<HTMLSelectElement>) => {
        setLanguage(e.target.value)
    }

    return (
        <div>
            <Input title={t('general.miru-proxy')} bindKey="miruProxy" />
            <Input title={t('general.repository')} bindKey="miruRepo" />
            <Input title={t('general.tmdb-key')} bindKey="TMDBKey" />
            <Select title={t('general.language')} onChange={handleLanguageChange} options={languageOptions} selected={i18n.language} />
        </div>
    )
}

function DataTab() {
    const { historyStore } = useRootStore()
    const { t } = useTranslation('settings')
    return (
        <div>
            <ClearCacheBotton
                title={t('data.history')}
                count={historyStore.history.length}
                clearCallBack={() => { historyStore.clearHistory() }} />
            <ClearCacheBotton
                title={t('data.collection')}
                count={loveDB.getAllLove}
                clearCallBack={loveDB.deleteAllLove} />
        </div>
    )
}

function AboutTab() {
    const { t } = useTranslation('settings')
    return (
        <div className="prose">
            <IconLogo width={100} />
            <p>{t('about.cuurent-version')} {packageInfo.version}</p>
            <p>{t('about.open-source')}<a href="https://github.com/miru-project/miru" target="_blank" rel="noreferrer">Github</a></p>
            <p>本项目灵感来自 <a href="https://tachiyomi.org/" target="_blank" rel="noopener noreferrer">tachiyomi</a></p>
        </div>
    )
}


function Title({ children, className }: { children: ReactNode, className?: string }) {
    return (
        <h1 className={`text-1xl font-bold mb-3 ${className}`}>
            {children}
        </h1>
    )
}

const Input = observer(({ title, bindKey }: { title: string, bindKey: string }) => {
    const { settingsStore } = useRootStore()
    const [value, setValue] = useState("")

    useEffect(() => {
        setValue(settingsStore.getSetting(bindKey))
    }, [settingsStore.getSetting(bindKey)])

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        settingsStore.setSetting(bindKey, e.target.value)
    }

    return (
        <div>
            <Title className="flex">
                {title}
                {
                    settingsStore.envItems.get(bindKey) === value
                        ?
                        null
                        :
                        <span className="ml-2 cursor-pointer"> <IconUndo width={20} onClick={() => {
                            settingsStore.resetSetting(bindKey)
                        }}></IconUndo></span>
                }
            </Title>
            <input
                className="text-sm w-full md:w-96 pl-3 pt-2 pb-2 pr-3 mr-3  border rounded-3xl mb-3"
                type="text"
                value={value || ''}
                onChange={
                    handleChange
                }
            />
        </div>
    )
})

function Select(
    {
        title,
        options,
        selected,
        onChange
    }: {
        title: string
        options: Array<{ value: string, label: string }>
        selected: string,
        onChange?: ChangeEventHandler<HTMLSelectElement>
    }
) {
    return (
        <div>
            <Title>{title}</Title>
            <select onChange={onChange} defaultValue={selected} className="text-sm w-full md:w-96 pl-3 pt-2 pb-2 pr-3 mr-3  border rounded-3xl mb-3">
                {
                    options.map((option, index) => {
                        return (
                            <option key={index} value={option.value} >{option.label}</option>
                        )
                    })
                }
            </select>
        </div>
    )
}

// const Checkbox = observer(({title, bindKey}: {title: string, bindKey: string }) => {
//     const { settingsStore } = useRootStore()
//     const [checked, setChecked] = useState(false)
//     useEffect(() => {
//         setChecked(settingsStore.getSetting(bindKey) ? true : false)
//     }, [settingsStore.getSetting(bindKey)])

//     return (
//         <div>
//             <Title>{title}</Title>
//             <label htmlFor={title}>
//                 <input type="checkbox" id={title} checked={checked} onChange={() => {
//                     settingsStore.setSetting(bindKey, !checked)
//                 }} />
//                 启用{title}
//             </label>
//         </div>
//     )
// })

function ClearCacheBotton(props: {
    title: string,
    count: (() => Promise<Array<any>>) | number,
    clearCallBack: () => void
}) {

    const [count, setCount] = useState(0)
    const { t } = useTranslation('settings')

    useEffect(() => {
        if (typeof props.count === "number") {
            setCount(props.count)
            return
        }
        props.count().then((res) => {
            setCount(res.length)
        })
    }, [])

    return (
        <div className="mb-3">
            <span className="mr-3"> {props.title} <span className="pl-2 pr-2  bg-black text-white rounded-lg">{count}</span>  </span>
            <Button onClick={() => {
                props.clearCallBack()
                // 直接给他显示0（
                setCount(0)
            }}>
                {t('data.clear')}
            </Button>
        </div>
    )
}


