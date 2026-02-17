"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";
import { ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { setReadingProgress } from "@/lib/storage";
import type { Chapter, ChapterImage } from "@/lib/types";

interface ChapterReaderContentProps {
    comicSlug: string;
    comicTitle: string;
    chapterSlug: string;
    chapterName: string;
    images: ChapterImage[];
    prevChapter: Chapter | null;
    nextChapter: Chapter | null;
}

export function ChapterReaderContent({
    comicSlug,
    comicTitle,
    chapterSlug,
    chapterName,
    images,
    prevChapter,
    nextChapter,
}: ChapterReaderContentProps) {
    // Save reading progress on mount
    useEffect(() => {
        setReadingProgress({
            comicSlug,
            comicTitle,
            chapterSlug,
            chapterName,
            lastReadAt: Date.now(),
        });
    }, [comicSlug, comicTitle, chapterSlug, chapterName]);

    return (
        <div className="min-h-screen">
            {/* Top Bar */}
            <div className="sticky top-14 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="container mx-auto flex items-center justify-between px-4 py-2">
                    <div className="flex items-center gap-2 min-w-0">
                        <Link href={`/comic/${comicSlug}`}>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                                <ArrowLeft className="h-4 w-4" />
                            </Button>
                        </Link>
                        <div className="min-w-0">
                            <p className="text-sm font-medium truncate">{comicTitle}</p>
                            <p className="text-xs text-muted-foreground">{chapterName}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-1">
                        {nextChapter && (
                            <Link href={`/comic/${comicSlug}/${nextChapter.slug}`}>
                                <Button variant="ghost" size="sm">
                                    <ChevronLeft className="h-4 w-4 mr-1" />
                                    Prev
                                </Button>
                            </Link>
                        )}
                        {prevChapter && (
                            <Link href={`/comic/${comicSlug}/${prevChapter.slug}`}>
                                <Button variant="ghost" size="sm">
                                    Next
                                    <ChevronRight className="h-4 w-4 ml-1" />
                                </Button>
                            </Link>
                        )}
                    </div>
                </div>
            </div>

            {/* Images */}
            <div className="max-w-3xl mx-auto">
                {images.map((img, idx) => (
                    <div key={idx} className="relative w-full">
                        <Image
                            src={img.src || (img as unknown as string)}
                            alt={img.alt || `Page ${idx + 1}`}
                            width={800}
                            height={1200}
                            className="w-full h-auto"
                            priority={idx < 3}
                            unoptimized
                        />
                    </div>
                ))}
            </div>

            {/* Bottom Navigation */}
            <div className="container mx-auto px-4 py-6">
                <div className="flex justify-between items-center max-w-3xl mx-auto">
                    {nextChapter ? (
                        <Link href={`/comic/${comicSlug}/${nextChapter.slug}`}>
                            <Button variant="outline">
                                <ChevronLeft className="mr-1 h-4 w-4" />
                                {nextChapter.chapter}
                            </Button>
                        </Link>
                    ) : (
                        <div />
                    )}
                    <Link href={`/comic/${comicSlug}`}>
                        <Button variant="ghost">Daftar Chapter</Button>
                    </Link>
                    {prevChapter ? (
                        <Link href={`/comic/${comicSlug}/${prevChapter.slug}`}>
                            <Button variant="outline">
                                {prevChapter.chapter}
                                <ChevronRight className="ml-1 h-4 w-4" />
                            </Button>
                        </Link>
                    ) : (
                        <div />
                    )}
                </div>
            </div>
        </div>
    );
}
