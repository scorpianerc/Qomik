import { getLatestComics, getGenres, extractSlug } from "@/lib/api";
import { TerbaruContent } from "./terbaru-content";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Komik Terbaru - Qomik",
    description: "Daftar komik terbaru update hari ini",
};

export const revalidate = 300;

export default async function TerbaruPage({
    searchParams,
}: {
    searchParams: Promise<{ page?: string }>;
}) {
    const params = await searchParams;
    const page = parseInt(params.page || "1", 10);
    const [latestData, genreData] = await Promise.all([
        getLatestComics(page).catch(() => null),
        getGenres().catch(() => ({ genres: [] })),
    ]);

    const comics = (Array.isArray(latestData?.comics) ? latestData.comics : []).map((c) => ({
        ...c,
        slug: extractSlug(c.link),
    }));

    return (
        <TerbaruContent
            comics={comics}
            genres={genreData?.genres || []}
            currentPage={page}
            hasMore={latestData?.pagination?.has_more || false}
            key={page}
        />
    );
}
