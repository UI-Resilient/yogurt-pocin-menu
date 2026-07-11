-- Jalankan script ini di Supabase Dashboard > SQL Editor

-- 1. Tabel menu
create table if not exists public.menus (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  price integer not null default 0,
  category text not null check (category in ('Yogurt', 'Ice Cream', 'Topping')),
  status text not null default 'Available' check (status in ('Available', 'Not Available')),
  image_url text,
  created_at timestamptz not null default now()
);

-- 2. Aktifkan Row Level Security
alter table public.menus enable row level security;

-- 3. Semua orang (customer) boleh membaca daftar menu
create policy "Public can view menus"
  on public.menus for select
  using (true);

-- 4. Hanya admin yang sudah login (authenticated) yang boleh menambah,
--    mengubah, atau menghapus menu
create policy "Authenticated users can insert menus"
  on public.menus for insert
  to authenticated
  with check (true);

create policy "Authenticated users can update menus"
  on public.menus for update
  to authenticated
  using (true)
  with check (true);

create policy "Authenticated users can delete menus"
  on public.menus for delete
  to authenticated
  using (true);

-- 5. Aktifkan Realtime supaya perubahan admin langsung tampil
--    di halaman customer tanpa refresh
alter publication supabase_realtime add table public.menus;

-- 6. Bucket untuk foto menu (dibuat lewat SQL, atau lewat UI Storage juga bisa)
insert into storage.buckets (id, name, public)
values ('menu-images', 'menu-images', true)
on conflict (id) do nothing;

-- 7. Storage policy: semua orang boleh melihat foto,
--    hanya admin yang login yang boleh upload/ubah/hapus foto
create policy "Public can view menu images"
  on storage.objects for select
  using (bucket_id = 'menu-images');

create policy "Authenticated users can upload menu images"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'menu-images');

create policy "Authenticated users can update menu images"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'menu-images');

create policy "Authenticated users can delete menu images"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'menu-images');
