# Qomik

**Qomik** adalah platform baca komik *open-source* modern yang dibangun menggunakan **Next.js 15** dan **React 19**. Qomik menyediakan pengalaman membaca manga, manhwa, dan manhua yang cepat, ad-free, dan responsif dengan antarmuka yang elegan.

Fitur unggulan Qomik meliputi *infinite scroll*, *live search*, dan manajemen genre yang intuitif, semuanya dioptimalkan untuk performa maksimal di desktop maupun mobile.

![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js)
![React](https://img.shields.io/badge/React-19-61dafb?logo=react)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06b6d4?logo=tailwindcss)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6?logo=typescript)

## ✨ Fitur

- 🏠 **Beranda** — Tampilan trending, terbaru, dan populer
- 🔍 **Live Search** — Cari komik secara real-time dengan debounce
- 📖 **Baca Komik** — Chapter reader dengan navigasi yang mudah
- 🏷️ **Filter Genre** — Multi-genre selection dengan filter status
- ❤️ **Favorit** — Simpan komik favorit di browser (localStorage)
- 📑 **Progress Baca** — Otomatis menyimpan chapter terakhir yang dibaca
- 🌙 **Dark / Light Mode** — Tema gelap & terang
- 📱 **Responsive** — Optimal di desktop & mobile
- 🖼️ **HD Covers** — Gambar cover portrait berkualitas tinggi dari detail API

## 🛠️ Tech Stack

| Teknologi | Versi |
|---|---|
| [Next.js](https://nextjs.org) | 15 (App Router + Turbopack) |
| [React](https://react.dev) | 19 |
| [Tailwind CSS](https://tailwindcss.com) | 4 |
| [TypeScript](https://typescriptlang.org) | 5 |
| [Radix UI](https://radix-ui.com) | Primitives (Dialog, ScrollArea, etc.) |
| [Lucide React](https://lucide.dev) | Icons |
| [next-themes](https://github.com/pacocoursey/next-themes) | Dark/Light mode |

## 📁 Struktur Proyek

```
src/
├── app/
│   ├── api/                  # API route proxies
│   │   ├── comic-images/     # Batch fetch cover images
│   │   ├── genre/[slug]/     # Genre comics
│   │   ├── list/             # KomikStation list
│   │   └── search/           # Search proxy
│   ├── comic/[slug]/         # Detail & chapter reader
│   ├── favorites/            # Halaman favorit
│   ├── genre/                # Daftar & detail genre
│   ├── populer/              # Komik populer
│   ├── search/               # Hasil pencarian
│   └── terbaru/              # Komik terbaru
├── components/               # Reusable UI components
├── hooks/                    # Custom React hooks
└── lib/                      # API client, types, utilities
```

## 🚀 Menjalankan Proyek

### Prerequisites

- [Node.js](https://nodejs.org) (v18+)
- npm

### Setup

```bash
# Clone repository
git clone <repo-url>
cd Qomik

# Install dependencies
npm install

# Buat file environment
cp .env.local.example .env.local
```

### Environment Variables

Buat file `.env.local` di root proyek:

```env
API_BASE_URL=https://www.sankavollerei.com/comic
```

### Development

```bash
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000) di browser.

### Production Build

```bash
npm run build
npm start
```

## 🙏 Kredit & Terima Kasih

### Penyedia API

Proyek ini menggunakan data komik dari **[Sanka Vollerei API](https://www.sankavollerei.com)**.

> **Disclaimer:** Qomik adalah proyek open-source untuk tujuan edukasi. Semua data komik dan gambar adalah milik pemilik aslinya. Proyek ini tidak mempunyai afiliasi dengan penyedia konten manapun.

### Open Source Libraries

- [Next.js](https://nextjs.org) oleh Vercel
- [Tailwind CSS](https://tailwindcss.com) oleh Tailwind Labs
- [Radix UI](https://radix-ui.com) oleh WorkOS
- [Lucide Icons](https://lucide.dev)
- [shadcn/ui](https://ui.shadcn.com) — komponen UI

## 📄 Lisensi

Proyek ini dibuat untuk tujuan pembelajaran.
