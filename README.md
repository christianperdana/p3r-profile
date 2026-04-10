# P3R-Style Web Profile

Web profile bertema *Persona 3 Reload pause menu* yang dibangun dengan **SvelteKit + Tailwind CSS**. Proyek ini mempertahankan gaya visual menu P3R (tipografi, warna, nuansa UI), lalu diadaptasi untuk kebutuhan profil personal dan halaman portofolio.

## Sumber Inspirasi

Proyek ini merupakan adaptasi dari karya asli:

- [deltea/p3r-pause-menu](https://github.com/deltea/p3r-pause-menu)

Terima kasih untuk referensi desain dan rekreasi UI yang sangat keren.

## Fitur Saat Ini

- Halaman utama profil dengan navigasi gaya menu game
- Dukungan keyboard (up/down + enter)
- Dukungan mobile layout
- Halaman `Projects` khusus untuk galeri screenshot
- Background video dengan overlay/blur agar konten tetap fokus

## Menjalankan Project Secara Lokal

```bash
npm install
npm run dev
```

Buka: `http://localhost:5173`

## Struktur Konten yang Perlu Diubah

### 1) Konten Profil Utama

Edit file:

- `src/routes/+page.svelte`

Bagian yang biasa diubah:

- `profileTagline`
- `credit`
- Array `options` (ABOUT, PROJECTS, SKILLS, dll)
  - `description`
  - `detail`
  - `link`

### 2) Konten Halaman Projects

Edit file:

- `src/routes/projects/+page.svelte`

Bagian yang biasa diubah:

- Array `projects`
  - `title`
  - `caption`
  - `file`

### 3) Screenshot Proyek

Simpan gambar ke:

- `static/projects/`

Contoh:

- `static/projects/dashboard-1.png`
- `static/projects/landing-1.png`

Lalu sesuaikan nama file di array `projects`.

### 4) Background Video

Simpan video ke:

- `static/background.webm`

Jika mengganti file video dan browser masih cache lama, ubah nilai:

- `BACKGROUND_VIDEO_CACHE` di `src/routes/+page.svelte`
- `BACKGROUND_VIDEO_CACHE` di `src/routes/projects/+page.svelte`

## Upload ke GitHub (Manual)

Karena repo ini masih lokal (belum ada `.git`), jalankan:

```bash
git init
git add .
git commit -m "feat: customize P3R style web profile"
```

Lalu buat repo baru di GitHub (via web), kemudian:

```bash
git branch -M main
git remote add origin https://github.com/<username>/<repo-name>.git
git push -u origin main
```

## Deploy ke Vercel

Project ini sudah memakai adapter Vercel (`@sveltejs/adapter-vercel`) jadi siap deploy.

### Opsi A (Paling cepat via GitHub)

1. Push project ke GitHub.
2. Masuk ke Vercel dashboard: [https://vercel.com/new](https://vercel.com/new)
3. Import repository.
4. Vercel otomatis deteksi SvelteKit, klik **Deploy**.

### Opsi B (CLI)

```bash
npm i -g vercel
vercel
vercel --prod
```

> Jika belum login, Vercel akan meminta autentikasi terlebih dulu.

## Catatan

- URL live klien tidak ditampilkan, sehingga halaman `Projects` memakai screenshot saja.
- Jika ada warning non-reaktif di `Option.svelte`, itu berasal dari struktur animasi komponen asli dan tidak memblokir build.
