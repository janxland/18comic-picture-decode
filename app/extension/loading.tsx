import BaseMargin from "@/components/BaseMargin";
import SkeletonBlock from "@/components/SkeletonBlock";

export default function Loading() {
    return (
        <BaseMargin>
            <div className="mb-6 flex justify-between">
                <SkeletonBlock className="h-10 w-20" />
                <SkeletonBlock className="h-10 w-32  " />
            </div>
            <div className="mb-6">
                <SkeletonBlock className="mr-3 inline-block h-10 w-20" />
                <SkeletonBlock className="mr-3 inline-block h-10 w-20" />
            </div>
            <div>
                {new Array(20).fill(0).map((_, i) => (
                    <SkeletonBlock key={i} className="mb-3 h-20" />
                ))}
            </div>
        </BaseMargin>
    );
}
