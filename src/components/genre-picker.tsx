"use client";

import { useState, useRef, useEffect } from "react";
import { X, Search, Check, ChevronsUpDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { GenreItem } from "@/lib/types";

interface GenrePickerProps {
    genres: GenreItem[];
    selectedGenres: string[];
    toggleGenre: (slug: string) => void;
}

export function GenrePicker({
    genres,
    selectedGenres,
    toggleGenre,
}: GenrePickerProps) {
    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState("");
    const containerRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    // Close on outside click
    useEffect(() => {
        function handleClick(e: MouseEvent) {
            if (
                containerRef.current &&
                !containerRef.current.contains(e.target as Node)
            ) {
                setOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClick);
        return () => document.removeEventListener("mousedown", handleClick);
    }, []);

    const filtered = genres.filter((g) =>
        g.title.toLowerCase().includes(search.toLowerCase())
    );

    const selectedItems = genres.filter((g) =>
        selectedGenres.includes(g.slug)
    );

    return (
        <div ref={containerRef} className="relative">
            {/* Trigger */}
            <button
                type="button"
                onClick={() => {
                    setOpen(!open);
                    setTimeout(() => inputRef.current?.focus(), 50);
                }}
                className="w-full flex items-center justify-between gap-2 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background hover:bg-accent/50 transition-colors min-h-[40px]"
            >
                {selectedItems.length === 0 ? (
                    <span className="text-muted-foreground">
                        Pilih genre...
                    </span>
                ) : (
                    <div className="flex flex-wrap gap-1.5 flex-1 overflow-x-auto scrollbar-hide">
                        {selectedItems.map((g) => (
                            <Badge
                                key={g.slug}
                                variant="default"
                                className="px-2 py-0.5 text-xs flex items-center gap-1 flex-shrink-0"
                            >
                                {g.title}
                                <X
                                    className="h-3 w-3 cursor-pointer hover:text-destructive"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        toggleGenre(g.slug);
                                    }}
                                />
                            </Badge>
                        ))}
                    </div>
                )}
                <ChevronsUpDown className="h-4 w-4 text-muted-foreground flex-shrink-0" />
            </button>

            {/* Dropdown */}
            {open && (
                <div className="absolute z-50 mt-1 w-full rounded-md border bg-popover shadow-lg animate-in fade-in-0 zoom-in-95">
                    {/* Search */}
                    <div className="flex items-center gap-2 border-b px-3 py-2">
                        <Search className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                        <input
                            ref={inputRef}
                            type="text"
                            placeholder="Cari genre..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                        />
                        {search && (
                            <button onClick={() => setSearch("")}>
                                <X className="h-3.5 w-3.5 text-muted-foreground hover:text-foreground" />
                            </button>
                        )}
                    </div>

                    {/* List */}
                    <div className="max-h-[200px] overflow-y-auto p-1">
                        {filtered.length === 0 ? (
                            <p className="text-sm text-muted-foreground text-center py-4">
                                Genre tidak ditemukan.
                            </p>
                        ) : (
                            filtered.map((genre) => {
                                const isSelected = selectedGenres.includes(
                                    genre.slug
                                );
                                return (
                                    <button
                                        key={genre.slug}
                                        type="button"
                                        onClick={() => toggleGenre(genre.slug)}
                                        className={`w-full flex items-center gap-2 px-2 py-1.5 text-sm rounded-sm hover:bg-accent transition-colors text-left ${isSelected ? "font-medium" : ""
                                            }`}
                                    >
                                        <div
                                            className={`h-4 w-4 flex-shrink-0 flex items-center justify-center rounded-sm border ${isSelected
                                                ? "bg-primary border-primary text-primary-foreground"
                                                : "border-muted-foreground/30"
                                                }`}
                                        >
                                            {isSelected && (
                                                <Check className="h-3 w-3" />
                                            )}
                                        </div>
                                        <span className="truncate">{genre.title}</span>
                                    </button>
                                );
                            })
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
