import BaseMargin from "@/components/BaseMargin";
import ItemGrid from "@/components/ItemGrid";
import SkeletonBlock from "@/components/SkeletonBlock";

export default function Loading() {
    return (
        <BaseMargin>
            <div className="mb-6 flex justify-between">
                <SkeletonBlock className="h-10 w-20" />
                <SkeletonBlock className="h-10 w-32  " />
            </div>
            <SkeletonBlock className="mb-6 h-20" />
            <div>
                <SkeletonBlock className="mr-3 mb-6 inline-block h-10 w-20" />
                <SkeletonBlock className="mr-3 mb-6 inline-block h-10 w-20" />
            </div>
            <div>
                <ItemGrid.Grid>
                    {new Array(20).fill(0).map((_, i) => (
                        <SkeletonBlock
                            key={i}
                            className="h-60vw max-h-96 !rounded-lg md:h-30vw lg:h-20vw"
                        />
                    ))}
                </ItemGrid.Grid>
            </div>
        </BaseMargin>
    );
}
