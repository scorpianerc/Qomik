import { getComicDetail } from "@/lib/api";
import { ComicDetailContent } from "./comic-detail-content";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

export const revalidate = 300;

export async function generateMetadata({
    params,
}: {
    params: Promise<{ slug: string }>;
}): Promise<Metadata> {
    const { slug } = await params;
    try {
        const comic = await getComicDetail(slug);
        return {
            title: `${comic.title} - Qomik`,
            description:
                comic.synopsis?.slice(0, 160) || `Baca ${comic.title} di Qomik`,
        };
    } catch {
        return { title: "Komik - Qomik" };
    }
}

export default async function ComicDetailPage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;

    const comic = await getComicDetail(slug).catch(() => null);

    if (!comic) {
        notFound();
    }

    return <ComicDetailContent comic={comic} />;
}
