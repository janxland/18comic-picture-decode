import { useRootStore } from "@/context/root-context"
import { useWatchContext } from "@/context/watch-context"
import { Credits as TypeCredits } from "@/types/tmdb"
import { useEffect, useState } from "react"
import { useTranslation } from "../i18n"
import Title from "./Title"

// 主演
export default function Credits() {
    const { tmdbStore } = useRootStore()
    const { tmdbId, mediaType: media_type, extension } = useWatchContext()
    const [cast, setCast] = useState<TypeCredits.Cast[]>([])
    const { t } = useTranslation("watch")
    useEffect(() => {
        if (!tmdbId) {
            return
        }
        tmdbStore.getCredits(tmdbId, media_type!).then((res) => {
            if (res) {
                setCast(res.cast)
            }
        })
    }, [tmdbId])

    if (!cast.length) {
        return <></>
    }

    return (
        <div className="mb-3" >
            <Title>
                {t('starring')}
            </Title>
            <div className="overflow-auto flex pb-3 scrollbar-none " >
                {
                    cast.map((item, index) => (
                        <div key={index} className="mr-3" style={{ minWidth: "130px", maxWidth: "130px" }} >
                            <img className="w-full rounded-lg" src={tmdbStore.getImageUrl(item.profile_path)} />
                            <a href={`https://www.themoviedb.org/person/${item.id}`} target="_blank" rel="noreferrer">
                                <div className="p-3 break-keep text-sm ">
                                    <div className="font-bold">
                                        {item.name}
                                    </div>
                                    <div>
                                        {item.character}
                                    </div>
                                </div>
                            </a>
                        </div>
                    ))
                }
            </div>
        </div>
    )
}


