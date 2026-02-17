"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { Heart, Home, Menu, Search, Clock, Flame, Tag, Loader2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ThemeToggle } from "@/components/theme-toggle";
import { useDebounce } from "@/hooks/use-debounce";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import LogoLight from "@/gambar/logo-light-mode.svg";
import Logo from "@/gambar/logo.svg";
import { useTheme } from "next-themes";
import type { SearchResult } from "@/lib/types";

const navLinks = [
    { href: "/", label: "Beranda", icon: Home },
    { href: "/terbaru", label: "Terbaru", icon: Clock },
    { href: "/populer", label: "Populer", icon: Flame },
    { href: "/genre", label: "Genre", icon: Tag },
];

interface SearchState {
    results: SearchResult[];
    loading: boolean;
    show: boolean;
}

export function Navbar() {
    const router = useRouter();
    const [query, setQuery] = useState("");
    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState<SearchState>({ results: [], loading: false, show: false });
    const debouncedQuery = useDebounce(query, 400);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const { theme, systemTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const currentTheme = theme === "system" ? systemTheme : theme;
    const logoSrc = mounted && currentTheme === "light" ? LogoLight : Logo;

    // Fetch search results when debounced query changes
    useEffect(() => {
        if (!debouncedQuery.trim() || debouncedQuery.trim().length < 2) {
            setSearch({ results: [], loading: false, show: false });
            return;
        }

        const controller = new AbortController();
        setSearch((prev) => ({ ...prev, loading: true, show: true }));

        fetch(`/api/search?q=${encodeURIComponent(debouncedQuery.trim())}`, {
            signal: controller.signal,
        })
            .then((res) => res.json())
            .then((data) => {
                setSearch({
                    results: data.data || [],
                    loading: false,
                    show: true,
                });
            })
            .catch(() => {
                if (!controller.signal.aborted) {
                    setSearch((prev) => ({ ...prev, loading: false }));
                }
            });

        return () => controller.abort();
    }, [debouncedQuery]);

    // Close dropdown on click outside
    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setSearch((prev) => ({ ...prev, show: false }));
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    function handleSearch(e: React.FormEvent) {
        e.preventDefault();
        if (query.trim()) {
            router.push(`/search?q=${encodeURIComponent(query.trim())}`);
            setQuery("");
            setSearch({ results: [], loading: false, show: false });
            setOpen(false);
        }
    }

    function selectResult(slug: string) {
        setQuery("");
        setSearch({ results: [], loading: false, show: false });
        setOpen(false);
        router.push(`/comic/${slug}`);
    }

    function clearQuery() {
        setQuery("");
        setSearch({ results: [], loading: false, show: false });
        inputRef.current?.focus();
    }

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container mx-auto flex h-14 items-center gap-4 px-4">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2 font-bold text-lg">
                    <Image
                        src={logoSrc}
                        alt="Qomik"
                        width={32}
                        height={32}
                        className="h-8 w-auto"
                    />
                </Link>

                {/* Desktop Nav */}
                <nav className="hidden md:flex items-center gap-1">
                    {navLinks.map((link) => (
                        <Link key={link.href} href={link.href}>
                            <Button variant="ghost" size="sm" className="gap-2">
                                <link.icon className="h-4 w-4" />
                                {link.label}
                            </Button>
                        </Link>
                    ))}
                </nav>

                {/* Spacer */}
                <div className="flex-1" />

                {/* Desktop Search with Live Results */}
                <div className="hidden md:block relative" ref={dropdownRef}>
                    <form onSubmit={handleSearch}>
                        <div className="relative">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                ref={inputRef}
                                placeholder="Cari komik..."
                                className="pl-8 pr-8 w-[200px] lg:w-[280px]"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                onFocus={() => {
                                    if (search.results.length > 0) {
                                        setSearch((prev) => ({ ...prev, show: true }));
                                    }
                                }}
                            />
                            {query && (
                                <button
                                    type="button"
                                    onClick={clearQuery}
                                    className="absolute right-2.5 top-2.5 text-muted-foreground hover:text-foreground"
                                >
                                    <X className="h-4 w-4" />
                                </button>
                            )}
                        </div>
                    </form>

                    {/* Search Results Dropdown */}
                    {search.show && (
                        <div className="absolute top-full mt-1 w-[320px] lg:w-[400px] right-0 bg-popover border rounded-lg shadow-lg max-h-[400px] overflow-y-auto z-50">
                            {search.loading ? (
                                <div className="flex items-center justify-center py-6 gap-2 text-muted-foreground">
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    <span className="text-sm">Mencari...</span>
                                </div>
                            ) : search.results.length === 0 ? (
                                <div className="py-6 text-center text-sm text-muted-foreground">
                                    Tidak ada hasil untuk &quot;{debouncedQuery}&quot;
                                </div>
                            ) : (
                                <>
                                    {search.results.slice(0, 8).map((result) => (
                                        <button
                                            key={result.slug}
                                            onClick={() => selectResult(result.slug)}
                                            className="w-full flex items-center gap-3 p-2.5 hover:bg-accent transition-colors text-left"
                                        >
                                            <div className="relative w-10 h-14 flex-shrink-0 rounded overflow-hidden bg-muted">
                                                {result.thumbnail && (
                                                    <Image
                                                        src={result.thumbnail}
                                                        alt={result.title}
                                                        fill
                                                        className="object-cover"
                                                        sizes="40px"
                                                        unoptimized
                                                    />
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium line-clamp-1">
                                                    {result.title}
                                                </p>
                                                <p className="text-xs text-muted-foreground mt-0.5">
                                                    {result.type}
                                                    {result.genre && ` · ${result.genre}`}
                                                </p>
                                            </div>
                                        </button>
                                    ))}
                                    {search.results.length > 8 && (
                                        <button
                                            onClick={() => handleSearch(new Event("submit") as unknown as React.FormEvent)}
                                            className="w-full py-2.5 text-center text-sm text-primary hover:bg-accent transition-colors border-t"
                                        >
                                            Lihat semua {search.results.length} hasil
                                        </button>
                                    )}
                                </>
                            )}
                        </div>
                    )}
                </div>

                {/* Favorites */}
                <Link href="/favorites">
                    <Button variant="ghost" size="icon">
                        <Heart className="h-[1.2rem] w-[1.2rem]" />
                        <span className="sr-only">Favorit</span>
                    </Button>
                </Link>

                {/* Theme Toggle */}
                <ThemeToggle />

                {/* Mobile Menu */}
                <Sheet open={open} onOpenChange={setOpen}>
                    <SheetTrigger asChild className="md:hidden">
                        <Button variant="ghost" size="icon">
                            <Menu className="h-5 w-5" />
                            <span className="sr-only">Menu</span>
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="left">
                        <SheetHeader>
                            <SheetTitle className="flex items-center gap-2">
                                <Image
                                    src={logoSrc}
                                    alt="Qomik"
                                    width={24}
                                    height={24}
                                    className="h-6 w-auto"
                                />
                            </SheetTitle>
                        </SheetHeader>
                        <div className="flex flex-col gap-4 mt-6">
                            {/* Mobile Search */}
                            <form onSubmit={handleSearch}>
                                <div className="relative">
                                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        placeholder="Cari komik..."
                                        className="pl-8"
                                        value={query}
                                        onChange={(e) => setQuery(e.target.value)}
                                    />
                                </div>
                            </form>

                            {/* Mobile Nav Links */}
                            <nav className="flex flex-col gap-1">
                                {navLinks.map((link) => (
                                    <Link
                                        key={link.href}
                                        href={link.href}
                                        onClick={() => setOpen(false)}
                                    >
                                        <Button variant="ghost" className="w-full justify-start gap-2">
                                            <link.icon className="h-4 w-4" />
                                            {link.label}
                                        </Button>
                                    </Link>
                                ))}
                                <Link href="/favorites" onClick={() => setOpen(false)}>
                                    <Button variant="ghost" className="w-full justify-start">
                                        <Heart className="mr-2 h-4 w-4" />
                                        Favorit
                                    </Button>
                                </Link>
                            </nav>
                        </div>
                    </SheetContent>
                </Sheet>
            </div>
        </header>
    );
}



