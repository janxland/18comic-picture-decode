import { Extension } from "@/extension/extension";
import { useQuery } from "@tanstack/react-query";
import ErrorView from "@/components/ErrorView";
import SkeletonBlock from "@/components/SkeletonBlock";
import { useTranslation } from "@/app/i18n";
import { ArrowRight } from "lucide-react";
import ItemGrid from "@/components/ItemGrid";
import LazyElement from "@/components/common/LazyElement";
import Link from "next/link";
import IconButton from "@/components/common/IconButton";

export default function SearchAll({ extensions, kw, toTab }: {
    extensions: Extension[];
    kw: string;
    toTab: (index: number) => void
}) {

    const handleToTab = (index: number) => {
        setTimeout(() => {
            scroll({
                top: 0,
                behavior: "smooth"
            });
        }, 0);
        toTab(index);
    };

    return (
        <div>
            {
                extensions.map((value, index) => (
                    <div className="mb-3" key={index}>
                        <div className="flex justify-between items-center mb-6 text-lg">
                            <div>{value.name}</div>
                            <IconButton onClick={() => handleToTab(index + 1)}><ArrowRight /></IconButton>
                        </div>
                        <LazyElement placeholder={<div className="h-64"></div>}>
                            <div className="flex flex-row overflow-auto scrollbar-none mb-6">
                                <Search extension={value} kw={kw} />
                            </div>
                        </LazyElement>
                    </div>
                ))
            }
        </div>
    );

}


function Search({ extension, kw }: { extension: Extension, kw: string }) {
    const { t } = useTranslation("search");
    const { data, isLoading, error } = useQuery({
            queryKey: ["SearchAll", extension, kw],
            queryFn: () => {
                if (!kw) {
                    return extension.latest(1);
                }
                return extension.search(kw, 1);
            }
        }
    );

    if (error) {
        return <ErrorView error={error} />;
    }

    if (isLoading) {
        return (
            <>
                <SkeletonBlock className="flex-shrink-0 h-60vw max-h-96 md:h-30vw lg:h-20vw" />
            </>
        );
    }

    if (!data) {
        return (
            <div className="mt-28 text-center">
                <p className="text-2xl font-bold">{t("no-content")}</p>
            </div>
        );
    }

    return (
        <>
            {data.map((value, index) => {
                return (
                    <Link key={index} href={{
                        pathname: "/detail",
                        query: {
                            pkg: extension.package,
                            url: value.url,
                            cover: value.cover
                        }
                    }} className="flex-shrink-0 mr-3 w-1/2 md:w-1/4 lg:w-1/5">
                        <LazyElement
                            placeholder={<div className="w-48"></div>}>
                            <ItemGrid.Fragment itemData={value} />
                        </LazyElement>

                    </Link>
                );
            })}

        </>
    )
        ;
}