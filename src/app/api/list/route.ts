import { NextResponse } from "next/server";
import { getKomikStationList } from "@/lib/api";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const status = searchParams.get("status") || "";

    try {
        const data = await getKomikStationList(page, status);

        if (data.results && Array.isArray(data.results)) {
            const PAGE_SIZE = 30;
            data.pagination = {
                ...data.pagination,
                currentPage: page,
                hasNextPage: data.results.length >= PAGE_SIZE,
                nextPage: data.results.length >= PAGE_SIZE ? page + 1 : null,
            };
        }

        return NextResponse.json(data);
    } catch {
        return NextResponse.json(
            { success: false, results: [], pagination: { hasNextPage: false } },
            { status: 500 }
        );
    }
}
