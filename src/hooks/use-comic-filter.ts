import { useState, useCallback } from "react";
import { getKomikStationList } from "@/lib/api";
import type { GenreComic, KomikStationComic } from "@/lib/types";

export function useComicFilter(
    initialComics: (GenreComic | KomikStationComic)[] = [],
    initialGenres: string[] = []
) {
    const [selectedGenres, setSelectedGenres] = useState<string[]>(initialGenres);
    const [statusFilter, setStatusFilter] = useState<string>("Semua");
    const [comics, setComics] = useState<(GenreComic | KomikStationComic)[]>(initialComics);
    const [loading, setLoading] = useState(false);
    const [hasSearched, setHasSearched] = useState(false);

    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(false);

    const fetchComics = useCallback(async (slugs: string[], pageToFetch = 1) => {
        if (slugs.length === 0) {
            setComics([]);
            setHasMore(false);
            return;
        }

        setLoading(true);
        try {
            let anyHasMore = false;
            const results = await Promise.all(
                slugs.map(async (slug) => {
                    try {
                        const url = pageToFetch > 1 ? `/api/genre/${slug}?page=${pageToFetch}` : `/api/genre/${slug}`;
                        const res = await fetch(url);
                        if (!res.ok) return [];
                        const data = await res.json();

                        if (data.hasNextPage) anyHasMore = true;

                        return (data.komikList || data.data || []) as GenreComic[];
                    } catch (e) {
                        console.error("Failed to fetch genre", slug, e);
                        return [];
                    }
                })
            );

            const seen = new Set<string>();
            const merged: GenreComic[] = [];
            for (const list of results) {
                for (const comic of list) {
                    if (!seen.has(comic.slug)) {
                        seen.add(comic.slug);
                        merged.push(comic);
                    }
                }
            }

            if (pageToFetch === 1) {
                setComics(merged);
            } else {
                setComics(merged);
            }

            setPage(pageToFetch);
            setHasMore(anyHasMore);

        } catch {
            setComics([]);
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchByStatus = useCallback(async (status: string, pageToFetch = 1) => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (pageToFetch > 1) params.append("page", pageToFetch.toString());
            if (status && status !== "Semua") params.append("status", status);
            const queryString = params.toString() ? `?${params.toString()}` : "";

            const response = await fetch(`/api/list${queryString}`);
            if (!response.ok) throw new Error("Failed to fetch");
            const res = await response.json();
            if (res.success && Array.isArray(res.results)) {
                setComics(res.results);
                setPage(pageToFetch);
                setHasMore(res.pagination.hasNextPage);
            } else {
                setComics([]);
                setHasMore(false);
            }
        } catch (error) {
            console.error("Failed to fetch by status", error);
            setComics([]);
        } finally {
            setLoading(false);
        }
    }, []);

    const goToPage = useCallback((pageNumber: number) => {
        if (loading || pageNumber < 1) return;

        if (selectedGenres.length > 0) {
            fetchComics(selectedGenres, pageNumber);
        } else if (statusFilter !== "Semua") {
            fetchByStatus(statusFilter, pageNumber);
        }
    }, [loading, selectedGenres, statusFilter, fetchComics, fetchByStatus]);

    const toggleGenre = useCallback((slug: string) => {
        setSelectedGenres((prev) =>
            prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug]
        );
    }, []);

    const resetFilters = useCallback(() => {
        setSelectedGenres([]);
        setStatusFilter("Semua");
        setComics([]);
        setHasSearched(false);
        setPage(1);
        setHasMore(false);
    }, []);

    const filteredComics = comics.filter((comic) => {
        // Safe check for 'status' property
        if (statusFilter !== "Semua") {
            const c = comic as any;
            if (c.status && typeof c.status === 'string') {
                const s = c.status.toLowerCase();
                if (statusFilter === "Ongoing" && s !== "ongoing") return false;
                if (
                    statusFilter === "Complete" &&
                    !["complete", "completed", "end", "tamat"].includes(s)
                )
                    return false;
            } else {
                // For status, sometimes it's missing in Recent list, but we are in Genre list which usually has it.
                // If missing, excluding is safer for "Complete" filter, but for "Ongoing" it might hide valid ones?
                // Let's stick to strict.
                return true;
            }
        }
        return true;
    });

    return {
        selectedGenres,
        setSelectedGenres,
        statusFilter,
        setStatusFilter,
        comics,
        filteredComics,
        loading,
        hasSearched,
        setHasSearched,
        fetchComics,
        fetchByStatus,
        toggleGenre,
        resetFilters,
        goToPage,
        page,
        hasMore,
    };
}
