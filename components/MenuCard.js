"use client";

function formatRupiah(value) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value || 0);
}

export default function MenuCard({ menu }) {
  const isAvailable = menu.status === "Available";

  return (
    <div
      className={`relative overflow-hidden rounded-3xl border bg-white/80 backdrop-blur-sm shadow-soft transition-all duration-200 ${
        isAvailable
          ? "border-lilac-200"
          : "border-lilac-100 opacity-60"
      }`}
    >
      <div className="relative aspect-square w-full overflow-hidden bg-lilac-50">
        {menu.image_url ? (
          // Using a plain img so this works even before an image domain is
          // configured for next/image, and for freshly-uploaded Supabase URLs.
          <img
            src={menu.image_url}
            alt={menu.name}
            className={`h-full w-full object-cover transition-all duration-200 ${
              isAvailable ? "" : "grayscale"
            }`}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-lilac-300">
            <span className="font-display text-sm italic">no photo</span>
          </div>
        )}

        {!isAvailable && (
          <span className="absolute left-2 top-2 rounded-full bg-red-500 px-3 py-1 text-xs font-bold text-white shadow-md">
            Not Available
          </span>
        )}
      </div>

      <div className="p-4">
        <h3 className="font-display text-lg font-semibold leading-snug text-ink">
          {menu.name}
        </h3>
        <div className="mt-1 flex items-center justify-between">
          <span className="text-lilac-700 font-bold">
            {formatRupiah(menu.price)}
          </span>
          <span
            className={`flex items-center gap-1 text-sm font-medium ${
              isAvailable ? "text-emerald-600" : "text-red-500"
            }`}
          >
            {isAvailable ? "🟢" : "🔴"}
            {isAvailable ? "Available" : "Not Available"}
          </span>
        </div>
      </div>
    </div>
  );
}
