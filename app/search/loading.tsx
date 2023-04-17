import BaseMargin from "@/components/BaseMargin";
import ItemGrid from "@/components/ItemGrid";
import SkeletonBlock from "@/components/SkeletonBlock";

export default function Loading() {
    return (
        <BaseMargin>
            <div className="flex justify-between mb-6">
                <SkeletonBlock className="h-10 w-20" />
                <SkeletonBlock className="h-10 w-32  " />
            </div>
            <SkeletonBlock className="h-20 mb-6" />
            <div>
                <SkeletonBlock className="h-10 mr-3 w-20 mb-6 inline-block" />
                <SkeletonBlock className="h-10 mr-3 w-20 mb-6 inline-block" />
            </div>
            <div>
                <ItemGrid.Grid>
                    {new Array(20).fill(0).map((_, i) => (
                        <SkeletonBlock
                            key={i}
                            className="h-60vw md:h-30vw lg:h-20vw max-h-96 !rounded-lg"
                        />
                    ))}
                </ItemGrid.Grid>
            </div>
        </BaseMargin>
    );
}
