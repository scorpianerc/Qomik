import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
    return (
        <div className="container mx-auto px-4 flex flex-col items-center justify-center min-h-[60vh] text-center">
            <h1 className="text-6xl font-bold">404</h1>
            <p className="mt-2 text-lg text-muted-foreground">
                Halaman tidak ditemukan
            </p>
            <Link href="/" className="mt-6">
                <Button>Kembali ke Beranda</Button>
            </Link>
        </div>
    );
}
