"use client";

import { useMemo } from "react";
import Link from "next/link";
import { ArrowRight, Flame, BookOpen, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ComicCard } from "@/components/comic-card";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { useDetailImages } from "@/hooks/use-detail-images";
import type { Comic } from "@/lib/types";

interface ComicWithSlug extends Comic {
    slug: string;
}

interface HomeContentProps {
    latest: ComicWithSlug[];
    popular: ComicWithSlug[];
    trending: ComicWithSlug[];
}

export function HomeContent({ latest, popular, trending }: HomeContentProps) {
    // Collect all slugs and fetch detail images
    const allSlugs = useMemo(() => {
        const slugs = new Set<string>();
        [...trending.slice(0, 12), ...latest.slice(0, 10), ...popular.slice(0, 10)].forEach(
            (c) => slugs.add(c.slug)
        );
        return Array.from(slugs);
    }, [trending, latest, popular]);

    const detailImages = useDetailImages(allSlugs);

    return (
        <div className="container mx-auto px-4 py-6 space-y-10">
            {/* Hero */}
            <section className="text-center py-8">
                <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
                    Baca Komik Online Gratis
                </h1>
                <p className="mt-2 text-muted-foreground max-w-lg mx-auto">
                    Manga, Manhwa, dan Manhua dalam Bahasa Indonesia. Update setiap hari.
                </p>
            </section>

            {/* Trending */}
            {trending.length > 0 && (
                <section>
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-semibold flex items-center gap-2">
                            <Flame className="h-5 w-5 text-orange-500" />
                            Trending
                        </h2>
                    </div>
                    <ScrollArea className="w-full whitespace-nowrap">
                        <div className="flex gap-3 pb-4">
                            {trending.slice(0, 12).map((comic) => (
                                <div key={comic.slug} className="w-[150px] flex-shrink-0">
                                    <ComicCard
                                        title={comic.title}
                                        image={comic.image}
                                        link={comic.link}
                                        chapter={comic.chapter}
                                        detailImage={detailImages[comic.slug]}
                                    />
                                </div>
                            ))}
                        </div>
                        <ScrollBar orientation="horizontal" />
                    </ScrollArea>
                </section>
            )}

            {/* Terbaru */}
            {latest.length > 0 && (
                <section>
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-semibold flex items-center gap-2">
                            <BookOpen className="h-5 w-5 text-blue-500" />
                            Terbaru
                        </h2>
                        <Link href="/terbaru">
                            <Button variant="ghost" size="sm">
                                Lihat Semua <ArrowRight className="ml-1 h-4 w-4" />
                            </Button>
                        </Link>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                        {latest.slice(0, 10).map((comic) => (
                            <ComicCard
                                key={comic.slug}
                                title={comic.title}
                                image={comic.image}
                                link={comic.link}
                                chapter={comic.chapter}
                                detailImage={detailImages[comic.slug]}
                            />
                        ))}
                    </div>
                </section>
            )}

            {/* Populer */}
            {popular.length > 0 && (
                <section>
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-semibold flex items-center gap-2">
                            <Star className="h-5 w-5 text-yellow-500" />
                            Populer
                        </h2>
                        <Link href="/populer">
                            <Button variant="ghost" size="sm">
                                Lihat Semua <ArrowRight className="ml-1 h-4 w-4" />
                            </Button>
                        </Link>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                        {popular.slice(0, 10).map((comic) => (
                            <ComicCard
                                key={comic.slug}
                                title={comic.title}
                                image={comic.image}
                                link={comic.link}
                                chapter={comic.chapter}
                                detailImage={detailImages[comic.slug]}
                            />
                        ))}
                    </div>
                </section>
            )}
        </div>
    );
}
