import { useRootStore } from "@/context/root-context";
import { MangaWatch } from "@/types/extension";
import { useQuery } from "@tanstack/react-query";
import clsx from "clsx";
import { ChevronDown, ChevronFirst, ChevronLast, List } from "lucide-react";
import { observer } from "mobx-react-lite";
import { SetStateAction, useEffect,useState } from "react";
import Button from "../common/Button";
import LazyElement from "../common/LazyElement";
import LoadingImg from "../common/LoadingImg";
import ErrorView from "../ErrorView";
import LoadingBox from "../LoadingBox";
import Control from "./control";
let decodeDone = false;
let currentURL: string ;
let currentInterval: string | number | NodeJS.Timeout | undefined ;
let decodeTopUrls: { [key: string]: string[] } = {};
const MangaPlayer = observer(() => {
    const { extensionStore, historyStore, playerStore } = useRootStore();
    const { pkg, pageUrl, title, chapter, url, type } = playerStore.currentPlay;
    const extension = extensionStore.getExtension(pkg);
    const { data, error, isLoading } = useQuery({
        queryKey: ["manga", url, pkg],
        queryFn: () => {
            currentURL = url
            clearInterval(currentInterval);
            return extension?.watch(url) as MangaWatch 
        },
    });
    let [decodeUrls, setDecodeUrls] = useState(data?.urls || []);
    
    useEffect(() => {
        if (!data || type !== "manga") {
            return;
        }
        playerStore.toggleFloatPlayList(true);
        playerStore.toggleShowPlayList(false);
        console.log("开始",decodeUrls,data);
        
        setDecodeUrls(decodeTopUrls[currentURL]?[...decodeTopUrls[currentURL]]  : [...data.urls])
        if((extension as any).decodeImage && !playerStore.mini && decodeTopUrls[currentURL] == undefined){
            currentInterval = setInterval(() => {
                console.log("每秒更新");
                setDecodeUrls([...decodeUrls])
            }, 1000); 
        }
        const updateUrl = (url: any,index: number) => {
            if(playerStore.mini || decodeTopUrls[currentURL] != undefined) return;
            extension && (extension as any).decodeImage && (extension as any).decodeImage(url,function(newUrl:string){
                if(decodeUrls){
                    if(decodeUrls[index]  == newUrl) return;
                    decodeUrls[index] = newUrl;
                    if(index == data.urls.length - 1){
                        clearInterval(currentInterval)
                        setDecodeUrls([...decodeUrls]);
                        console.log("解码完毕！",data);
                        decodeTopUrls[currentURL] = [...decodeUrls];
                        
                    } else {
                        updateUrl(data.urls[index+1],index+1)
                    }
                }
               
            });
            
        };
        updateUrl(data.urls[0],0)
        historyStore.addHistory({
            package: pkg,
            url: pageUrl,
            title,
            chapter,
            type: "manga",
            cover: data.urls[0],
        });
    }, [data]);
    if (isLoading) {
        return <LoadingBox className="!h-screen"></LoadingBox>;
    }

    if (error) {
        return <ErrorView error={error} />;
    }

    if (!data) {
        return <ErrorView error={new Error("No data")} />;
    }
    if (type !== "manga") {
        return null;
    }
    return (
        
        <>
            <div
                className={clsx(
                    "relative max-w-5xl text-center",
                    {
                        "max-h-screen overflow-auto": !playerStore.mini,
                    },
                    // mini 时不显示滚动条 且不能滚动 只做预览
                    {
                        "max-h-56 overflow-hidden scrollbar-none":
                            playerStore.mini,
                    }
                )}
            >
                <div className="mb-16 w-full md:w-auto">
                    
                    {decodeUrls.map( (url, index) => {
                        return (
                            <LazyElement
                                key={index}
                                placeholder={
                                    <div className="h-40 w-full">
                                        <LoadingBox></LoadingBox>
                                    </div>
                                }
                            >
                                <LoadingImg
                                    loadview={
                                        <div className="h-40 w-full">
                                            <LoadingBox></LoadingBox>
                                        </div>
                                    }
                                    className="m-auto"
                                    src={url}
                                    alt="Manga"
                                    referrerPolicy="no-referrer"
                                />
                            </LazyElement>
                        );
                    })}
                </div>
                {/* mini 时显示的按钮 */}
                {playerStore.mini && (
                    <div className="absolute left-0 right-0 bottom-0 top-0 opacity-0 hover:opacity-100">
                        <div className="flex h-full w-full items-center justify-center bg-black bg-opacity-60">
                            <Button
                                onClick={() => playerStore.toggleMini(false)}
                            >
                                继续观看
                            </Button>
                        </div>
                    </div>
                )}
            </div>
            <Control />
        </>
    );
});
export default MangaPlayer;
