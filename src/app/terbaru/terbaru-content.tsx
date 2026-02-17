"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import {
    ChevronLeft,
    ChevronRight,
    SlidersHorizontal,
    Loader2,
    Star,
    ArrowLeft
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ComicCard } from "@/components/comic-card";
import { ComicFilterCard } from "@/components/comic-filter-card";
import { useComicFilter } from "@/hooks/use-comic-filter";
import { useDetailImages } from "@/hooks/use-detail-images";
import type { Comic, GenreItem, GenreComic, KomikStationComic } from "@/lib/types";

interface ComicWithSlug extends Comic {
    slug: string;
}

interface TerbaruContentProps {
    comics: ComicWithSlug[];
    genres: GenreItem[];
    currentPage: number;
    hasMore: boolean;
}

export function TerbaruContent({
    comics,
    genres,
    currentPage,
    hasMore,
}: TerbaruContentProps) {
    const initialComics = useMemo(() => {
        return comics.map(c => ({
            ...c,
            // Map for compatibility but keep original fields
            cover: c.image,
        })) as unknown as GenreComic[];
    }, [comics]);

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
        hasMore: hasMoreFiltered,
    } = useComicFilter(initialComics);

    const [showFilter, setShowFilter] = useState(false);

    // Fetch detail images for all visible comics
    const comicSlugs = useMemo(() => {
        return comics.map((c) => c.slug).filter(Boolean);
    }, [comics]);
    const detailImages = useDetailImages(comicSlugs);

    const activeFilterCount = selectedGenres.length;

    function handleBack() {
        resetFilters();
        setShowFilter(false);
    }

    function getGenreTitle(slug: string) {
        return genres.find((g) => g.slug === slug)?.title || slug;
    }

    // Helper logic for displaying filtered comics
    const displayFilteredComics: (GenreComic | ComicWithSlug | KomikStationComic)[] = filteredComics;

    if (selectedGenres.length === 0 && activeFilterCount > 0) {
        if (statusFilter === "Semua") {
        }
    }

    // Fetch detail images for filtered comics
    const filteredSlugs = useMemo(
        () => displayFilteredComics.map((c) => c.slug).filter(Boolean),
        [displayFilteredComics]
    );
    const filteredDetailImages = useDetailImages(filteredSlugs);

    return (
        <div className="container mx-auto px-4 py-6">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold flex items-center gap-2">
                    {hasSearched || activeFilterCount > 0 ? (
                        <>
                            <button onClick={handleBack}>
                                <ArrowLeft className="h-6 w-6 hover:text-primary transition-colors" />
                            </button>
                            Hasil Filter
                        </>
                    ) : (
                        "Komik Terbaru"
                    )}
                </h1>

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

                        // We set hasSearched=true on first filter interaction to switch view
                        if (!hasSearched) setHasSearched(true);

                        if (newGenres.length > 0) {
                            fetchComics(newGenres);
                        } else {
                            if (activeFilterCount === 0) handleBack();
                        }
                    }}
                    statusFilter={statusFilter}
                    setStatusFilter={setStatusFilter}
                    onApply={() => { }}
                    onReset={handleBack}
                    showStatus={false}
                />
            )}

            {/* Active Filters Display */}
            {hasSearched && selectedGenres.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-6">
                    {selectedGenres.map((slug) => (
                        <Badge key={slug} variant="secondary" className="px-2 py-1 text-xs">
                            {getGenreTitle(slug)}
                        </Badge>
                    ))}
                </div>
            )}

            {hasSearched || activeFilterCount > 0 ? (
                /* Filtered Results View */
                <>
                    <div className="flex items-center justify-between mb-4">
                        <p className="text-sm text-muted-foreground">
                            {!loading && `Menampilkan ${filteredComics?.length || 0} komik`}
                        </p>
                    </div>

                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-16 gap-3">
                            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                            <p className="text-sm text-muted-foreground">Memuat komik...</p>
                        </div>
                    ) : (
                        <>
                            {displayFilteredComics.length === 0 ? (
                                <p className="text-muted-foreground text-center py-12">
                                    Tidak ada komik ditemukan dengan filter yang dipilih.
                                </p>
                            ) : (
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                                    {displayFilteredComics.map((comic) => {
                                        // Helper to get image and rating safely from union type
                                        let imageUrl: string | undefined;
                                        let rating: string | null = null;
                                        let chapter: string | undefined;

                                        if ("imageSrc" in comic) {
                                            // KomikStationComic
                                            imageUrl = comic.imageSrc;
                                            rating = comic.rating;
                                            chapter = comic.latestChapter;
                                        } else if ("image" in comic) {
                                            // ComicWithSlug
                                            imageUrl = comic.image;
                                            chapter = comic.chapter;
                                        } else {
                                            // GenreComic
                                            imageUrl = comic.cover;
                                            rating = comic.rating || null;
                                        }

                                        return (
                                            <Link key={comic.slug} href={`/comic/${comic.slug}`}>
                                                <Card className="overflow-hidden group h-full">
                                                    <div className="relative aspect-[3/4] overflow-hidden bg-muted">
                                                        {(filteredDetailImages[comic.slug] || imageUrl) ? (
                                                            <Image
                                                                src={filteredDetailImages[comic.slug] || imageUrl!}
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
                                                        {rating && (
                                                            <div className="absolute top-1.5 right-1.5 bg-black/60 text-white text-[10px] px-1.5 py-0.5 rounded flex items-center gap-1 backdrop-blur-sm">
                                                                <Star className="h-2.5 w-2.5 text-yellow-400 fill-yellow-400" />
                                                                {rating}
                                                            </div>
                                                        )}
                                                        {chapter && (
                                                            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3 pt-6">
                                                                <span className="text-xs text-white font-medium line-clamp-1">
                                                                    {chapter.replace("Chapter ", "Ch. ")}
                                                                </span>
                                                            </div>
                                                        )}
                                                    </div>
                                                    <CardContent className="p-2.5">
                                                        <h3 className="font-medium text-sm line-clamp-1 leading-tight group-hover:text-primary transition-colors">
                                                            {comic.title}
                                                        </h3>
                                                        <div className="flex items-center justify-between mt-2">
                                                            {chapter && (
                                                                <span className="text-xs text-muted-foreground line-clamp-1">
                                                                    {chapter.replace("Chapter ", "Ch. ")}
                                                                </span>
                                                            )}
                                                        </div>
                                                    </CardContent>
                                                </Card>
                                            </Link>
                                        );
                                    })}
                                </div>
                            )}

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
                                    disabled={!hasMoreFiltered || loading}
                                >
                                    Selanjutnya
                                    <ChevronRight className="ml-1 h-4 w-4" />
                                </Button>
                            </div>
                        </>
                    )}
                </>
            ) : (      /* Latest Comics View */
                <>
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
                                    timeAgo={comic.time_ago}
                                    detailImage={detailImages[comic.slug]}
                                />
                            ))}
                        </div>
                    )}

                    {/* Pagination */}
                    <div className="flex justify-center items-center gap-4 mt-8">
                        {currentPage > 1 && (
                            <Link href={`/terbaru?page=${currentPage - 1}`}>
                                <Button variant="outline" size="sm">
                                    <ChevronLeft className="mr-1 h-4 w-4" />
                                    Sebelumnya
                                </Button>
                            </Link>
                        )}
                        <span className="text-sm text-muted-foreground">
                            Halaman {currentPage}
                        </span>
                        {hasMore && (
                            <Link href={`/terbaru?page=${currentPage + 1}`}>
                                <Button variant="outline" size="sm">
                                    Selanjutnya
                                    <ChevronRight className="ml-1 h-4 w-4" />
                                </Button>
                            </Link>
                        )}
                    </div>
                </>
            )}
        </div >
    );
}
