import { getGenres } from "@/lib/api";
import { GenreListContent } from "./genre-list-content";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Genre Komik - Qomik",
    description: "Jelajahi komik berdasarkan genre favorit kamu",
};

export const revalidate = 3600; // 1 hour cache

export default async function GenrePage() {
    const data = await getGenres().catch(() => null);
    const genres = data?.genres || [];

    return <GenreListContent genres={genres} />;
}
