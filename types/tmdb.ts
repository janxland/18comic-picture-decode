export type SearchResult = {
    backdrop_path: string
    id: number
    title: string
    name: string
    original_name: string
    original_language: string
    original_title: string
    overview: string
    poster_path: string
    media_type: "movie" | "tv"
    genre_ids: number[]
    popularity: number
    release_date: string
    video: boolean
    vote_average: number
    vote_count: number

}

export module Details {
    export interface CreatedBy {
        id: number;
        credit_id: string;
        name: string;
        gender: number;
        profile_path: string;
    }

    export interface Genre {
        id: number;
        name: string;
    }

    export interface LastEpisodeToAir {
        air_date: string;
        episode_number: number;
        id: number;
        name: string;
        overview: string;
        production_code: string;
        runtime: number;
        season_number: number;
        show_id: number;
        still_path?: any;
        vote_average: number;
        vote_count: number;
    }

    export interface Network {
        id: number;
        name: string;
        logo_path: string;
        origin_country: string;
    }

    export interface ProductionCompany {
        id: number;
        logo_path: string;
        name: string;
        origin_country: string;
    }

    export interface Season {
        air_date: string;
        episode_count: number;
        id: number;
        name: string;
        overview: string;
        poster_path?: any;
        season_number: number;
    }

    export interface SpokenLanguage {
        english_name: string;
        iso_639_1: string;
        name: string;
    }

    export interface RootObject {
        adult: boolean;
        backdrop_path: string;
        created_by: CreatedBy[];
        episode_run_time: number[];
        first_air_date: string;
        genres: Genre[];
        homepage: string;
        id: number;
        in_production: boolean;
        languages: string[];
        last_air_date: string;
        last_episode_to_air: LastEpisodeToAir;
        name: string;
        next_episode_to_air?: any;
        networks: Network[];
        number_of_episodes: number;
        number_of_seasons: number;
        origin_country: string[];
        original_language: string;
        original_name: string;
        original_title: string;
        release_date: string;
        overview: string;
        popularity: number;
        runtime: number;
        poster_path: string;
        production_companies: ProductionCompany[];
        production_countries: any[];
        seasons: Season[];
        spoken_languages: SpokenLanguage[];
        status: string;
        tagline: string;
        type: string;
        vote_average: number;
        vote_count: number;
    }
}


export namespace Credits {
    export interface RootObject {
        cast: Cast[]
        crew: Crew[]
        id: number
    }

    export interface Cast {
        adult: boolean
        gender: number
        id: number
        known_for_department: string
        name: string
        original_name: string
        popularity: number
        profile_path: string
        character: string
        credit_id: string
        order: number
    }

    export interface Crew {
        adult: boolean
        gender: number
        id: number
        known_for_department: string
        name: string
        original_name: string
        popularity: number
        profile_path?: string
        credit_id: string
        department: string
        job: string
    }

}