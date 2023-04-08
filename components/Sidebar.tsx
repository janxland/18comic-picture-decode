import { useTranslation } from '@/app/i18n/client'
import clsx from 'clsx'
import {
    Home as IconHome, LayoutGrid as IconExtension, Search as IconSearh, Settings as IconSettings
} from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import Logo from './Logo'



export default function Sidebar() {
    const path = usePathname() as string
    const { t } = useTranslation("sidebar")
    const menu = [
        {
            title: t("home"),
            path: "/",
            icon: IconHome,
        },
        {
            title: t("search"),
            path: "/search",
            icon: IconSearh,
        },
        {
            title: t("extensions"),
            path: "/extension",
            icon: IconExtension,
        },
        {
            title: t("settings"),
            path: "/settings",
            icon: IconSettings,
        },
    ]
    const baseClassNames = clsx("flex-col w-20 h-20 lg:h-auto lg:w-auto lg:flex-row items-center cursor-pointer lg:mb-2 p-4 rounded-3xl flex ")

    return (
        <>
            <div className="fixed right-0 left-0 bottom-0 z-50 p-2 overflow-auto bg-slate-100 bg-opacity-80 backdrop-blur transition-all lg:p-5 lg:w-230px lg:left-0 lg:top-0 dark:bg-black dark:backdrop-blur dark:bg-opacity-80">
                <div className="mb-6 ml-4 hidden lg:block">
                    <Logo />
                </div>
                <ul className="flex justify-center lg:block">
                    {
                        menu.map((item, i) =>
                            <li key={i}>
                                <Link
                                    href={item.path}
                                    className={(path === item.path ? clsx(baseClassNames, "bg-black text-white ring-4 ring-gray-300 dark:bg-zinc-700 dark:text-white") : clsx(baseClassNames, "hover:opacity-50"))}>
                                    <item.icon
                                        className={clsx("mb-1 lg:mr-2 lg:mb-0", { "text-white ": path === item.path }, {
                                        })}
                                        width={24}
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
