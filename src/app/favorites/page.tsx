"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { Heart, Trash2, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
    getFavorites,
    removeFavorite,
    getRecentlyRead,
} from "@/lib/storage";
import type { FavoriteComic, ReadingProgress } from "@/lib/types";
import { useDetailImages } from "@/hooks/use-detail-images";

export default function FavoritesPage() {
    const [favorites, setFavorites] = useState<FavoriteComic[]>([]);
    const [recentlyRead, setRecentlyRead] = useState<ReadingProgress[]>([]);

    useEffect(() => {
        setFavorites(getFavorites());
        setRecentlyRead(getRecentlyRead());
    }, []);

    const slugs = useMemo(() => favorites.map((c) => c.slug), [favorites]);
    const detailImages = useDetailImages(slugs);

    function handleRemove(slug: string) {
        removeFavorite(slug);
        setFavorites(getFavorites());
    }

    return (
        <div className="container mx-auto px-4 py-6 space-y-8">
            {/* Favorites Section */}
            <section>
                <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
                    <Heart className="h-6 w-6" />
                    Favorit Saya
                </h1>

                {favorites.length === 0 ? (
                    <Card>
                        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                            <Heart className="h-12 w-12 text-muted-foreground mb-4" />
                            <p className="text-muted-foreground">
                                Belum ada komik favorit.
                            </p>
                            <Link href="/" className="mt-4">
                                <Button variant="outline">Jelajahi Komik</Button>
                            </Link>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                        {favorites.map((comic) => (
                            <Card
                                key={comic.slug}
                                className="overflow-hidden group relative"
                            >
                                <Link href={`/comic/${comic.slug}`}>
                                    <div className="relative aspect-[3/4] overflow-hidden bg-muted">
                                        <Image
                                            src={detailImages[comic.slug] || comic.image}
                                            alt={comic.title}
                                            fill
                                            className="object-cover transition-transform group-hover:scale-105"
                                            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                                            unoptimized
                                        />
                                    </div>
                                    <CardContent className="p-2.5">
                                        <h3 className="font-medium text-sm line-clamp-1 leading-tight">
                                            {comic.title}
                                        </h3>
                                        {comic.chapter && (
                                            <p className="text-xs text-muted-foreground mt-1">
                                                {comic.chapter}
                                            </p>
                                        )}
                                    </CardContent>
                                </Link>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="absolute top-1 right-1 h-8 w-8 bg-background/70 hover:bg-destructive hover:text-destructive-foreground rounded-full"
                                    onClick={() => handleRemove(comic.slug)}
                                >
                                    <Trash2 className="h-3.5 w-3.5" />
                                </Button>
                            </Card>
                        ))}
                    </div>
                )}
            </section>

            {/* Recently Read Section */}
            {recentlyRead.length > 0 && (
                <section>
                    <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                        <BookOpen className="h-5 w-5" />
                        Terakhir Dibaca
                    </h2>
                    <div className="space-y-2">
                        {recentlyRead.map((item) => (
                            <Link
                                key={item.comicSlug}
                                href={`/comic/${item.comicSlug}/${item.chapterSlug}`}
                            >
                                <Card className="hover:shadow-md transition-shadow">
                                    <CardContent className="flex items-center justify-between p-3">
                                        <div>
                                            <p className="font-medium text-sm">{item.comicTitle}</p>
                                            <p className="text-xs text-muted-foreground">
                                                {item.chapterName}
                                            </p>
                                        </div>
                                        <Button variant="ghost" size="sm">
                                            Lanjut Baca
                                        </Button>
                                    </CardContent>
                                </Card>
                            </Link>
                        ))}
                    </div>
                </section>
            )}
        </div>
    );
}
