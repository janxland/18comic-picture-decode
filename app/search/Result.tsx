import Button from "@/components/common/Button";
import ErrorView from "@/components/ErrorView";
import ItemGrid from "@/components/ItemGrid";
import SkeletonBlock from "@/components/SkeletonBlock";
import { Extension } from "@/extension/extension";
import { useInfiniteQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useTranslation } from "../i18n";


export default function Result({ extension, kw }: { extension: Extension, kw?: string }) {
    const { t } = useTranslation(["search", "common"])
    const {
        data,
        isLoading,
        isError,
        error,
        hasNextPage,
        fetchNextPage,
        isFetchingNextPage,
    } = useInfiniteQuery({
        queryKey: ["getSearchItems", extension.package, kw],
        queryFn: ({ pageParam = 1 }) => {
            if (!kw) {
                return extension?.latest(pageParam)
            }
            return extension?.search(kw, pageParam)
        },
        getNextPageParam: (lastPage, pages) => {
            if (!lastPage) {
                return undefined
            }
            if (lastPage.length === 0) {
                return undefined
            }
            return pages.length + 1
        }
    })

    if (isLoading) {
        return (
            <ItemGrid.Grid>
                {
                    new Array(20).fill(0).map((_, i) => (
                        <SkeletonBlock key={i} className="h-60vw md:h-30vw lg:h-20vw max-h-96 !rounded-lg" />
                    ))
                }
            </ItemGrid.Grid>
        )
    }

    if (isError) {
        return (
            <ErrorView error={error}></ErrorView>
        )
    }


    if (!data?.pages || data.pages.length === 0) {
        return (
            <div className="text-center mt-28">
                <p className="text-2xl font-bold">{t('no-content')}</p>
            </div>
        )
    }

    return (
        <div>
            <ItemGrid.Grid>
                {data.pages && data.pages.map((value, index) =>
                    value.map((value, index) =>
                        <Link
                            key={index}
                            href={{
                                pathname: "/watch",
                                query: {
                                    pkg: extension.package,
                                    url: value.url,
                                    cover: value.cover
                                }
                            }}
                            className="w-full h-full"
                        >
                            <ItemGrid.Fragment itemData={value}></ItemGrid.Fragment>
                        </Link>
                    )
                )}
            </ItemGrid.Grid>
            <div className="text-center">
                {hasNextPage && (
                    <Button className="m-4" onClick={() => fetchNextPage()}>
                        {isFetchingNextPage ? t('loading') : t('more')}
                    </Button>
                )}
            </div>
        </div>

    )
}