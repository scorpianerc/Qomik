import { NextResponse } from "next/server";
import { getComicsByGenre } from "@/lib/api";

export async function GET(
    request: Request,
    { params }: { params: Promise<{ slug: string }> }
) {
    const slug = (await params).slug;

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");

    try {
        // Use the service function instead of direct fetch
        const data = await getComicsByGenre(slug, page);
        return NextResponse.json(data);
    } catch {
        return NextResponse.json(
            { success: false, komikList: [] },
            { status: 500 }
        );
    }
}
