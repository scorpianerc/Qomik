import { NextResponse } from "next/server";

const BASE_URL = process.env.API_BASE_URL!;

export async function POST(request: Request) {
    try {
        const { slugs } = await request.json();

        if (!Array.isArray(slugs) || slugs.length === 0) {
            return NextResponse.json({ images: {} });
        }

        // Fetch detail for each slug in parallel (limit to 20 to avoid overload)
        const limitedSlugs = slugs.slice(0, 20);
        const results = await Promise.allSettled(
            limitedSlugs.map(async (slug: string) => {
                const res = await fetch(`${BASE_URL}/comic/${slug}`, {
                    next: { revalidate: 86400 }, // cache 24 hours (images rarely change)
                });
                if (!res.ok) return { slug, image: null };
                const data = await res.json();
                return { slug, image: data.image || null };
            })
        );

        const images: Record<string, string> = {};
        for (const result of results) {
            if (result.status === "fulfilled" && result.value.image) {
                images[result.value.slug] = result.value.image;
            }
        }

        return NextResponse.json({ images });
    } catch {
        return NextResponse.json({ images: {} }, { status: 500 });
    }
}
