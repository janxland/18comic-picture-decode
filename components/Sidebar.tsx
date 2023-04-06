import IconLogo from '@/components/icons/IconLogo'
import clsx from 'clsx'
import {
    Home as IconHome, LayoutGrid as IconExtension, Search as IconSearh, Settings as IconSettings
} from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'


function Logo() {
    return (
        <IconLogo width={80}></IconLogo>
    )
}

export default function Sidebar() {
    const [path, setPath] = useState<string>("")
    const pathname = usePathname() as string

    useEffect(() => {
        setPath(pathname)
    }, [pathname])

    const menu = [
        {
            title: "首页",
            path: "/",
            icon: IconHome,
        },
        {
            title: "探索",
            path: "/search",
            icon: IconSearh,
        },
        {
            title: "扩展",
            path: "/extension",
            icon: IconExtension,
        },
        {
            title: "设置",
            path: "/settings",
            icon: IconSettings,
        },
    ]

    const baseClassNames = clsx("flex-col w-20 h-20 lg:h-auto lg:w-auto lg:flex-row items-center cursor-pointer lg:mb-2 p-4 rounded-3xl flex")

    return (
        <>
            <div className="fixed right-0 left-0 bottom-0 z-50 p-2 overflow-auto bg-white bg-opacity-80 backdrop-blur border transition-all lg:p-5 lg:w-230px lg:left-0 lg:top-0">
                <div className="mb-6 ml-4 hidden lg:block">
                    <Logo />
                </div>
                <ul className="flex justify-center lg:block">
                    {
                        menu.map((item, i) =>
                            <li key={i}>
                                <Link
                                    href={item.path}
                                    className={(path === item.path ? clsx(baseClassNames, "bg-black text-white ring-4 ring-gray-300") : clsx(baseClassNames, "hover:opacity-50"))}>
                                    <item.icon
                                        className="mb-1 lg:mr-2 lg:mb-0"
                                        width={24}
                                        color={path === item.path ? "#fff" : "#000"}
                                    />
                                    <div className="text-sm lg:text-lg">{item.title}</div>
                                </Link>
                            </li>
                        )
                    }
                </ul>
            </div>
        </>
    )
}
