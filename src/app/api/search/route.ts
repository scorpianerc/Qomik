import { NextResponse } from "next/server";
import { searchComics } from "@/lib/api";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get("q") || "";

    try {
        const data = await searchComics(q);
        return NextResponse.json(data);
    } catch {
        return NextResponse.json({ data: [] }, { status: 500 });
    }
}
