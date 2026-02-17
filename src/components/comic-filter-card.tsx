"use client";

import { X, ChevronUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { GenrePicker } from "@/components/genre-picker";
import type { GenreItem } from "@/lib/types";

interface ComicFilterCardProps {
    genres: GenreItem[];
    selectedGenres: string[];
    toggleGenre: (slug: string) => void;
    statusFilter: string;
    setStatusFilter: (value: string) => void;
    onApply: () => void;
    onReset?: () => void;
    showStatus?: boolean;
}

const STATUS_OPTIONS = ["Semua", "Ongoing", "Complete"] as const;

export function ComicFilterCard({
    genres,
    selectedGenres,
    toggleGenre,
    statusFilter,
    setStatusFilter,
    onApply,
    onReset,
    showStatus = true,
}: ComicFilterCardProps) {
    return (
        <Card className="mb-6">
            <CardContent className="p-4 space-y-4">
                {/* Genre */}
                <div>
                    <p className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wider">
                        Genre
                    </p>
                    <GenrePicker
                        genres={genres}
                        selectedGenres={selectedGenres}
                        toggleGenre={toggleGenre}
                    />
                </div>

                {/* Status */}
                {showStatus && (
                    <>
                        <Separator />
                        <div>
                            <p className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wider">
                                Status
                            </p>
                            <div className="flex flex-wrap gap-1.5">
                                {STATUS_OPTIONS.map((status) => (
                                    <button key={status} onClick={() => setStatusFilter(status)}>
                                        <Badge
                                            variant={statusFilter === status ? "default" : "outline"}
                                            className="px-3 py-1 text-xs cursor-pointer hover:bg-accent transition-colors"
                                        >
                                            {status}
                                        </Badge>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </>
                )}

                {/* Actions */}
                <div className="flex justify-end pt-2">
                    <Button
                        variant="destructive"
                        size="sm"
                        onClick={onReset}
                        className="h-7 text-xs"
                    >
                        Reset Filter
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}
