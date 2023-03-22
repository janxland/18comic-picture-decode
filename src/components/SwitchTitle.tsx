import { useRootStore } from "@/context/root-context"
import { observer } from "mobx-react-lite"
import Tab from "./Tab"

interface SwitchTitleProps {
    title: string,
    handleTabChange?: (index: number) => void
}

const SwitchTitle = observer((props: SwitchTitleProps) => {
    const { settingsStore } = useRootStore()

    const tabs = [
        { title: "影视" },
        { title: "漫画" },
        { title: "小说" },
    ]

    const handleTabChange = (index: number) => {
        settingsStore.setSetting("model", index)
        props.handleTabChange?.(index)
    }

    return (
        <div className="flex justify-between">
            <h1 className="text-3xl font-bold mb-5">{props.title}</h1>
            <Tab tabs={tabs} onChange={handleTabChange} index={settingsStore.getSetting("model")} />
        </div>
    )
})

export default SwitchTitle 