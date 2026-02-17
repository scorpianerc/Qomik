import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { Navbar } from "@/components/navbar";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "Qomik - Baca Komik Online Gratis",
    description:
        "Baca komik manga, manhwa, dan manhua online gratis dalam Bahasa Indonesia. Update terbaru setiap hari.",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="id" suppressHydrationWarning>
            <body className={inter.className}>
                <ThemeProvider
                    attribute="class"
                    defaultTheme="system"
                    enableSystem
                    disableTransitionOnChange
                >
                    <div className="relative min-h-screen flex flex-col">
                        <Navbar />
                        <main className="flex-1">{children}</main>
                        <footer className="border-t py-6">
                            <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
                                <p>
                                    Qomik &mdash; Baca komik online gratis.
                                </p>
                            </div>
                        </footer>
                    </div>
                </ThemeProvider>
            </body>
        </html>
    );
}
