"use client";

import { Edit3, Trash2, Folder } from "lucide-react";
import { Category } from "@/context/NotesContext";

type CategoryCardProps = {
  category: Category;
  noteCount: number;
  onEdit: () => void;
  onDelete: () => void;
};

export default function CategoryCard({
  category,
  noteCount,
  onEdit,
  onDelete,
}: CategoryCardProps) {
  return (
    <div className="border border-slate-200 dark:border-slate-800 rounded-2xl p-5 bg-white dark:bg-slate-800 flex flex-col justify-between gap-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl ${category.bgColor} flex items-center justify-center border border-slate-100 dark:border-slate-700/50`}>
            <Folder className={`w-5 h-5 ${category.textColor}`} />
          </div>
          <div>
            <h4 className="font-bold text-slate-900 dark:text-white leading-tight">
              {category.name}
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {noteCount} {noteCount === 1 ? "note" : "notes"}
            </p>
          </div>
        </div>

        {/* Category Color Dot */}
        <span className={`w-3.5 h-3.5 rounded-full ${category.color} border border-white dark:border-slate-800 shadow-sm`} />
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-750">
        <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">
          Category Folder
        </span>
        <div className="flex items-center gap-2">
          <button
            onClick={onEdit}
            className="p-1.5 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-350 transition-colors"
            title="Edit category"
          >
            <Edit3 className="w-3.5 h-3.5" />
          </button>
          
          {/* Prevent deleting the default "Personal" category if necessary, or just let them delete it */}
          {category.name !== "Personal" && (
            <button
              onClick={onDelete}
              className="p-1.5 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-lg text-slate-400 hover:text-red-650 transition-colors"
              title="Delete category"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
