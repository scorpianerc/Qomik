"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import {
    Tag,
    Star,
    SlidersHorizontal,
    X,
    Loader2,
    Search,
    ArrowLeft,
    ChevronLeft,
    ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ComicFilterCard } from "@/components/comic-filter-card";
import { useComicFilter } from "@/hooks/use-comic-filter";
import { useDetailImages } from "@/hooks/use-detail-images";
import type { GenreItem, GenreComic, KomikStationComic } from "@/lib/types";

interface GenreListContentProps {
    genres: GenreItem[];
}

export function GenreListContent({ genres }: GenreListContentProps) {
    const {
        selectedGenres,
        statusFilter,
        filteredComics,
        loading,
        hasSearched,
        setHasSearched,
        fetchComics,
        toggleGenre,
        setStatusFilter,
        resetFilters,
        goToPage,
        page,
        hasMore,
    } = useComicFilter();

    const [showFilter, setShowFilter] = useState(false);

    function handleSearch() {
        setHasSearched(true);
        fetchComics(selectedGenres);
    }

    function handleBack() {
        resetFilters();
        setShowFilter(false);
    }

    const activeFilterCount = 0; // Type filter removed, only genre matters logic is separate

    function getGenreTitle(slug: string) {
        return genres.find((g) => g.slug === slug)?.title || slug;
    }

    // Fetch detail images for all visible comics
    const comicSlugs = useMemo(
        () => filteredComics.map((c) => c.slug).filter(Boolean),
        [filteredComics]
    );
    const detailImages = useDetailImages(comicSlugs);

    return (
        <div className="container mx-auto px-4 py-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-2">
                <h1 className="text-2xl font-bold flex items-center gap-2">
                    {hasSearched ? (
                        <>
                            <button onClick={handleBack}>
                                <ArrowLeft className="h-6 w-6 hover:text-primary transition-colors" />
                            </button>
                            Hasil Pencarian
                        </>
                    ) : (
                        <>
                            <Tag className="h-6 w-6" />
                            Genre Komik
                        </>
                    )}
                </h1>
            </div>

            {!hasSearched ? (
                /* Genre Selection View */
                <>
                    <p className="text-muted-foreground text-sm mb-6">
                        Pilih satu atau lebih genre, lalu tekan tombol cari.
                    </p>

                    {genres.length === 0 ? (
                        <p className="text-muted-foreground text-center py-12">
                            Gagal memuat daftar genre.
                        </p>
                    ) : (
                        <>
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
                                {genres.map((genre) => {
                                    const isSelected = selectedGenres.includes(genre.slug);
                                    return (
                                        <Button
                                            key={genre.slug}
                                            variant={isSelected ? "default" : "outline"}
                                            size="sm"
                                            onClick={() => toggleGenre(genre.slug)}
                                            className={`justify-start h-auto py-2 px-3 text-xs ${isSelected ? "" : "hover:bg-accent"
                                                }`}
                                        >
                                            <span className="truncate" title={genre.title}>
                                                {genre.title}
                                            </span>
                                        </Button>
                                    );
                                })}
                            </div>

                            {selectedGenres.length > 0 && (
                                <div className="flex justify-end gap-2 mt-6 sticky bottom-4 bg-background/80 backdrop-blur-sm p-2 rounded-lg border shadow-sm z-10">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={resetFilters}
                                        className="border-red-500 text-red-500 hover:bg-red-500/10 hover:text-red-500"
                                    >
                                        <X className="h-4 w-4 mr-1" />
                                        Reset
                                    </Button>
                                    <Button onClick={handleSearch} disabled={loading} size="sm">
                                        <Search className="h-4 w-4 mr-1" />
                                        Cari Komik
                                    </Button>
                                </div>
                            )}
                        </>
                    )}
                </>

            ) : (
                /* Results View */
                <>
                    {/* Selected genres summary */}
                    <div className="flex flex-wrap gap-1.5 mb-4">
                        {selectedGenres.map((slug) => (
                            <Badge key={slug} variant="secondary" className="px-2 py-1 text-xs">
                                {getGenreTitle(slug)}
                            </Badge>
                        ))}
                    </div>

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
                                } else {
                                    handleBack();
                                }
                            }}
                            statusFilter={statusFilter}
                            setStatusFilter={setStatusFilter}
                            onApply={() => { }}
                            showStatus={false}
                        />
                    )}

                    {/* Results Grid */}
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
                                    let type: string | null = null;
                                    // let chapter: string | undefined; // GenreComic doesn't usually show chapter in this view, but KomikStation does.

                                    if ("imageSrc" in comic) {
                                        // KomikStationComic
                                        imageUrl = comic.imageSrc;
                                        rating = comic.rating;
                                        // chapter = comic.latestChapter;
                                    } else {
                                        // GenreComic
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
                </>
            )}
        </div>
    );
}
