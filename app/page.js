"use client";

import { useEffect, useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import FilterBar from "@/components/FilterBar";
import MenuCard from "@/components/MenuCard";

export default function HomePage() {
  const supabase = useMemo(() => createClient(), []);
  const [menus, setMenus] = useState([]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    async function loadMenus() {
      const { data, error } = await supabase
        .from("menus")
        .select("*")
        .order("created_at", { ascending: true });

      if (!isMounted) return;

      if (error) {
        setError(error.message);
      } else {
        setMenus(data || []);
      }
      setLoading(false);
    }

    loadMenus();

    // Auto-refresh when admin adds/edits/deletes/toggles status — no page
    // reload and no code changes needed on the customer side.
    const channel = supabase
      .channel("menus-public-feed")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "menus" },
        () => loadMenus()
      )
      .subscribe();

    return () => {
      isMounted = false;
      supabase.removeChannel(channel);
    };
  }, [supabase]);

  const filteredMenus =
    activeCategory === "All"
      ? menus
      : menus.filter((m) => m.category === activeCategory);

  return (
    <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
      <header className="mb-6 sm:mb-8">
        <p className="font-display italic text-lilac-500 text-sm sm:text-base">
          Selamat datang di
        </p>
        <h1 className="font-display text-4xl sm:text-5xl font-semibold text-ink">
          Yogurt Pocin
        </h1>
        <div className="swirl-divider mt-3 mb-4 w-40 rounded-full" />
        <p className="max-w-xl text-sm sm:text-base text-lilac-700/80">
          Cek menu dan ketersediaannya sebelum kamu datang atau memesan.
        </p>
      </header>

      <div className="sticky top-0 z-10 -mx-4 mb-6 bg-[#faf6ff]/80 px-4 py-3 backdrop-blur-md sm:static sm:mx-0 sm:bg-transparent sm:px-0 sm:py-0 sm:backdrop-blur-none">
        <FilterBar active={activeCategory} onChange={setActiveCategory} />
      </div>

      {loading && (
        <p className="py-16 text-center text-lilac-500">Memuat menu…</p>
      )}

      {error && (
        <p className="py-16 text-center text-red-500">
          Gagal memuat menu: {error}
        </p>
      )}

      {!loading && !error && filteredMenus.length === 0 && (
        <p className="py-16 text-center text-lilac-500">
          Belum ada menu di kategori ini.
        </p>
      )}

      {!loading && !error && filteredMenus.length > 0 && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4">
          {filteredMenus.map((menu) => (
            <MenuCard key={menu.id} menu={menu} />
          ))}
        </div>
      )}
    </main>
  );
}
