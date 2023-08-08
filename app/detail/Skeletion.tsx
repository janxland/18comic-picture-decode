import BaseMargin from "@/components/BaseMargin";
import LoadingImg from "@/components/common/LoadingImg";
import Layout from "@/components/Layout";
import SkeletonBlock from "@/components/SkeletonBlock";

export default function Skeletion({ cover }: { cover?: string }) {
    return (
        <Layout>
            <BaseMargin>
                <div className="min-h-screen">
                    <div className="mb-5 flex  md:mb-16 items-end">
                        <div className="w-56 flex-col items-center md:mb-0 md:flex md:w-1/4 lg:w-1/5 ">
                            {cover ? (
                                <LoadingImg
                                    className="mb-3 rounded-xl shadow-2xl ring-4 ring-gray-300 md:block md:w-full "
                                    src={cover}
                                    alt="cover"
                                />
                            ) : (
                                <SkeletonBlock className="mb-3 h-48 lg:h-64 xl:h-80 w-full md:block md:w-full" />
                            )}
                            <div className="mt-3 flex w-full flex-col justify-between md:mt-0 xl:flex-row">
                                <SkeletonBlock className="h-11 w-full" />
                            </div>
                        </div>
                        <div className="w-full ml-5 md:mt-10 md:w-3/4 lg:w-4/5 ">
                            <div
                                className="mb-4 h-12 md:w-60 animate-pulse rounded-xl bg-slate-200 dark:bg-zinc-700"></div>
                            <div className="max-h-48 overflow-hidden">
                                <SkeletonBlock className="mb-2 h-8 w-2/3 md:w-52" />
                                <SkeletonBlock className="hidden md:block mb-2 h-8 w-80" />
                                <SkeletonBlock className="mb-2 h-8 w-1/2 md:w-72" />
                                <SkeletonBlock className="hidden md:block mb-2 h-8 w-80" />
                                <SkeletonBlock className="mb-2 h-8 w-5/6 md:w-60" />
                            </div>
                        </div>
                    </div>
                    <SkeletonBlock className="mb-6 h-40" />
                    <SkeletonBlock className="mb-6 h-56" />
                </div>
            </BaseMargin>
        </Layout>
    );
}
