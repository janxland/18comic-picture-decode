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
    // 选集
    episodes?: Episode[];
}

// 章节
export interface Episode {
    title: string;
    urls: {
        name: string;
        url: string;
    }[]
}

// 影视 watch Props
export interface BangumiWatch {
    type: "hls" | "mp4";
    url: string;
}

// 漫画 watch Props
export interface MangaWatch {
    urls: string[];
}

// 小说 watch Props
export interface FikushonWatch {
    // 段落
    content: string[]
    title: string
    // 副标题
    subtitle: string
}
