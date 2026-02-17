"use client";

import { useState, useEffect, useRef } from "react";

export function useDetailImages(slugs: string[]) {
    const [imageMap, setImageMap] = useState<Record<string, string>>({});
    const fetchedRef = useRef<Set<string>>(new Set());

    useEffect(() => {
        // Filter out slugs we've already fetched
        const newSlugs = slugs.filter((s) => s && !fetchedRef.current.has(s));
        if (newSlugs.length === 0) return;

        // Mark as fetching
        newSlugs.forEach((s) => fetchedRef.current.add(s));

        const controller = new AbortController();

        async function fetchImages() {
            try {
                const res = await fetch("/api/comic-images", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ slugs: newSlugs }),
                    signal: controller.signal,
                });

                if (!res.ok) return;
                const data = await res.json();

                if (data.images) {
                    setImageMap((prev) => ({ ...prev, ...data.images }));
                }
            } catch {
                // Remove failed slugs so they can be retried
                newSlugs.forEach((s) => fetchedRef.current.delete(s));
            }
        }

        fetchImages();

        return () => controller.abort();
    }, [slugs]);

    return imageMap;
}
