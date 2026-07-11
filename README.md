# Yogurt Pocin — Digital Menu

Website digital menu untuk Yogurt Pocin, dibangun pakai **Next.js** + **Supabase** (database, auth, storage foto), siap deploy ke **Vercel**.

- `/` → halaman menu untuk customer (publik, tanpa login)
- `/login` → halaman login admin
- `/dashboard` → halaman kelola menu (khusus admin, wajib login)

Perubahan yang admin simpan di dashboard langsung tersimpan ke database Supabase dan otomatis muncul di halaman `/` — **tanpa perlu ubah kode atau deploy ulang**.

---

## 0. Yang kamu butuhkan

- Akun [Supabase](https://supabase.com) (gratis)
- Akun [Vercel](https://vercel.com) (gratis)
- Akun GitHub (buat push kode ini)
- Node.js sudah terpasang di komputer (buat coba `npm run dev` sebelum deploy, opsional)

---

## 1. Setup Supabase

1. Buat project baru di [supabase.com](https://supabase.com/dashboard) → catat **Project URL** dan **anon public key** (Settings → API).
2. Buka **SQL Editor** di dashboard Supabase → buka file `supabase-schema.sql` di project ini → copy semua isinya → paste ke SQL Editor → klik **Run**.
   - Ini otomatis membuat tabel `menus`, mengaktifkan Row Level Security (customer cuma bisa baca, admin yang login bisa tambah/ubah/hapus), mengaktifkan Realtime, dan membuat storage bucket `menu-images` untuk foto menu.
3. Buat akun admin: buka **Authentication → Users → Add user** → isi email & password admin (misalnya `admin@yogurtpocin.com`). Centang "Auto Confirm User" supaya langsung bisa dipakai login tanpa verifikasi email.
   - Akun ini yang dipakai buat login di halaman `/login`.

---

## 2. Coba jalan di lokal (opsional, tapi disarankan sebelum deploy)

```bash
npm install
cp .env.local.example .env.local
```

Isi `.env.local` dengan URL dan anon key dari Supabase project kamu:

```
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=isi-anon-key-kamu
```

Lalu jalankan:

```bash
npm run dev
```

Buka `http://localhost:3000` buat lihat halaman menu, dan `http://localhost:3000/login` buat login admin.

---

## 3. Push ke GitHub

```bash
git init
git add .
git commit -m "Yogurt Pocin digital menu"
```

Buat repo baru di GitHub (bisa private), lalu:

```bash
git remote add origin https://github.com/USERNAME/NAMA-REPO.git
git branch -M main
git push -u origin main
```

---

## 4. Deploy ke Vercel

1. Login ke [vercel.com](https://vercel.com) pakai akun GitHub kamu.
2. Klik **Add New → Project** → pilih repo yang baru saja kamu push.
3. Vercel otomatis mendeteksi ini project Next.js — biarkan setting default.
4. Sebelum klik Deploy, buka bagian **Environment Variables** dan tambahkan:
   - `NEXT_PUBLIC_SUPABASE_URL` = URL Supabase project kamu
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = anon key Supabase project kamu
5. Klik **Deploy**. Tunggu sampai selesai (biasanya 1–2 menit).
6. Selesai! Website kamu bisa diakses di URL `nama-project.vercel.app`.

Setiap kali kamu `git push` perubahan kode, Vercel otomatis build & deploy ulang. Tapi untuk perubahan **data menu** (nama, harga, foto, status), admin cukup pakai halaman `/dashboard` — tidak perlu push kode sama sekali.

---

## 5. Cara pakai sehari-hari

**Customer:**
1. Buka website.
2. Pilih kategori (Yogurt / Ice Cream / Topping) kalau mau, atau langsung lihat semua menu.
3. Lihat foto, harga, dan status tiap menu.

**Admin (pegawai):**
1. Buka `/login`, masuk pakai email & password admin.
2. Di dashboard: klik **+ Tambah Menu** buat menu baru, atau **Ubah** buat edit menu yang ada.
3. Klik badge status (🟢/🔴) buat cepat mengubah ketersediaan tanpa buka form.
4. Klik **Hapus** buat menghapus menu yang sudah tidak dipakai.
5. Semua perubahan otomatis tampil di halaman customer dalam hitungan detik (pakai Supabase Realtime).

---

## Struktur project

```
app/
  page.js                 → halaman menu customer
  login/page.js           → halaman login admin
  dashboard/page.js       → cek sesi admin (server component)
  dashboard/DashboardClient.js → UI & logic CRUD menu (client component)
  layout.js, globals.css  → layout & tema global
components/
  FilterBar.js            → filter kategori (pill buttons)
  MenuCard.js             → kartu menu (available / not available)
lib/supabase/
  client.js               → koneksi Supabase dari browser
  server.js                → koneksi Supabase dari server component
middleware.js             → lindungi /dashboard, redirect ke /login kalau belum masuk
supabase-schema.sql        → schema tabel, RLS policy, storage bucket
```

## Tema warna

- Pastel purple: `#8452b3` (lilac-600), dipakai untuk tombol, aksen, teks judul
- Pastel yellow: `#fbd94f` (cream-400), dipakai untuk aksen kecil (swirl divider)
- Background lembut kombinasi keduanya dengan gradasi halus

## Kalau mau tambah/ubah kategori

Kategori sengaja dibatasi ke 3 sesuai brief (Yogurt, Ice Cream, Topping) supaya konsisten dengan filter di halaman customer. Kalau nanti mau nambah kategori baru, perlu ubah 3 tempat:
1. `supabase-schema.sql` — constraint `check (category in (...))` di tabel `menus` (perlu `alter table` di Supabase SQL Editor untuk yang sudah jalan)
2. `components/FilterBar.js` — array `CATEGORIES`
3. `app/dashboard/DashboardClient.js` — array `CATEGORIES`
