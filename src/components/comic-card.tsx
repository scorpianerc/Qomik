"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { extractSlug } from "@/lib/api";
import { addFavorite, removeFavorite, isFavorite } from "@/lib/storage";
import { useState, useEffect } from "react";

interface ComicCardProps {
    title: string;
    image: string;
    link: string;
    chapter?: string;
    timeAgo?: string;
    type?: string;
    showFavorite?: boolean;
    detailImage?: string;
}

export function ComicCard({
    title,
    image,
    link,
    chapter,
    timeAgo,
    type,
    showFavorite = true,
    detailImage,
}: ComicCardProps) {
    const displayImage = detailImage || image;
    const slug = extractSlug(link);
    const [fav, setFav] = useState(false);

    useEffect(() => {
        setFav(isFavorite(slug));
    }, [slug]);

    function toggleFavorite(e: React.MouseEvent) {
        e.preventDefault();
        e.stopPropagation();
        if (fav) {
            removeFavorite(slug);
            setFav(false);
        } else {
            addFavorite({ slug, title, image, chapter: chapter || "", addedAt: Date.now() });
            setFav(true);
        }
    }

    return (
        <Link href={`/comic/${slug}`}>
            <Card className="overflow-hidden group hover:shadow-md transition-shadow h-full">
                <div className="relative aspect-[3/4] overflow-hidden bg-muted">
                    {displayImage ? (
                        <Image
                            src={displayImage}
                            alt={title}
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
                    {showFavorite && (
                        <Button
                            variant="ghost"
                            size="icon"
                            className="absolute top-1 right-1 h-8 w-8 bg-background/70 hover:bg-background/90 rounded-full"
                            onClick={toggleFavorite}
                        >
                            <Heart
                                className={`h-4 w-4 ${fav
                                    ? "fill-red-500 text-red-500"
                                    : "text-foreground"
                                    }`}
                            />
                        </Button>
                    )}
                    {type && (
                        <Badge
                            variant="secondary"
                            className="absolute bottom-1 left-1 text-[10px]"
                        >
                            {type}
                        </Badge>
                    )}
                </div>
                <CardContent className="p-2.5">
                    <h3 className="font-medium text-sm line-clamp-1 leading-tight whitespace-normal">
                        {title}
                    </h3>
                    <div className="flex items-center justify-between mt-1.5">
                        {chapter && (
                            <span className="text-xs text-muted-foreground">{chapter}</span>
                        )}
                        {timeAgo && (
                            <span className="text-xs text-muted-foreground">{timeAgo}</span>
                        )}
                    </div>
                </CardContent>
            </Card>
        </Link>
    );
}
