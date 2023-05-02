import { useRootStore } from "@/context/root-context";
import { BangumiWatch } from "@/types/extension";
import { useQuery } from "@tanstack/react-query";
import Artplayer from "artplayer";
import clsx from "clsx";
import Hls from "hls.js";
import { Pause, Play, SkipBack, SkipForwardIcon } from "lucide-react";
import { observer } from "mobx-react-lite";
import { useEffect, useRef, useState } from "react";
import ErrorView from "../ErrorView";
import LoadingBox from "../LoadingBox";
import artplayerPluginDashQuality from "artplayer-plugin-dash-quality";
import artplayerPluginHlsQuality from "artplayer-plugin-hls-quality";

const BangumiPlayer = observer(() => {
    const { extensionStore, historyStore, playerStore } = useRootStore();
    const currentPlay = playerStore.currentPlay;
    const extension = extensionStore.getExtension(currentPlay.pkg);
    const artRef = useRef<HTMLDivElement>(null);
    const [art, setArt] = useState<Artplayer | undefined>();
    const [playing, setPlaying] = useState(false);
    const { data, error, isLoading } = useQuery({
        queryKey: ["watch", currentPlay.url, currentPlay.pkg],
        queryFn: () => {
            return extension?.watch(currentPlay.url) as BangumiWatch;
        },
    });

    useEffect(() => {
        if (!playerStore.playlist.length) {
            art?.destroy(false);
        }
    }, [playerStore.playlist]);

    useEffect(() => {
        if (!artRef || !data) {
            return;
        }
        // 切换非悬浮播放列表
        playerStore.toggleFloatPlayList(false);

        // 如果不是全屏则打开列表
        if (!playerStore.fullScreen) {
            playerStore.toggleShowPlayList(true);
        }

        // 如果不需要默认播放器
        if (data.noDefaultPlayer) {
            extension?.customPlayer(artRef.current as any, data.url, {} as any);
            return;
        }

        // 如果 artplayer 已经初始化过了
        if (!art?.isDestroy) {
            art?.destroy(false);
        }

        // 如果 artRef.current 不存在
        if (!artRef.current) {
            return;
        }

        // 画质插件
        let qualityPlugin: any;
        if (data.type === "hls") {
            qualityPlugin = artplayerPluginHlsQuality({
                // Show quality in control
                control: true,

                // Show quality in setting
                setting: true,

                // Get the resolution text from level
                getResolution: (level) => level.height + "P",

                // I18n
                title: "Quality",
                auto: "Auto",
            });
        }
        if (data.type === "dash") {
            qualityPlugin = artplayerPluginDashQuality({
                // Show quality in control
                control: true,

                // Show quality in setting
                setting: true,

                // Get the resolution text from level
                getResolution: (level) => level.height + "P",

                // I18n
                title: "Quality",
                auto: "Auto",
            });
        }

        setArt(
            new Artplayer({
                container: artRef.current!,
                title: currentPlay.title + " - " + currentPlay.chapter,
                url: data.url,
                type: data.type,
                pip: true,
                screenshot: true,
                setting: true,
                flip: true,
                lock: true,
                playbackRate: true,
                aspectRatio: true,
                subtitleOffset: true,
                miniProgressBar: true,
                mutex: true,
                backdrop: true,
                playsInline: true,
                lang: navigator.language.toLowerCase(),
                autoPlayback: true,
                airplay: true,
                autoplay: true,
                moreVideoAttr: {
                    crossOrigin: "anonymous",
                },
                controls: [
                    ...(data.controls || []),
                    {
                        position: "left",
                        html: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-skip-back"><polygon points="19 20 9 12 19 4 19 20"></polygon><line x1="5" x2="5" y1="19" y2="5"></line></svg>',
                        index: 1,
                        tooltip: "上一集",
                        click: function () {
                            playerStore.togglePrevPlay();
                        },
                    },
                    {
                        position: "left",
                        html: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-skip-forward"><polygon points="5 4 15 12 5 20 5 4"></polygon><line x1="19" x2="19" y1="5" y2="19"></line></svg>',
                        index: 20,
                        tooltip: "下一集",
                        click: function () {
                            playerStore.toggleNextPlay();
                        },
                    },
                    {
                        position: "right",
                        html: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-list"><line x1="8" x2="21" y1="6" y2="6"></line><line x1="8" x2="21" y1="12" y2="12"></line><line x1="8" x2="21" y1="18" y2="18"></line><line x1="3" x2="3.01" y1="6" y2="6"></line><line x1="3" x2="3.01" y1="12" y2="12"></line><line x1="3" x2="3.01" y1="18" y2="18"></line></svg>',
                        index: 1,
                        tooltip: "播放列表",
                        click: function () {
                            playerStore.toggleShowPlayList();
                        },
                    },
                    {
                        position: "right",
                        html: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-maximize"><path d="M8 3H5a2 2 0 0 0-2 2v3"></path><path d="M21 8V5a2 2 0 0 0-2-2h-3"></path><path d="M3 16v3a2 2 0 0 0 2 2h3"></path><path d="M16 21h3a2 2 0 0 0 2-2v-3"></path></svg>',
                        index: 1000,
                        tooltip: "全屏",
                        click: function () {
                            playerStore.toggleFullScreen();
                        },
                    },
                ],
                settings: [
                    {
                        width: 200,
                        html: "字幕",
                        selector: [
                            {
                                html: "Display",
                                tooltip: "Show",
                                switch: true,
                                onSwitch: function (item) {
                                    item.tooltip = item.switch
                                        ? "Hide"
                                        : "Show";
                                    if (!art) {
                                        return;
                                    }
                                    art.subtitle.show = !item.switch;
                                    return !item.switch;
                                },
                            },
                            {
                                default: false,
                                html: "选择字幕文件",
                            },
                            ...(data.subtitles || []),
                        ],
                        onSelect: function (item) {
                            if (item.html === "选择字幕文件") {
                                // 选择字幕文件
                                const input = document.createElement("input");
                                input.type = "file";
                                input.accept = "text/srt";
                                input.click();
                                input.onchange = function () {
                                    if (!input.files) {
                                        return;
                                    }
                                    const file = input.files[0];
                                    if (file) {
                                        item.url = URL.createObjectURL(file);
                                        if (!art) {
                                            return;
                                        }
                                        art.subtitle.switch(item.url, {
                                            name: file.name,
                                        });
                                    }
                                };
                                return item.html;
                            }
                            if (!art) {
                                return;
                            }
                            art.subtitle.switch(item.url, {
                                name: item.html,
                            });
                            return item.html;
                        },
                    },
                ],
                plugins: [qualityPlugin],
                subtitle: {
                    type: "srt",
                    style: {
                        color: "#000",
                        fontSize: "20px",
                        textShadow:
                            "0 1px white, 1px 0 white, -1px 0 white, 0 -1px white",
                    },
                    encoding: "utf-8",
                },
                customType: {
                    hls: playM3u8,
                    flv: playFlv,
                    dash: playMpd,
                    custom: extension?.customPlayer,
                },
            })
        );

        window.addEventListener("resize", () => {
            if (!art) {
                return;
            }
            art.autoHeight = true;
        });
    }, [data]);

    const addHistory = async () => {
        if (!art) {
            return;
        }
        // 存储历史记录
        historyStore.addHistory({
            package: currentPlay.pkg,
            url: currentPlay.pageUrl,
            title: currentPlay.title,
            chapter: currentPlay.chapter,
            type: "bangumi",
            cover: await art.getDataURL(),
        });
    };

    useEffect(() => {
        if (!art) {
            return;
        }

        // 播放的时候 添加一次记录
        art.on("video:play", () => {
            console.log("play");
            addHistory();
            setPlaying(true);
        });

        art.on("pause", () => {
            setPlaying(false);
        });

        art.on("video:ended", () => {
            // 切换下一集
            playerStore.toggleNextPlay();
        });

        // 销毁的时候 再添加一次历史记录
        art.on("destroy", () => {
            // 如果播放器已经准备好了 就添加一次历史记录
            // 防止截图为空
            if (art.isReady) {
                addHistory();
            }
        });
        return () => {
            if (art && art.destroy) {
                art.destroy(false);
            }
        };
    }, [art, playerStore.playlist, playerStore.index]);

    const togglePlay = () => {
        if (!art) {
            return;
        }
        if (art.playing) {
            art.pause();
        } else {
            art.play();
        }
    };

    if (error) {
        return <ErrorView error={error}></ErrorView>;
    }

    if (isLoading) {
        return <LoadingBox className="!min-h-[250px] w-[250px]" />;
    }

    if (!data) {
        return <ErrorView error={"地址获取失败"} />;
    }

    return (
        <div
            className={clsx({
                "h-52 w-full flex-shrink lg:h-screen": !playerStore.mini,
                "relative h-16 w-full lg:h-40 lg:w-96": playerStore.mini,
                "!h-screen": playerStore.fullScreen,
            })}
        >
            <div className="h-full w-full" ref={artRef}></div>
            {playerStore.mini && art && (
                // 缩小后的播放控件
                <div
                    className="absolute top-0 left-0 h-full w-full "
                    style={{ zIndex: 99999 }}
                >
                    <div className="flex h-full w-full items-center justify-center text-white opacity-0 transition-all hover:bg-black hover:bg-opacity-70 hover:opacity-100">
                        <button
                            className="mx-3"
                            onClick={() => playerStore.togglePrevPlay()}
                        >
                            <SkipBack />
                        </button>
                        <button onClick={() => togglePlay()} className="mx-3">
                            {playing ? <Pause /> : <Play />}
                        </button>
                        <button
                            onClick={() => playerStore.toggleNextPlay()}
                            className="mx-3"
                        >
                            <SkipForwardIcon />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
});

export default BangumiPlayer;

function playM3u8(video: HTMLMediaElement, url: string, art: Artplayer) {
    if (Hls.isSupported()) {
        // @ts-ignore
        if (art.hls) art.hls.destroy();
        const hls = new Hls();
        hls.loadSource(url);
        hls.attachMedia(video);
        // @ts-ignore
        art.hls = hls;
        art.on("destroy", () => hls.destroy());
    } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = url;
    } else {
        art.notice.show = "Unsupported playback format: m3u8";
    }
}

function playFlv(video: HTMLMediaElement, url: string, art: Artplayer) {
    import("flv.js")
        .then((module) => {
            const flvjs = module.default;
            if (flvjs.isSupported()) {
                // @ts-ignore
                if (art.flv) art.flv.destroy();
                const flv = flvjs.createPlayer({ type: "flv", url });
                flv.attachMediaElement(video);
                flv.load();
                // @ts-ignore
                art.flv = flv;
                art.on("destroy", () => flv.destroy());
            } else {
                art.notice.show = "Unsupported playback format: flv";
            }
        })
        .catch((e) => {
            art.notice.show = e;
        });
}

function playMpd(video: HTMLMediaElement, url: string, art: Artplayer) {
    import("dashjs")
        .then((module) => {
            const dashjs = module.default;
            if (dashjs.supportsMediaSource()) {
                // @ts-ignore
                if (art.dash) art.dash.destroy();
                const dash = dashjs.MediaPlayer().create();
                dash.initialize(video, url, art.option.autoplay);
                // @ts-ignore
                art.dash = dash;
                art.on("destroy", () => dash.destroy());
            } else {
                art.notice.show = "Unsupported playback format: mpd";
            }
        })
        .catch((e) => {
            art.notice.show = e;
        });
}
