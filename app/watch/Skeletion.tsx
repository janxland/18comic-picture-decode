import BaseMargin from "@/components/BaseMargin";
import Layout from "@/components/Layout";
import SkeletonBlock from "@/components/SkeletonBlock";

export default function Skeletion({ cover }: { cover?: string }) {
    return (
        <Layout>
            <BaseMargin>
                <div className="min-h-screen">
                    <div className="md:items-end mb-5 md:mb-16 flex flex-col items-center md:flex-row">
                        <div className="mb-6 md:mb-0 md:flex flex-col items-center md:w-1/4 lg:w-1/5">
                            {
                                cover ?
                                    <img
                                        className="md:block w-56 md:w-full ring-4 ring-gray-300 rounded-xl shadow-2xl mb-3 "
                                        src={cover} alt="cover" />
                                    :
                                    <SkeletonBlock className="md:block mb-3 h-80 w-60 md:w-full" />
                            }
                            <div className="mt-3 md:mt-0 flex justify-between w-full flex-col xl:flex-row">
                                <SkeletonBlock className="w-full h-11" />
                            </div>
                        </div>
                        <div className="w-full md:w-3/4 lg:w-4/5 md:ml-5 md:mt-10">
                            <div className="w-60 h-12 mb-4 rounded-xl bg-slate-200 dark:bg-zinc-700 animate-pulse"></div>
                            <div className="max-h-48 overflow-hidden">
                                <SkeletonBlock className="w-52 h-8 mb-2" />
                                <SkeletonBlock className="w-80 h-8 mb-2" />
                                <SkeletonBlock className="w-72 h-8 mb-2" />
                                <SkeletonBlock className="w-80 h-8 mb-2" />
                                <SkeletonBlock className="w-60 h-8 mb-2" />
                            </div>
                        </div>
                    </div>
                    <SkeletonBlock className="h-40 mb-6" />
                    <SkeletonBlock className="h-56 mb-6" />
                </div>
            </BaseMargin>
        </Layout>
    )
}