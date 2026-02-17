"use client";

import { useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Star, Tag, SlidersHorizontal, Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useDetailImages } from "@/hooks/use-detail-images";
import { GenrePicker } from "@/components/genre-picker";
import { ComicFilterCard } from "@/components/comic-filter-card";
import { useComicFilter } from "@/hooks/use-comic-filter";
import type { GenreComic, GenreItem } from "@/lib/types";
import { useState } from "react";

interface GenreDetailContentProps {
    genreTitle: string;
    genreSlug: string;
    comics: GenreComic[];
    genres: GenreItem[];
}

export function GenreDetailContent({
    genreTitle,
    genreSlug,
    comics: initialComics,
    genres,
}: GenreDetailContentProps) {
    const {
        selectedGenres,
        statusFilter,
        filteredComics,
        loading,
        fetchComics,
        toggleGenre,
        setStatusFilter,
        resetFilters,
        goToPage,
        page,
        hasMore,
    } = useComicFilter(initialComics, [genreSlug]);

    const [showFilter, setShowFilter] = useState(false);

    const activeFilterCount =
        (selectedGenres.length > 1 ? 1 : 0) +
        (statusFilter !== "Semua" ? 1 : 0);

    // Fetch detail images for all visible comics
    const comicSlugs = useMemo(
        () => filteredComics.map((c) => c.slug).filter(Boolean),
        [filteredComics]
    );
    const detailImages = useDetailImages(comicSlugs);

    return (
        <div className="container mx-auto px-4 py-6">
            {/* Header */}
            <div className="flex items-center gap-3 mb-4">
                <Link href="/genre">
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                </Link>
                <h1 className="text-2xl font-bold flex items-center gap-2">
                    <Tag className="h-6 w-6" />
                    {genreTitle}
                </h1>
            </div>

            {/* Genre Picker (Simplified view when filter is closed) */}
            {genres.length > 0 && !showFilter && (
                <div className="mb-4">
                    <GenrePicker
                        genres={genres}
                        selectedGenres={selectedGenres}
                        toggleGenre={(slug) => {
                            const isSelected = selectedGenres.includes(slug);
                            // If unselecting the last genre, don't allow it (or handle it)
                            // But useComicFilter handles empty selection by clearing comics.
                            // We want to keep at least one genre or redirect? 
                            // For now let's just use standard behavior.
                            toggleGenre(slug);
                            const newGenres = isSelected
                                ? selectedGenres.filter((s) => s !== slug)
                                : [...selectedGenres, slug];

                            if (newGenres.length > 0) {
                                fetchComics(newGenres);
                            } else {
                                // If all genres removed, maybe show empty or all?
                                // useComicFilter clears comics if empty.
                            }
                        }}
                    />
                </div>
            )}

            {/* Results Header + Filter Toggle */}
            <div className="flex items-center justify-between mb-4">
                <p className="text-sm text-muted-foreground">
                    {!loading && `Menampilkan ${filteredComics.length} komik`}
                </p>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowFilter(!showFilter)}
                    className="relative"
                >
                    <SlidersHorizontal className="h-4 w-4 mr-2" />
                    Filter
                    {activeFilterCount > 0 && (
                        <span className="absolute -top-1.5 -right-1.5 bg-primary text-primary-foreground text-[10px] rounded-full w-4 h-4 flex items-center justify-center">
                            {activeFilterCount}
                        </span>
                    )}
                </Button>
            </div>

            {/* Filter Card */}
            {showFilter && (
                <ComicFilterCard
                    genres={genres}
                    selectedGenres={selectedGenres}
                    toggleGenre={(slug) => {
                        const isSelected = selectedGenres.includes(slug);
                        const newGenres = isSelected
                            ? selectedGenres.filter((s) => s !== slug)
                            : [...selectedGenres, slug];

                        toggleGenre(slug);
                        if (newGenres.length > 0) {
                            fetchComics(newGenres);
                        }
                    }}
                    statusFilter={statusFilter}
                    setStatusFilter={setStatusFilter}
                    onApply={() => { }}
                    onReset={() => {
                        resetFilters();
                        // Restore current genre
                        toggleGenre(genreSlug);
                        fetchComics([genreSlug]);
                    }}
                />
            )}

            {/* Comics Grid */}
            {loading ? (
                <div className="flex flex-col items-center justify-center py-16 gap-3">
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">Memuat komik...</p>
                </div>
            ) : filteredComics.length === 0 ? (
                <p className="text-muted-foreground text-center py-12">
                    Tidak ada komik ditemukan dengan filter yang dipilih.
                </p>
            ) : (
                <>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                        {filteredComics.map((comic) => {
                            let imageUrl: string | undefined;
                            let rating: string | null = null;

                            if ("imageSrc" in comic) {
                                imageUrl = comic.imageSrc;
                                rating = comic.rating;
                            } else {
                                imageUrl = comic.cover;
                                rating = comic.rating || null;
                            }

                            return (
                                <Link key={comic.slug} href={`/comic/${comic.slug}`}>
                                    <Card className="overflow-hidden group h-full">
                                        <div className="relative aspect-[3/4] overflow-hidden bg-muted">
                                            {(detailImages[comic.slug] || imageUrl) ? (
                                                <Image
                                                    src={detailImages[comic.slug] || imageUrl!}
                                                    alt={comic.title}
                                                    fill
                                                    className="object-cover transition-transform group-hover:scale-105"
                                                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                                                    unoptimized
                                                />
                                            ) : (
                                                <div className="absolute inset-0 flex items-center justify-center text-muted-foreground text-xs">
                                                    No Image
                                                </div>
                                            )}
                                        </div>
                                        <CardContent className="p-2.5">
                                            <h3 className="font-medium text-sm line-clamp-1 leading-tight">
                                                {comic.title}
                                            </h3>
                                            {rating && (
                                                <div className="flex items-center gap-1 mt-1">
                                                    <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                                                    <span className="text-xs text-muted-foreground">
                                                        {rating}
                                                    </span>
                                                </div>
                                            )}
                                        </CardContent>
                                    </Card>
                                </Link>
                            );
                        })}
                    </div>

                    {/* Pagination Controls */}
                    <div className="flex justify-center items-center gap-4 mt-8">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => goToPage(page - 1)}
                            disabled={page <= 1 || loading}
                        >
                            <ChevronLeft className="mr-1 h-4 w-4" />
                            Sebelumnya
                        </Button>
                        <span className="text-sm text-muted-foreground">
                            Halaman {page}
                        </span>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => goToPage(page + 1)}
                            disabled={!hasMore || loading}
                        >
                            Selanjutnya
                            <ChevronRight className="ml-1 h-4 w-4" />
                        </Button>
                    </div>
                </>
            )}
        </div>
    );
}
