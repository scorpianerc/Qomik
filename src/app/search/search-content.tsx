"use client";

import Image from "next/image";
import Link from "next/link";
import { Search } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useDetailImages } from "@/hooks/use-detail-images";
import type { SearchResponse } from "@/lib/types";
import { useMemo } from "react";

interface SearchContentProps {
    query: string;
    results: SearchResponse | null;
}

export function SearchContent({ query, results }: SearchContentProps) {
    // Fetch detail images for search results
    const slugs = useMemo(() => {
        return results?.data?.map((item) => item.slug).filter(Boolean) || [];
    }, [results]);
    const detailImages = useDetailImages(slugs);

    return (
        <div className="container mx-auto px-4 py-6">
            {/* Title */}
            {query ? (
                <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
                    <Search className="h-6 w-6 text-muted-foreground" />
                    Search for &quot;{query}&quot;
                </h1>
            ) : (
                <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
                    <Search className="h-6 w-6 text-muted-foreground" />
                    Cari Komik
                </h1>
            )}

            {!query && (
                <p className="text-muted-foreground text-center py-12">
                    Gunakan search bar di navbar untuk mencari komik.
                </p>
            )}

            {query && !results && (
                <p className="text-muted-foreground text-center py-12">
                    Gagal memuat hasil pencarian. Coba lagi nanti.
                </p>
            )}

            {results && results.data.length === 0 && (
                <p className="text-muted-foreground text-center py-12">
                    Tidak ditemukan komik dengan kata kunci &quot;{query}&quot;.
                </p>
            )}

            {results && results.data.length > 0 && (
                <div className="space-y-3">
                    <p className="text-sm text-muted-foreground">
                        Ditemukan {results.total} hasil
                    </p>
                    <div className="grid gap-3">
                        {results.data.map((item) => {
                            const displayImage = detailImages[item.slug] || item.thumbnail;
                            return (
                                <Link key={item.slug} href={`/comic/${item.slug}`}>
                                    <Card className="overflow-hidden hover:shadow-md transition-shadow">
                                        <CardContent className="flex gap-4 p-3">
                                            <div className="relative w-16 h-20 flex-shrink-0 rounded overflow-hidden bg-muted">
                                                <Image
                                                    src={displayImage}
                                                    alt={item.title}
                                                    fill
                                                    className="object-cover"
                                                    unoptimized
                                                />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h3 className="font-medium text-sm line-clamp-1">
                                                    {item.title}
                                                </h3>
                                                <div className="flex gap-2 mt-1">
                                                    <Badge variant="secondary" className="text-[10px]">
                                                        {item.type}
                                                    </Badge>
                                                    <Badge variant="outline" className="text-[10px]">
                                                        {item.genre}
                                                    </Badge>
                                                </div>
                                                <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                                                    {item.description}
                                                </p>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </Link>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}
