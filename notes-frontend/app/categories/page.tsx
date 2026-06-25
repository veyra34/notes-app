"use client";

import React, { useState } from "react";
import { FolderPlus, HelpCircle, AlertTriangle } from "lucide-react";
import { useNotes, Category } from "@/context/NotesContext";
import Sidebar from "@/components/Sidebar";
import Topbar from "@/components/Topbar";
import CategoryCard from "@/components/CategoryCard";
import Modal from "@/components/Modal";
import EmptyState from "@/components/EmptyState";

type ColorPreset = {
  name: string;
  color: string;
  textColor: string;
  bgColor: string;
  accentBorder: string;
  displayClass: string; // for showing color dot in editor
};

const colorPresets: ColorPreset[] = [
  { name: "Blue", color: "bg-blue-500", textColor: "text-blue-700", bgColor: "bg-blue-50", accentBorder: "border-l-blue-500", displayClass: "bg-blue-500" },
  { name: "Green", color: "bg-green-500", textColor: "text-green-700", bgColor: "bg-green-50", accentBorder: "border-l-green-500", displayClass: "bg-green-500" },
  { name: "Amber", color: "bg-amber-400", textColor: "text-amber-700", bgColor: "bg-amber-50", accentBorder: "border-l-amber-400", displayClass: "bg-amber-400" },
  { name: "Red", color: "bg-red-500", textColor: "text-red-700", bgColor: "bg-red-50", accentBorder: "border-l-red-500", displayClass: "bg-red-500" },
  { name: "Purple", color: "bg-purple-500", textColor: "text-purple-700", bgColor: "bg-purple-50", accentBorder: "border-l-purple-500", displayClass: "bg-purple-500" },
  { name: "Pink", color: "bg-pink-500", textColor: "text-pink-700", bgColor: "bg-pink-50", accentBorder: "border-l-pink-500", displayClass: "bg-pink-500" },
  { name: "Slate", color: "bg-slate-400", textColor: "text-slate-700", bgColor: "bg-slate-50", accentBorder: "border-l-slate-400", displayClass: "bg-slate-400" },
];

export default function CategoriesPage() {
  const { categories, notes, addCategory, updateCategory, deleteCategory } = useNotes();

  // Modals state
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  // Form states
  const [categoryName, setCategoryName] = useState("");
  const [selectedColor, setSelectedColor] = useState<ColorPreset>(colorPresets[0]);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [deletingCategoryName, setDeletingCategoryName] = useState<string | null>(null);

  // Handles adding category
  const handleCreateCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryName.trim()) return;

    // Check if category already exists
    if (categories.some((c) => c.name.toLowerCase() === categoryName.trim().toLowerCase())) {
      alert("A category with this name already exists.");
      return;
    }

    addCategory({
      name: categoryName.trim(),
      color: selectedColor.color,
      textColor: selectedColor.textColor,
      bgColor: selectedColor.bgColor,
      accentBorder: selectedColor.accentBorder,
    });

    // Reset state
    setCategoryName("");
    setSelectedColor(colorPresets[0]);
    setIsCreateOpen(false);
  };

  // Pre-fills edit modal
  const openEditModal = (cat: Category) => {
    setEditingCategory(cat);
    setCategoryName(cat.name);
    const matchedColor = colorPresets.find((c) => c.color === cat.color) || colorPresets[0];
    setSelectedColor(matchedColor);
    setIsEditOpen(true);
  };

  // Handles updating category
  const handleUpdateCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCategory || !categoryName.trim()) return;

    // Check if category already exists (excluding the one being edited)
    if (
      categoryName.trim().toLowerCase() !== editingCategory.name.toLowerCase() &&
      categories.some((c) => c.name.toLowerCase() === categoryName.trim().toLowerCase())
    ) {
      alert("A category with this name already exists.");
      return;
    }

    updateCategory(editingCategory.name, {
      name: categoryName.trim(),
      color: selectedColor.color,
      textColor: selectedColor.textColor,
      bgColor: selectedColor.bgColor,
      accentBorder: selectedColor.accentBorder,
    });

    setEditingCategory(null);
    setCategoryName("");
    setIsEditOpen(false);
  };

  // Pre-fills delete modal
  const openDeleteModal = (name: string) => {
    setDeletingCategoryName(name);
    setIsDeleteOpen(true);
  };

  // Handles deletion
  const handleDeleteConfirm = () => {
    if (deletingCategoryName) {
      deleteCategory(deletingCategoryName);
      setDeletingCategoryName(null);
      setIsDeleteOpen(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-slate-950 text-gray-900 dark:text-slate-100 transition-colors">
      <Sidebar />

      <div className="flex-1 min-w-0 overflow-y-auto h-screen">
        <Topbar />

        <main className="px-6 md:px-8 py-8 max-w-7xl mx-auto">
          {/* Page header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Categories</h1>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                Organize your notes into folders, color codes, and custom classifications
              </p>
            </div>
            
            <button
              onClick={() => {
                setCategoryName("");
                setSelectedColor(colorPresets[0]);
                setIsCreateOpen(true);
              }}
              className="flex items-center justify-center gap-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-sm font-semibold px-4 py-2.5 rounded-xl hover:bg-slate-850 dark:hover:bg-slate-100 transition-all shadow-sm active:scale-95 text-center"
            >
              <FolderPlus className="w-4 h-4" />
              New Category
            </button>
          </div>

          {/* Categories Grid */}
          {categories.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {categories.map((cat) => {
                const count = notes.filter((n) => n.tag === cat.name && !n.deleted).length;
                return (
                  <CategoryCard
                    key={cat.name}
                    category={cat}
                    noteCount={count}
                    onEdit={() => openEditModal(cat)}
                    onDelete={() => openDeleteModal(cat.name)}
                  />
                );
              })}
            </div>
          ) : (
            <EmptyState
              icon={HelpCircle}
              title="No categories found"
              description="Create a category to group your work, study, and daily thoughts together under a specific style."
              actionText="Create Category"
              onActionClick={() => setIsCreateOpen(true)}
            />
          )}

          {/* --- CREATE CATEGORY MODAL --- */}
          <Modal
            isOpen={isCreateOpen}
            onClose={() => setIsCreateOpen(false)}
            title="Create Category"
          >
            <form onSubmit={handleCreateCategory} className="flex flex-col gap-5">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                  Category Name
                </label>
                <input
                  type="text"
                  value={categoryName}
                  onChange={(e) => setCategoryName(e.target.value)}
                  placeholder="e.g. Finance, Fitness, Recipes..."
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-850 px-3.5 py-2.5 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900/10 dark:focus:ring-white/10"
                  required
                  maxLength={20}
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                  Select Accent Color
                </label>
                <div className="flex flex-wrap gap-2 pt-1">
                  {colorPresets.map((preset) => (
                    <button
                      key={preset.name}
                      type="button"
                      onClick={() => setSelectedColor(preset)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all ${
                        selectedColor.name === preset.name
                          ? "bg-slate-900 text-white border-slate-900 dark:bg-white dark:text-slate-900 dark:border-white"
                          : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-655 hover:bg-slate-50 dark:hover:bg-slate-750"
                      }`}
                    >
                      <span className={`w-2.5 h-2.5 rounded-full ${preset.displayClass}`} />
                      {preset.name}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-700">
                <button
                  type="button"
                  onClick={() => setIsCreateOpen(false)}
                  className="border border-slate-200 dark:border-slate-700 text-slate-655 dark:text-slate-350 text-xs font-semibold px-4 py-2.5 rounded-xl hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-semibold px-4 py-2.5 rounded-xl hover:bg-slate-850 active:scale-95 transition-all shadow-sm"
                >
                  Create
                </button>
              </div>
            </form>
          </Modal>

          {/* --- EDIT CATEGORY MODAL --- */}
          <Modal
            isOpen={isEditOpen}
            onClose={() => setIsEditOpen(false)}
            title="Edit Category"
          >
            <form onSubmit={handleUpdateCategory} className="flex flex-col gap-5">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                  Category Name
                </label>
                <input
                  type="text"
                  value={categoryName}
                  onChange={(e) => setCategoryName(e.target.value)}
                  placeholder="e.g. Finance, Fitness, Recipes..."
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-850 px-3.5 py-2.5 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900/10 dark:focus:ring-white/10"
                  required
                  maxLength={20}
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                  Select Accent Color
                </label>
                <div className="flex flex-wrap gap-2 pt-1">
                  {colorPresets.map((preset) => (
                    <button
                      key={preset.name}
                      type="button"
                      onClick={() => setSelectedColor(preset)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all ${
                        selectedColor.name === preset.name
                          ? "bg-slate-900 text-white border-slate-900 dark:bg-white dark:text-slate-900 dark:border-white"
                          : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-655 hover:bg-slate-50 dark:hover:bg-slate-750"
                      }`}
                    >
                      <span className={`w-2.5 h-2.5 rounded-full ${preset.displayClass}`} />
                      {preset.name}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-700">
                <button
                  type="button"
                  onClick={() => setIsEditOpen(false)}
                  className="border border-slate-200 dark:border-slate-700 text-slate-655 dark:text-slate-350 text-xs font-semibold px-4 py-2.5 rounded-xl hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-semibold px-4 py-2.5 rounded-xl hover:bg-slate-850 active:scale-95 transition-all shadow-sm"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </Modal>

          {/* --- DELETE CONFIRMATION MODAL --- */}
          <Modal
            isOpen={isDeleteOpen}
            onClose={() => setIsDeleteOpen(false)}
            title="Delete Category"
          >
            <div className="flex flex-col gap-4">
              <div className="flex items-start gap-3 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/50 p-4 rounded-2xl">
                <AlertTriangle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white leading-tight">
                    Are you absolutely sure?
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-450 mt-1 leading-relaxed">
                    Deleting the category <strong className="text-slate-855 dark:text-slate-200 font-bold">&quot;{deletingCategoryName}&quot;</strong> will not delete its notes. Instead, all notes in this category will be automatically reclassified as <strong className="text-slate-855 dark:text-slate-200 font-bold">&quot;Personal&quot;</strong>.
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-700">
                <button
                  type="button"
                  onClick={() => setIsDeleteOpen(false)}
                  className="border border-slate-200 dark:border-slate-700 text-slate-655 dark:text-slate-350 text-xs font-semibold px-4 py-2.5 rounded-xl hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleDeleteConfirm}
                  className="bg-red-550 hover:bg-red-600 text-white text-xs font-semibold px-4 py-2.5 rounded-xl active:scale-95 transition-all shadow-sm"
                >
                  Yes, Delete Category
                </button>
              </div>
            </div>
          </Modal>
        </main>
      </div>
    </div>
  );
}