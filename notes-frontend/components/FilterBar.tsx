"use client";

import { Grid, List } from "lucide-react";
import { Category } from "@/context/NotesContext";

type FilterBarProps = {
  categories: Category[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  sortBy: string;
  onSortChange: (sortBy: string) => void;
  viewMode: "grid" | "list";
  onViewModeChange: (mode: "grid" | "list") => void;
};

export default function FilterBar({
  categories,
  selectedCategory,
  onCategoryChange,
  sortBy,
  onSortChange,
  viewMode,
  onViewModeChange,
}: FilterBarProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-100 dark:border-slate-800">
      {/* Category Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
        <button
          onClick={() => onCategoryChange("All")}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
            selectedCategory === "All"
              ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900"
              : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700"
          }`}
        >
          All Categories
        </button>
        {categories.map((cat) => (
          <button
            key={cat.name}
            onClick={() => onCategoryChange(cat.name)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              selectedCategory === cat.name
                ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900"
                : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700"
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${cat.color}`} />
            {cat.name}
          </button>
        ))}
      </div>

      {/* Sorting & View Toggle */}
      <div className="flex items-center gap-3 self-end md:self-auto">
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-slate-400 dark:text-slate-500 hidden sm:inline">Sort:</span>
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
            className="border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium px-3 py-2 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-900/10 dark:focus:ring-white/10"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="title-asc">A - Z</option>
            <option value="title-desc">Z - A</option>
          </select>
        </div>

        {/* Grid/List View Selector */}
        <div className="border border-slate-200 dark:border-slate-700 rounded-xl p-0.5 flex bg-white dark:bg-slate-800">
          <button
            onClick={() => onViewModeChange("grid")}
            className={`p-1.5 rounded-lg transition-colors ${
              viewMode === "grid"
                ? "bg-slate-100 dark:bg-slate-750 text-slate-800 dark:text-white"
                : "text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300"
            }`}
            aria-label="Grid layout"
          >
            <Grid className="w-4 h-4" />
          </button>
          <button
            onClick={() => onViewModeChange("list")}
            className={`p-1.5 rounded-lg transition-colors ${
              viewMode === "list"
                ? "bg-slate-100 dark:bg-slate-750 text-slate-800 dark:text-white"
                : "text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300"
            }`}
            aria-label="List layout"
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
