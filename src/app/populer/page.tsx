import { getPopularComics, extractSlug } from "@/lib/api";
import { PopulerContent } from "./populer-content";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Komik Populer - Qomik",
    description: "Daftar komik paling populer saat ini",
};

export const revalidate = 300;

export default async function PopulerPage() {
    const data = await getPopularComics().catch(() => null);

    const comics = (data?.comics || []).map((c) => ({
        ...c,
        slug: extractSlug(c.link),
    }));

    return <PopulerContent comics={comics} />;
}
