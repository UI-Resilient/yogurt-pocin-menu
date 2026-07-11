"use client";

const CATEGORIES = [
  { key: "All", label: "Semua" },
  { key: "Yogurt", label: "Yogurt" },
  { key: "Ice Cream", label: "Ice Cream" },
  { key: "Topping", label: "Topping" },
];

export default function FilterBar({ active, onChange }) {
  return (
    <div
      role="tablist"
      aria-label="Filter kategori menu"
      className="flex flex-wrap gap-2 sm:gap-3"
    >
      {CATEGORIES.map((cat) => {
        const isActive = active === cat.key;
        return (
          <button
            key={cat.key}
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(cat.key)}
            className={`rounded-full px-4 py-2 text-sm sm:text-base font-semibold transition-all duration-150 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lilac-600 ${
              isActive
                ? "bg-lilac-600 text-white shadow-soft scale-[1.03]"
                : "bg-white/70 text-lilac-700 hover:bg-lilac-100 border border-lilac-200"
            }`}
          >
            {cat.label}
          </button>
        );
      })}
    </div>
  );
}
