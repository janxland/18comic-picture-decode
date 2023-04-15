import BaseMargin from "@/components/BaseMargin";
import SkeletonBlock from "@/components/SkeletonBlock";

export default function Loading() {
    return (
        <BaseMargin>
            <div className="flex justify-between mb-6">
                <SkeletonBlock className="h-10 w-20" />
            </div>
            <div className="mb-6">
                <SkeletonBlock className="h-10 mr-3 w-20 inline-block" />
                <SkeletonBlock className="h-10 mr-3 w-20 inline-block" />
            </div>
            <div>
                {
                    new Array(5).fill(0).map((_, i) => (
                        <SkeletonBlock key={i} className="h-10 w-full md:w-96 mb-3" />
                    ))
                }
            </div>
        </BaseMargin>
    )
}