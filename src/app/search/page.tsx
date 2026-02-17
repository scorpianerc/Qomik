import { searchComics } from "@/lib/api";
import { SearchContent } from "./search-content";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Cari Komik - Qomik",
    description: "Cari komik manga, manhwa, manhua favorit kamu",
};

export default async function SearchPage({
    searchParams,
}: {
    searchParams: Promise<{ q?: string }>;
}) {
    const params = await searchParams;
    const query = params.q || "";

    let results = null;
    if (query) {
        try {
            results = await searchComics(query);
        } catch {
            results = null;
        }
    }

    return <SearchContent query={query} results={results} />;
}
