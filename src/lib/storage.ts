"use client";

import type { FavoriteComic, ReadingProgress } from "./types";

const FAVORITES_KEY = "qomik_favorites";
const PROGRESS_KEY = "qomik_reading_progress";

// === Favorites ===

export function getFavorites(): FavoriteComic[] {
    if (typeof window === "undefined") return [];
    try {
        const data = localStorage.getItem(FAVORITES_KEY);
        return data ? JSON.parse(data) : [];
    } catch {
        return [];
    }
}

export function addFavorite(comic: FavoriteComic): void {
    const favorites = getFavorites();
    if (!favorites.find((f) => f.slug === comic.slug)) {
        favorites.unshift({ ...comic, addedAt: Date.now() });
        localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
    }
}

export function removeFavorite(slug: string): void {
    const favorites = getFavorites().filter((f) => f.slug !== slug);
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
}

export function isFavorite(slug: string): boolean {
    return getFavorites().some((f) => f.slug === slug);
}

// === Reading Progress ===

export function getAllProgress(): Record<string, ReadingProgress> {
    if (typeof window === "undefined") return {};
    try {
        const data = localStorage.getItem(PROGRESS_KEY);
        return data ? JSON.parse(data) : {};
    } catch {
        return {};
    }
}

export function getReadingProgress(
    comicSlug: string
): ReadingProgress | null {
    const all = getAllProgress();
    return all[comicSlug] || null;
}

export function setReadingProgress(progress: ReadingProgress): void {
    const all = getAllProgress();
    all[progress.comicSlug] = { ...progress, lastReadAt: Date.now() };
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(all));
}

export function getRecentlyRead(): ReadingProgress[] {
    const all = getAllProgress();
    return Object.values(all)
        .sort((a, b) => b.lastReadAt - a.lastReadAt)
        .slice(0, 10);
}
