"use client";

import { useMemo } from "react";
import { ComicCard } from "@/components/comic-card";
import { useDetailImages } from "@/hooks/use-detail-images";
import type { Comic } from "@/lib/types";

interface ComicWithSlug extends Comic {
    slug: string;
}

interface PopulerContentProps {
    comics: ComicWithSlug[];
}

export function PopulerContent({ comics }: PopulerContentProps) {
    const slugs = useMemo(() => comics.map((c) => c.slug), [comics]);
    const detailImages = useDetailImages(slugs);

    return (
        <div className="container mx-auto px-4 py-6">
            <h1 className="text-2xl font-bold mb-6">Komik Populer</h1>

            {comics.length === 0 ? (
                <p className="text-muted-foreground text-center py-12">
                    Tidak ada komik ditemukan.
                </p>
            ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {comics.map((comic) => (
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
            )}
        </div>
    );
}
