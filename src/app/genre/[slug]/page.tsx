import { getComicsByGenre, getGenres } from "@/lib/api";
import { GenreDetailContent } from "./genre-detail-content";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

export const revalidate = 300;

export async function generateMetadata({
    params,
}: {
    params: Promise<{ slug: string }>;
}): Promise<Metadata> {
    const { slug } = await params;
    const title = slug
        .split("-")
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" ");
    return {
        title: `Komik ${title} - Qomik`,
        description: `Daftar komik genre ${title}`,
    };
}

export default async function GenreDetailPage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;

    let data;
    try {
        data = await getComicsByGenre(slug);
    } catch {
        notFound();
    }

    if (!data || !data.komikList) {
        notFound();
    }

    // Get genre list for the sidebar
    const genreData = await getGenres().catch(() => null);
    const genres = genreData?.genres || [];

    // Convert slug to title
    const genreTitle = slug
        .split("-")
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" ");

    return (
        <GenreDetailContent
            genreTitle={genreTitle}
            genreSlug={slug}
            comics={data.komikList}
            genres={genres}
        />
    );
}
