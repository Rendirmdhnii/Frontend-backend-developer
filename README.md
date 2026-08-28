# Todo List Frontend - Tugas 2 PWF

**Nama:** Muhammad Rendy  
**Keterangan:** Tugas 2 Pemrograman Web Frontend (PWF)  
**Teknologi:** Next.js (App Router), React 19, TypeScript, Tailwind CSS

---

## 📌 Deskripsi Proyek

Aplikasi **Todo List Frontend** ini dibuat untuk memenuhi **Tugas 2 PWF**. Aplikasi ini dibangun menggunakan **Next.js App Router**, **React 19**, **TypeScript**, dan **Tailwind CSS**. Aplikasi menyajikan antarmuka modern untuk mengelola tugas harian, memanfaatkan perpaduan React Server Components (RSC) untuk fetching data dan Client Components untuk interaktivitas.

---

## ✨ Fitur Utama

- 📋 **Daftar Tugas (Todo List):** Menampilkan semua daftar tugas beserta deskripsi dan status kelengkapannya.
- ➕ **Tambah Tugas Baru:** Form interaktif untuk menambahkan tugas baru ke dalam daftar.
- 🔍 **Detail Tugas:** Halaman rincian tugas berbasis dynamic route (`/task/[id]`).
- ✅ **Toggle Status:** Mengubah status tugas antara *Selesai* dan *Belum Selesai*.
- 🎨 **Desain Modern & Responsif:** Tampilan yang rapi, bersih, dan responsif menggunakan Tailwind CSS.

---

## 🛠️ Teknologi yang Digunakan

- **Framework:** [Next.js](https://nextjs.org/) (App Router)
- **Library UI:** [React 19](https://react.dev/)
- **Bahasa:** [TypeScript](https://www.typescriptlang.org/)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/)
- **Animasi & Utilitas:** Framer Motion, clsx, tailwind-merge, class-variance-authority

---

## 🚀 Cara Menjalankan Proyek (Cara Pakai)

### 1. Prasyarat
Pastikan komputer Anda sudah terinstal:
- **Node.js** (versi 18.x atau lebih baru)
- **npm** (atau `pnpm` / `yarn` / `bun`)

### 2. Clone Repositori
```bash
git clone https://github.com/Rendirmdhnii/todo-frontend.git
cd todo-frontend
```

### 3. Install Dependensi
Jalankan perintah berikut untuk mengunduh semua dependensi paket:
```bash
npm install
```

### 4. Menjalankan Server Pengembang (Development)
Jalankan server pengembangan:
```bash
npm run dev
```

Buka peramban (browser) dan akses alamat berikut:
👉 **[http://localhost:3000](http://localhost:3000)**

### 5. Build untuk Produksi (Production Build)
Untuk melakukan kompilasi build produksi:
```bash
npm run build
```
Untuk menjalankan server hasil build produksi:
```bash
npm run start
```

---

## 📁 Struktur Folder Proyek

```text
todo-frontend/
├── app/                  # Next.js App Router (Halaman & Route)
│   ├── (auth)/           # Grouping Halaman Auth (Login/Register)
│   ├── components/       # Komponen UI (TodoForm, TodoList, TodoItem, Header, dll)
│   ├── task/             # Dynamic Route Detail Task ([id])
│   ├── globals.css       # Custom & Tailwind Global Style
│   ├── layout.tsx        # Layout Utama Aplikasi
│   └── page.tsx          # Halaman Utama Todo List
├── lib/                  # Data & Helper (todos.ts, utils.ts)
├── types/                # Definisi Type & Interface TypeScript
├── public/               # Asset Statis (Gambar, Icon)
└── package.json          # Konfigurasi Proyek & Dependensi
```

---

## 👨‍💻 Identitas Pembuat

- **Nama:** Muhammad Rendy
- **Tugas:** Tugas 2 PWF (Pemrograman Web Frontend)
- **Repository GitHub:** [https://github.com/Rendirmdhnii/todo-frontend](https://github.com/Rendirmdhnii/todo-frontend)
