import BaseMargin from "@/components/BaseMargin";
import SkeletonBlock from "@/components/SkeletonBlock";

export default function Loading() {
    return (
        <BaseMargin>
            <div className="mb-6 flex justify-between">
                <SkeletonBlock className="h-10 w-20" />
            </div>
            <div className="mb-6">
                <SkeletonBlock className="mr-3 inline-block h-10 w-20" />
                <SkeletonBlock className="mr-3 inline-block h-10 w-20" />
            </div>
            <div>
                {new Array(5).fill(0).map((_, i) => (
                    <SkeletonBlock
                        key={i}
                        className="mb-3 h-10 w-full md:w-96"
                    />
                ))}
            </div>
        </BaseMargin>
    );
}
