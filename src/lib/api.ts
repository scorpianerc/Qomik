import type {
    LatestResponse,
    PopularResponse,
    TrendingResponse,
    SearchResponse,
    ComicDetail,
    ChapterImage,
    GenreListResponse,
    GenreDetailResponse,
    KomikListResponse,
} from "./types";

const BASE_URL = process.env.API_BASE_URL!;

async function fetchAPI<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const url = `${BASE_URL}${endpoint}`;
    const res = await fetch(url, {
        next: { revalidate: 300 }, // default cache 5 minutes
        ...options,
    });
    if (!res.ok) {
        throw new Error(`API error: ${res.status} ${res.statusText}`);
    }
    return res.json();
}

export async function getLatestComics(page = 1): Promise<LatestResponse> {
    const params = page > 1 ? `?page=${page}` : "";
    return fetchAPI<LatestResponse>(`/terbaru${params}`);
}

export async function getPopularComics(): Promise<PopularResponse> {
    return fetchAPI<PopularResponse>("/populer");
}

export async function getTrendingComics(): Promise<TrendingResponse> {
    return fetchAPI<TrendingResponse>("/trending");
}

export async function searchComics(query: string): Promise<SearchResponse> {
    const trimmedQuery = query.trim();
    if (!trimmedQuery) {
        return {
            status: true,
            creator: "Qomik",
            message: "Empty query",
            q: "",
            total: 0,
            data: [],
        };
    }
    return fetchAPI<SearchResponse>(`/search?q=${encodeURIComponent(trimmedQuery)}`, {
        next: { revalidate: 60 },
    });
}

export async function getComicDetail(slug: string): Promise<ComicDetail> {
    return fetchAPI<ComicDetail>(`/comic/${slug}`);
}

export async function getChapterImages(slug: string): Promise<ChapterImage[]> {
    const res = await fetch(`${BASE_URL}/chapter/${slug}`, {
        next: { revalidate: 3600 },
    });
    if (!res.ok) {
        throw new Error(`API error: ${res.status} ${res.statusText}`);
    }
    const data = await res.json();
    // The API might return { images: [...] } or just an array
    if (Array.isArray(data)) return data;
    if (data.images) return data.images;
    if (data.data) return data.data;
    return [];
}

export async function getGenres(): Promise<GenreListResponse> {
    const data = await fetchAPI<GenreListResponse>("/bacakomik/genres");

    // Filter out compound genres and keep clean single ones
    const cleanGenres = (data.genres || []).filter(
        (g) =>
            !g.title.includes(" ") ||
            [
                "Action Adventure",
                "Drama Romance",
                "Fantasy. Shounen",
                "Gender Bender",
                "Girls' Love",
                "Magical Girls",
                "Martial Arts",
                "Monster Girls",
                "School Life",
                "Slice of Life",
                "Shoujo Ai",
                "Shounen Ai",
            ].includes(g.title)
    );

    return { ...data, genres: cleanGenres };
}

export async function getComicsByGenre(genreSlug: string, page = 1): Promise<GenreDetailResponse> {
    const url = page > 1 ? `/bacakomik/genre/${genreSlug}/${page}` : `/bacakomik/genre/${genreSlug}`;
    return fetchAPI<GenreDetailResponse>(url);
}

export async function getKomikStationList(page = 1, status = ""): Promise<KomikListResponse> {
    const params = new URLSearchParams();
    if (page > 1) params.append("page", page.toString());

    if (status && status !== "Semua") {
        let apiStatus = status.toLowerCase();
        if (apiStatus === "complete") apiStatus = "completed";
        params.append("status", apiStatus);
    }

    const queryString = params.toString() ? `?${params.toString()}` : "";
    return fetchAPI<KomikListResponse>(`/komikstation/list${queryString}`);
}

// Helper to extract slug from link like "/manga/naruto/" or full URL
export function extractSlug(link: string): string {
    if (!link) return "";
    const cleaned = link.replace(/^https?:\/\/[^/]+/, "");
    const parts = cleaned.split("/").filter(Boolean);
    // Usually the slug is the last non-empty segment
    if (parts.length > 0) {
        // Skip "manga" prefix if present
        if (parts[0] === "manga" && parts.length > 1) {
            return parts[1];
        }
        return parts[parts.length - 1];
    }
    return link;
}
