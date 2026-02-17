"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import {
    Heart,
    BookOpen,
    ChevronDown,
    ChevronUp,
    CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";
import {
    addFavorite,
    removeFavorite,
    isFavorite,
    getReadingProgress,
} from "@/lib/storage";
import type { ComicDetail, ReadingProgress } from "@/lib/types";

interface ComicDetailContentProps {
    comic: ComicDetail;
}

export function ComicDetailContent({ comic }: ComicDetailContentProps) {
    const [fav, setFav] = useState(false);
    const [showAllChapters, setShowAllChapters] = useState(false);
    const [progress, setProgress] = useState<ReadingProgress | null>(null);

    useEffect(() => {
        setFav(isFavorite(comic.slug));
        setProgress(getReadingProgress(comic.slug));
    }, [comic.slug]);

    function toggleFavorite() {
        if (fav) {
            removeFavorite(comic.slug);
            setFav(false);
        } else {
            addFavorite({
                slug: comic.slug,
                title: comic.title,
                image: comic.image,
                chapter: comic.chapters?.[0]?.chapter || "",
                addedAt: Date.now(),
            });
            setFav(true);
        }
    }

    const chaptersToShow = showAllChapters
        ? comic.chapters
        : comic.chapters?.slice(0, 20);

    const [showFullSynopsis, setShowFullSynopsis] = useState(false);

    return (
        <div className="container mx-auto px-4 py-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row gap-6">
                {/* Cover */}
                <div className="relative w-48 h-64 flex-shrink-0 rounded-lg overflow-hidden bg-muted mx-auto md:mx-0">
                    <Image
                        src={comic.image}
                        alt={comic.title}
                        fill
                        className="object-cover"
                        priority
                        unoptimized
                    />
                </div>

                {/* Info */}
                <div className="flex-1 space-y-3">
                    <h1 className="text-2xl font-bold">{comic.title}</h1>
                    {comic.title_indonesian && comic.title_indonesian !== comic.title && (
                        <p className="text-sm text-muted-foreground">
                            {comic.title_indonesian}
                        </p>
                    )}

                    {/* Detail Info */}
                    <div className="space-y-1.5 text-sm">
                        {comic.metadata?.author && (
                            <div className="flex items-start gap-2">
                                <span className="text-muted-foreground w-16 flex-shrink-0">Penulis</span>
                                <span className="font-medium">{comic.metadata.author}</span>
                            </div>
                        )}
                        {comic.metadata?.status && (
                            <div className="flex items-start gap-2">
                                <span className="text-muted-foreground w-16 flex-shrink-0">Status</span>
                                <Badge
                                    variant={
                                        comic.metadata.status === "End" ? "outline" : "default"
                                    }
                                    className="text-xs"
                                >
                                    {comic.metadata.status === "End" ? "Tamat" : comic.metadata.status}
                                </Badge>
                            </div>
                        )}
                        {comic.metadata?.type && (
                            <div className="flex items-start gap-2">
                                <span className="text-muted-foreground w-16 flex-shrink-0">Tipe</span>
                                <Badge variant="secondary" className="text-xs">{comic.metadata.type}</Badge>
                            </div>
                        )}
                        {comic.genres && comic.genres.length > 0 && (
                            <div className="flex items-start gap-2">
                                <span className="text-muted-foreground w-16 flex-shrink-0">Genre</span>
                                <div className="flex flex-wrap gap-1.5">
                                    {comic.genres.map((g) => (
                                        <Badge key={g.slug} variant="secondary" className="text-xs">
                                            {g.name}
                                        </Badge>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 pt-2">
                        <Button onClick={toggleFavorite} variant={fav ? "default" : "outline"}>
                            <Heart
                                className={`mr-2 h-4 w-4 ${fav ? "fill-current" : ""}`}
                            />
                            {fav ? "Difavoritkan" : "Tambah Favorit"}
                        </Button>
                        {comic.chapters && comic.chapters.length > 0 && (
                            <Link
                                href={`/comic/${comic.slug}/${comic.chapters[comic.chapters.length - 1].slug
                                    }`}
                            >
                                <Button>
                                    <BookOpen className="mr-2 h-4 w-4" />
                                    Mulai Baca
                                </Button>
                            </Link>
                        )}
                    </div>

                    {/* Reading Progress */}
                    {progress && (
                        <Card className="bg-muted/50">
                            <CardContent className="p-3 flex items-center gap-2 text-sm">
                                <CheckCircle2 className="h-4 w-4 text-green-500" />
                                <span>
                                    Terakhir baca:{" "}
                                    <Link
                                        href={`/comic/${comic.slug}/${progress.chapterSlug}`}
                                        className="font-medium underline"
                                    >
                                        {progress.chapterName}
                                    </Link>
                                </span>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>

            <Separator className="my-6" />

            {/* Synopsis */}
            {comic.synopsis && (
                <section className="mb-6">
                    <h2 className="text-lg font-semibold mb-2">Sinopsis</h2>
                    <div className="relative">
                        <p
                            className={`text-sm text-muted-foreground whitespace-pre-line ${!showFullSynopsis ? "line-clamp-4" : ""
                                }`}
                        >
                            {comic.synopsis_full || comic.synopsis}
                        </p>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setShowFullSynopsis(!showFullSynopsis)}
                            className="mt-1 h-auto p-0 text-xs"
                        >
                            {showFullSynopsis ? (
                                <>
                                    Sembunyikan <ChevronUp className="ml-1 h-3 w-3" />
                                </>
                            ) : (
                                <>
                                    Baca selengkapnya <ChevronDown className="ml-1 h-3 w-3" />
                                </>
                            )}
                        </Button>
                    </div>
                </section>
            )}

            {/* Chapters */}
            {comic.chapters && comic.chapters.length > 0 && (
                <section>
                    <h2 className="text-lg font-semibold mb-3">
                        Daftar Chapter ({comic.chapters.length})
                    </h2>
                    <div className="space-y-1">
                        {chaptersToShow?.map((ch) => {
                            const isRead = progress?.chapterSlug === ch.slug;
                            return (
                                <Link
                                    key={ch.slug}
                                    href={`/comic/${comic.slug}/${ch.slug}`}
                                >
                                    <div
                                        className={`flex items-center justify-between py-2.5 px-3 rounded-md text-sm hover:bg-accent transition-colors ${isRead ? "bg-accent/50" : ""
                                            }`}
                                    >
                                        <div className="flex items-center gap-2">
                                            {isRead && (
                                                <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />
                                            )}
                                            <span className={isRead ? "font-medium" : ""}>
                                                {ch.chapter}
                                            </span>
                                        </div>
                                        <span className="text-xs text-muted-foreground">
                                            {ch.date}
                                        </span>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>

                    {comic.chapters.length > 20 && (
                        <Button
                            variant="ghost"
                            className="w-full mt-2"
                            onClick={() => setShowAllChapters(!showAllChapters)}
                        >
                            {showAllChapters
                                ? "Sembunyikan"
                                : `Tampilkan semua ${comic.chapters.length} chapter`}
                            {showAllChapters ? (
                                <ChevronUp className="ml-1 h-4 w-4" />
                            ) : (
                                <ChevronDown className="ml-1 h-4 w-4" />
                            )}
                        </Button>
                    )}
                </section>
            )}
        </div>
    );
}
