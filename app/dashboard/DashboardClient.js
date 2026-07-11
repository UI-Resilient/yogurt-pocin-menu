"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

const CATEGORIES = ["Yogurt", "Ice Cream", "Topping"];
const EMPTY_FORM = {
  id: null,
  name: "",
  price: "",
  category: "Yogurt",
  available: "Available",
  image_url: "",
};

function formatRupiah(value) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value || 0);
}

export default function DashboardClient({ userEmail }) {
  const supabase = useMemo(() => createClient(), []);
  const router = useRouter();

  const [menus, setMenus] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [imageFile, setImageFile] = useState(null);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  async function loadMenus() {
    setLoading(true);
    const { data, error } = await supabase
      .from("menus")
      .select("*")
      .order("created_at", { ascending: true });
    if (!error) setMenus(data || []);
    setLoading(false);
  }

  useEffect(() => {
    loadMenus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function openAddModal() {
    setForm(EMPTY_FORM);
    setImageFile(null);
    setFormError(null);
    setModalOpen(true);
  }

  function openEditModal(menu) {
    setForm({
      id: menu.id,
      name: menu.name,
      price: menu.price,
      category: menu.category,
      available: menu.available,
      image_url: menu.image_url || "",
    });
    setImageFile(null);
    setFormError(null);
    setModalOpen(true);
  }

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);
    setFormError(null);

    try {
      let imageUrl = form.image_url;

      if (imageFile) {
        const fileExt = imageFile.name.split(".").pop();
        const filePath = `${crypto.randomUUID()}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from("menu-images")
          .upload(filePath, imageFile, { upsert: false });

        if (uploadError) throw uploadError;

        const {
          data: { publicUrl },
        } = supabase.storage.from("menu-images").getPublicUrl(filePath);

        imageUrl = publicUrl;
      }

      const payload = {
        name: form.name.trim(),
        price: Number(form.price) || 0,
        category: form.category,
        available: form.available,
        image_url: imageUrl,
      };

      if (form.id) {
        const { error } = await supabase
          .from("menus")
          .update(payload)
          .eq("id", form.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("menus").insert(payload);
        if (error) throw error;
      }

      setModalOpen(false);
      await loadMenus();
    } catch (err) {
      setFormError(err.message || "Gagal menyimpan menu.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id) {
    if (!confirm("Hapus menu ini? Tindakan ini tidak bisa dibatalkan.")) return;
    setDeletingId(id);
    const { error } = await supabase.from("menus").delete().eq("id", id);
    setDeletingId(null);
    if (!error) {
      setMenus((prev) => prev.filter((m) => m.id !== id));
    }
  }

  async function handleToggleStatus(menu) {
    const newStatus =
      menu.available === "Available" ? "Not Available" : "Available";
    setMenus((prev) =>
      prev.map((m) => (m.id === menu.id ? { ...m, available: newStatus } : m))
    );
    await supabase
      .from("menus")
      .update({ available: newStatus })
      .eq("id", menu.id);
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-10">
      <header className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="font-display italic text-lilac-500 text-sm">
            Dashboard
          </p>
          <h1 className="font-display text-3xl sm:text-4xl font-semibold text-ink">
            Kelola Menu Yogurt Pocin
          </h1>
          <p className="mt-1 text-sm text-lilac-700/70">
            Masuk sebagai {userEmail}
          </p>
        </div>
        <button
          onClick={handleLogout}
          className="rounded-full border border-lilac-300 bg-white px-4 py-2 text-sm font-semibold text-lilac-700 hover:bg-lilac-50"
        >
          Keluar
        </button>
      </header>

      <button
        onClick={openAddModal}
        className="mb-6 rounded-full bg-lilac-600 px-5 py-2.5 font-semibold text-white shadow-soft hover:bg-lilac-700"
      >
        + Tambah Menu
      </button>

      {loading ? (
        <p className="text-lilac-500">Memuat menu…</p>
      ) : menus.length === 0 ? (
        <p className="text-lilac-500">
          Belum ada menu. Klik &ldquo;Tambah Menu&rdquo; untuk mulai.
        </p>
      ) : (
        <div className="space-y-3">
          {menus.map((menu) => (
            <div
              key={menu.id}
              className="flex flex-wrap items-center gap-4 rounded-2xl border border-lilac-200 bg-white/80 p-4 shadow-soft sm:flex-nowrap"
            >
              <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-xl bg-lilac-50">
                {menu.image_url ? (
                  <img
                    src={menu.image_url}
                    alt={menu.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-xs text-lilac-300">
                    no photo
                  </div>
                )}
              </div>

              <div className="min-w-[160px] flex-1">
                <p className="font-display font-semibold text-ink">
                  {menu.name}
                </p>
                <p className="text-sm text-lilac-700/70">
                  {menu.category} · {formatRupiah(menu.price)}
                </p>
              </div>

              <button
                onClick={() => handleToggleStatus(menu)}
                className={`rounded-full px-3 py-1.5 text-sm font-semibold ${
                  menu.available === "Available"
                    ? "bg-emerald-100 text-emerald-700"
                    : "bg-red-100 text-red-600"
                }`}
                title="Klik untuk mengubah status"
              >
                {menu.available === "Available" ? "🟢 Available" : "🔴 Not Available"}
              </button>

              <div className="flex gap-2">
                <button
                  onClick={() => openEditModal(menu)}
                  className="rounded-full border border-lilac-300 px-3 py-1.5 text-sm font-semibold text-lilac-700 hover:bg-lilac-50"
                >
                  Ubah
                </button>
                <button
                  onClick={() => handleDelete(menu.id)}
                  disabled={deletingId === menu.id}
                  className="rounded-full border border-red-200 px-3 py-1.5 text-sm font-semibold text-red-600 hover:bg-red-50 disabled:opacity-50"
                >
                  {deletingId === menu.id ? "Menghapus…" : "Hapus"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 z-20 flex items-center justify-center bg-ink/30 px-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-soft">
            <h2 className="font-display text-2xl font-semibold text-ink">
              {form.id ? "Ubah Menu" : "Tambah Menu"}
            </h2>
            <div className="swirl-divider mt-2 mb-4 w-20 rounded-full" />

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-semibold text-lilac-700">
                  Nama Menu
                </label>
                <input
                  required
                  value={form.name}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, name: e.target.value }))
                  }
                  className="w-full rounded-xl border border-lilac-200 px-4 py-2 outline-none focus:border-lilac-500 focus:ring-2 focus:ring-lilac-200"
                  placeholder="Yogurt Strawberry"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-semibold text-lilac-700">
                  Harga (Rp)
                </label>
                <input
                  required
                  type="number"
                  min="0"
                  value={form.price}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, price: e.target.value }))
                  }
                  className="w-full rounded-xl border border-lilac-200 px-4 py-2 outline-none focus:border-lilac-500 focus:ring-2 focus:ring-lilac-200"
                  placeholder="15000"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-semibold text-lilac-700">
                  Kategori
                </label>
                <select
                  value={form.category}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, category: e.target.value }))
                  }
                  className="w-full rounded-xl border border-lilac-200 px-4 py-2 outline-none focus:border-lilac-500 focus:ring-2 focus:ring-lilac-200"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-1 block text-sm font-semibold text-lilac-700">
                  Status
                </label>
                <select
                  value={form.available}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, avaiable: e.target.value }))
                  }
                  className="w-full rounded-xl border border-lilac-200 px-4 py-2 outline-none focus:border-lilac-500 focus:ring-2 focus:ring-lilac-200"
                >
                  <option value="Available">Available</option>
                  <option value="Not Available">Not Available</option>
                </select>
              </div>

              <div>
                <label className="mb-1 block text-sm font-semibold text-lilac-700">
                  Foto Menu
                </label>
                {form.image_url && !imageFile && (
                  <img
                    src={form.image_url}
                    alt="preview"
                    className="mb-2 h-24 w-24 rounded-xl object-cover"
                  />
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                  className="w-full text-sm text-lilac-700 file:mr-3 file:rounded-full file:border-0 file:bg-lilac-100 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-lilac-700 hover:file:bg-lilac-200"
                />
              </div>

              {formError && (
                <p className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-600">
                  {formError}
                </p>
              )}

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="flex-1 rounded-full border border-lilac-300 px-4 py-2 font-semibold text-lilac-700 hover:bg-lilac-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 rounded-full bg-lilac-600 px-4 py-2 font-semibold text-white hover:bg-lilac-700 disabled:opacity-60"
                >
                  {saving ? "Menyimpan…" : "Simpan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
