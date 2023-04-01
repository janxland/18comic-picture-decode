import BaseMargin from "@/components/BaseMargin";
import Button from "@/components/common/Button";
import Layout from "@/components/Layout";
import { useRootStore } from "@/context/root-context";
import { observer } from "mobx-react-lite";
import Head from "next/head";
import { historyDB, loveDB } from "@/db"
import { ChangeEvent, ReactNode, useEffect, useState } from "react";
import Tab from "@/components/Tab";
import IconLogo from "@/components/icons/IconLogo";
import packageInfo from "../../package.json";
import {
    Undo as IconUndo
} from 'lucide-react'

export default function Settings() {
    return (
        <>
            <Head>
                <title>设置</title>
            </Head>
            <Layout>
                <BaseMargin>
                    <h1 className="text-3xl font-bold mb-6">设置</h1>
                    <Tab
                        className="mb-6"
                        tabs={[
                            { title: "常规", content: <GeneralTab /> },
                            { title: "数据", content: <DataTab /> },
                            { title: "关于", content: <AboutTab /> }
                        ]}
                    />
                </BaseMargin>
            </Layout>
        </>
    )
}


function GeneralTab() {
    return (
        <div>
            <Input title="Miru Proxy" bindKey="miruProxy" />
            <Input title="仓库" bindKey="miruRepo" />
            <Input title="TMDB Key" bindKey="TMDBKey"></Input>
            <Checkbox title="看板娘" bindKey="kanban" ></Checkbox>
        </div>
    )
}

function DataTab() {
    const { historyStore } = useRootStore()
    return (
        <div>
            <ClearCacheBotton
                title="观看记录"
                count={historyStore.history.length}
                clearCallBack={() => { historyStore.clearHistory() }} />
            <ClearCacheBotton
                title="收藏记录"
                count={loveDB.getAllLove}
                clearCallBack={loveDB.deleteAllLove} />
        </div>
    )
}

function AboutTab() {
    return (
        <div className="prose">
            <IconLogo width={100} />
            <p>当前版本：{packageInfo.version}</p>
            <p>开源：<a href="https://github.com/miru-project/miru" target="_blank" rel="noreferrer">Github</a></p>
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

const Checkbox = observer(({ title, bindKey }: { title: string, bindKey: string }) => {
    const { settingsStore } = useRootStore()
    const [checked, setChecked] = useState(false)
    useEffect(() => {
        setChecked(settingsStore.getSetting(bindKey) ? true : false)
    }, [settingsStore.getSetting(bindKey)])

    return (
        <div>
            <Title>{title}</Title>
            <label htmlFor={title}>
                <input type="checkbox" id={title} checked={checked} onChange={() => {
                    settingsStore.setSetting(bindKey, !checked)
                }} />
                启用{title}
            </label>
        </div>
    )
})

function ClearCacheBotton(props: {
    title: string,
    count: (() => Promise<Array<any>>) | number,
    clearCallBack: () => void
}) {

    const [count, setCount] = useState(0)

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
        <div>
            <Title>{props.title}</Title>
            <div>

            </div>
            <span className="mr-3">
                {props.title}现共有 <span className="pl-2 pr-2  bg-black text-white rounded-lg">{count}</span>
            </span>
            <Button onClick={() => {
                props.clearCallBack()
                // 直接给他显示0（
                setCount(0)
            }}>
                清空
            </Button>
        </div>
    )
}


