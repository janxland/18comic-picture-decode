import { ComponentOption } from "artplayer/types/component";

export interface ListItem {
    title: string;
    url: string;
    cover: string;
    desc?: string;
    update?: string;
}

// 详情
export interface Detail {
    title: string;
    cover: string;
    desc?: string;
    metadata?: {
        [key: string]: string;
    };
    // 选集
    episodes?: Episode[];
}

// 章节
export interface Episode {
    title: string;
    urls: {
        name: string;
        url: string;
    }[];
}

// 影视 watch Props
export interface BangumiWatch {
    type: "hls" | "mp4" | "flv" | "dash" | "custom";
    url: string;
    // 定义字幕,
    subtitles?: {
        html: string;
        src: string;
    }[];
    // 控制器
    controls?: ComponentOption[];
    // 是否禁用默认播放器
    noDefaultPlayer: boolean;
}

// 漫画 watch Props
export interface MangaWatch {
    decodeImage(url: string): string | undefined;
    urls: string[];
}

// 小说 watch Props
export interface FikushonWatch {
    // 段落
    content: string[];
    title: string;
    // 副标题
    subtitle: string;
}
