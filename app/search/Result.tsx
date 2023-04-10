import ErrorView from "@/components/ErrorView";
import ItemGrid from "@/components/ItemGrid";
import LoadingBox from "@/components/LoadingBox";
import Button from "@/components/common/Button";
import { Extension } from "@/extension/extension";
import { useInfiniteQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useTranslation } from "../i18n/client";

export default function Result({ extension, kw }: { extension: Extension, kw?: string }) {
    const { t } = useTranslation("search")
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
        retry: false,
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

    if (isError) {
        return (
            <ErrorView error={error}></ErrorView>
        )
    }

    if (isLoading) {
        return (
            <LoadingBox />
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
                                    url: value.url
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