// === API Response Types ===

export interface Comic {
    title: string;
    link: string;
    image: string;
    chapter: string;
    time_ago?: string;
    views?: number | null;
    trending_score?: number;
    timeframe?: string;
}

export interface LatestResponse {
    creator: string;
    comics: Comic[];
    pagination: {
        current_page: number;
        per_page: number;
        total_on_page: number;
        has_more: boolean;
    };
}

export interface PopularResponse {
    creator: string;
    comics: Comic[];
    pagination: {
        current_page: number;
        per_page: number;
        total: number;
        has_more: boolean;
    };
}

export interface TrendingResponse {
    creator: string;
    trending: Comic[];
}

export interface SearchResult {
    title: string;
    altTitle: string | null;
    slug: string;
    href: string;
    thumbnail: string;
    type: string;
    genre: string;
    description: string;
}

export interface SearchResponse {
    status: boolean;
    creator: string;
    message: string;
    q: string;
    total: number;
    data: SearchResult[];
}

export interface KomikStationComic {
    title: string;
    slug: string;
    imageSrc: string;
    latestChapter: string;
    rating: string;
}

export interface KomikListResponse {
    creator: string;
    success: boolean;
    pagination: {
        currentPage: number;
        hasNextPage: boolean;
        nextPage: number | null;
    };
    results: KomikStationComic[];
}

export interface Chapter {
    chapter: string;
    slug: string;
    link: string;
    date: string;
}

export interface Genre {
    name: string;
    slug: string;
    link: string;
}

export interface ComicMetadata {
    type: string;
    author: string;
    status: string;
    concept: string;
    age_rating?: string;
    reading_direction?: string;
}

export interface ComicDetail {
    creator: string;
    slug: string;
    title: string;
    title_indonesian: string;
    image: string;
    synopsis: string;
    synopsis_full: string;
    summary: string;
    background_story: string;
    metadata: ComicMetadata;
    genres: Genre[];
    chapters: Chapter[];
}

export interface ChapterImage {
    src: string;
    alt?: string;
}

export interface ChapterResponse {
    creator: string;
    images: ChapterImage[];
}

// === Genre Types ===

export interface GenreItem {
    title: string;
    slug: string;
}

export interface GenreComic {
    title: string;
    slug: string;
    cover?: string;
    rating?: string;
    type?: string;
    status?: string;
}

export interface GenreListResponse {
    creator: string;
    success: boolean;
    genres: GenreItem[];
}

export interface GenreDetailResponse {
    creator: string;
    success: boolean;
    hasNextPage?: boolean;
    currentPage?: number;
    komikList: GenreComic[];
}

// === localStorage Types ===

export interface FavoriteComic {
    slug: string;
    title: string;
    image: string;
    chapter: string;
    addedAt: number;
}

export interface ReadingProgress {
    comicSlug: string;
    comicTitle: string;
    chapterSlug: string;
    chapterName: string;
    lastReadAt: number;
}
