import { getLatestComics, getPopularComics, getTrendingComics, extractSlug } from "@/lib/api";
import { HomeContent } from "./home-content";

export const revalidate = 300;

export default async function HomePage() {
    const [latestData, popularData, trendingData] = await Promise.all([
        getLatestComics().catch(() => null),
        getPopularComics().catch(() => null),
        getTrendingComics().catch(() => null),
    ]);

    const latest = (latestData?.comics || []).map((c) => ({
        ...c,
        slug: extractSlug(c.link),
    }));

    const popular = (popularData?.comics || []).map((c) => ({
        ...c,
        slug: extractSlug(c.link),
    }));

    const trending = (trendingData?.trending || [])
        .filter((c) => !c.title.includes("APK"))
        .map((c) => ({
            ...c,
            slug: extractSlug(c.link),
        }));

    return <HomeContent latest={latest} popular={popular} trending={trending} />;
}
