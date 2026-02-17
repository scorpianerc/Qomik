import { getChapterImages, getComicDetail } from "@/lib/api";
import { ChapterReaderContent } from "./chapter-reader-content";
import { notFound } from "next/navigation";

export const revalidate = 3600; // 1 hour cache for chapters

export default async function ChapterPage({
    params,
}: {
    params: Promise<{ slug: string; chapter: string }>;
}) {
    const { slug, chapter } = await params;

    const [images, comicDetail] = await Promise.all([
        getChapterImages(chapter).catch(() => []),
        getComicDetail(slug).catch(() => null),
    ]);

    if (!images || images.length === 0) {
        notFound();
    }

    // Find current chapter index for prev/next navigation
    const chapters = comicDetail?.chapters || [];
    const currentIndex = chapters.findIndex((c) => c.slug === chapter);
    const prevChapter = currentIndex > 0 ? chapters[currentIndex - 1] : null;
    const nextChapter =
        currentIndex < chapters.length - 1 ? chapters[currentIndex + 1] : null;

    // Get chapter name
    const currentChapter = chapters.find((c) => c.slug === chapter);
    const chapterName = currentChapter?.chapter || chapter;

    return (
        <ChapterReaderContent
            comicSlug={slug}
            comicTitle={comicDetail?.title || slug}
            chapterSlug={chapter}
            chapterName={chapterName}
            images={images}
            prevChapter={prevChapter}
            nextChapter={nextChapter}
        />
    );
}
