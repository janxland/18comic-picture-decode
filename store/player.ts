import { Extension } from "@/db";
import { isClient } from "@/utils/is-client";
import { autorun, makeAutoObservable } from "mobx";
import { enqueueSnackbar } from "notistack";

export interface PlayerListType {
    url: string;
    chapter: string;
    pageUrl: string;
    title: string;
    pkg: string;
    type: Extension["type"];
}

export default class PlayerStore {
    playlist: PlayerListType[] = [];
    // 全屏
    fullScreen: boolean = false;
    // 显示播放列表
    showPlayList: boolean = true;
    // 迷你模式
    mini: boolean = true;
    index: number = 0;
    // 是否是悬浮播放列表
    floatPlayList: boolean = false;

    constructor() {
        makeAutoObservable(this);
        this.init();
        autorun(() => {
            if (!isClient() || !this.playlist.length) {
                return;
            }
            localStorage.setItem("playlist", JSON.stringify({ playlist: this.playlist, index: this.index }));
        });
    }

    // 从 localStorage 读取上次记录
    init() {
        if (!isClient()) {
            return;
        }
        const data = localStorage.getItem("playlist");
        if (data) {
            const { playlist, index } = JSON.parse(data);
            this.playlist = playlist;
            this.index = index;
        }
    }

    // 当前播放
    get currentPlay() {
        const index = this.index >= this.playlist.length ? 0 : this.index;
        return this.playlist[index];
    }

    // 添加播放并切换到当前播放
    addPlay(play: PlayerListType) {
        this.playlist.unshift(play);
        this.index = 0;
    }

    // 切换播放
    togglePlay(index: number) {
        this.index = index;
    }

    // 添加下个播放
    pushPlay(play: PlayerListType) {
        // 如果有一样的就先删除再添加
        const index = this.playlist.findIndex((v) => v.url === play.url);
        if (index !== -1) {
            this.playlist.splice(index, 1);
        }

        this.playlist.push(play);
    }

    addNextPlay(play: PlayerListType) {
        const index = this.playlist.findIndex((v) => v.url === play.url);
        if (index !== -1) {
            this.playlist.splice(index, 1);
        }
        this.playlist.splice(this.index + 1, 0, play);
    }

    // 切换下一个播放
    toggleNextPlay() {
        if (this.index + 1 >= this.playlist.length) {
            // 提示
            enqueueSnackbar("已经是最后一集了", { variant: "info" });
            return;
        }
        this.index++;
    }

    // 切换上一个播放
    togglePrevPlay() {
        if (this.index - 1 < 0) {
            // 提示
            enqueueSnackbar("已经是第一集了", { variant: "info" });
            return;
        }
        this.index--;
    }

    // 清空播放列队
    clearPlayList() {
        this.playlist = [];
        // 清除 localStorage
        localStorage.removeItem("playlist");
    }

    // 切换 showPlayList
    toggleShowPlayList(v?: boolean) {
        if (v !== undefined) {
            this.showPlayList = v;
            return;
        }
        this.showPlayList = !this.showPlayList;
    }

    // 切换悬浮播放列表
    toggleFloatPlayList(v?: boolean) {
        if (v !== undefined) {
            this.floatPlayList = v;
            return;
        }
        this.floatPlayList = !this.floatPlayList;
    }

    // 切换 FullScreen
    toggleFullScreen(v?: boolean) {
        if (v !== undefined) {
            this.fullScreen = v;
            return;
        }
        this.fullScreen = !this.fullScreen;
    }

    // 切换 mini
    toggleMini(v?: boolean) {
        if (v !== undefined) {
            this.mini = v;
            return;
        }
        this.mini = !this.mini;
    }
}
