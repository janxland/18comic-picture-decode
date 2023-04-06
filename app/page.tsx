import BaseMargin from "@/components/BaseMargin"
import Layout from "@/components/Layout"
import SwitchTitle from "@/components/SwitchTitle"
import ContinueViewing from "./client/ContinueViewing"
import LoveViewing from "./client/LoveViewing"

export default function Home() {
    return (
        <Layout>
            <BaseMargin>
                <SwitchTitle title="首页"></SwitchTitle>
                <h2 className="text-2xl font-bold mb-5">继续观看</h2>
                <ContinueViewing />
                <h2 className="text-2xl font-bold mb-5">收藏</h2>
                <LoveViewing />
            </BaseMargin>
        </Layout>
    )
}


