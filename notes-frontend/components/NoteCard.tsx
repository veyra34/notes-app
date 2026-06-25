"use client";

import { useState, useEffect, useRef } from "react";
import { Star, MoreVertical, Trash2, Edit3, RotateCcw, AlertTriangle } from "lucide-react";
import { Note, useNotes } from "@/context/NotesContext";
import { tagStyles } from "@/app/data";
import { useRouter } from "next/navigation";
import Link from "next/link";

type NoteCardProps = {
  note: Note;
  viewMode?: "grid" | "list";
};

export default function NoteCard({ note, viewMode = "grid" }: NoteCardProps) {
  const { toggleFavorite, trashNote, restoreNote, deleteNotePermanently, categories } = useNotes();
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    }
    if (isMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMenuOpen]);

  // Find dynamic style for category
  const matchedCat = categories.find((c) => c.name.toLowerCase() === note.tag.toLowerCase());
  const tagColorClass = matchedCat 
    ? `${matchedCat.bgColor} ${matchedCat.textColor}` 
    : (tagStyles[note.tag as keyof typeof tagStyles] || "bg-slate-100 text-slate-700");

  const handleCardClick = () => {
    if (!note.deleted) {
      router.push(`/create-note?edit=${note.id}`);
    }
  };

  const menuItems = note.deleted ? (
    <>
      <button
        onClick={(e) => {
          e.stopPropagation();
          restoreNote(note.id);
          setIsMenuOpen(false);
        }}
        className="flex items-center gap-2 px-3 py-1.5 w-full text-left text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-lg transition-colors"
      >
        <RotateCcw className="w-3.5 h-3.5 text-slate-450" />
        Restore Note
      </button>
      <button
        onClick={(e) => {
          e.stopPropagation();
          deleteNotePermanently(note.id);
          setIsMenuOpen(false);
        }}
        className="flex items-center gap-2 px-3 py-1.5 w-full text-left text-xs font-semibold text-red-650 dark:text-red-450 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-lg transition-colors"
      >
        <AlertTriangle className="w-3.5 h-3.5 text-red-500" />
        Delete Forever
      </button>
    </>
  ) : (
    <>
      <Link
        href={`/create-note?edit=${note.id}`}
        onClick={(e) => {
          e.stopPropagation();
        }}
        className="flex items-center gap-2 px-3 py-1.5 w-full text-left text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-lg transition-colors"
      >
        <Edit3 className="w-3.5 h-3.5 text-slate-450" />
        Edit Note
      </Link>
      <button
        onClick={(e) => {
          e.stopPropagation();
          toggleFavorite(note.id);
          setIsMenuOpen(false);
        }}
        className="flex items-center gap-2 px-3 py-1.5 w-full text-left text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-lg transition-colors"
      >
        <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
        {note.favorite ? "Unfavorite" : "Favorite"}
      </button>
      <div className="border-t border-slate-100 dark:border-slate-700 my-1"></div>
      <button
        onClick={(e) => {
          e.stopPropagation();
          trashNote(note.id);
          setIsMenuOpen(false);
        }}
        className="flex items-center gap-2 px-3 py-1.5 w-full text-left text-xs font-semibold text-red-600 dark:text-red-450 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-lg transition-colors"
      >
        <Trash2 className="w-3.5 h-3.5 text-red-500" />
        Move to Trash
      </button>
    </>
  );

  if (viewMode === "list") {
    return (
      <div
        onClick={handleCardClick}
        className={`border border-gray-200 dark:border-slate-800 ${note.accent} border-l-4 rounded-2xl p-4.5 bg-white dark:bg-slate-800 flex items-center justify-between gap-4 hover:border-gray-350 dark:hover:border-slate-700 hover:shadow-md transition-all duration-200 cursor-pointer select-none`}
      >
        <div className="flex-1 min-w-0 flex flex-col sm:flex-row sm:items-center gap-3">
          <div className="min-w-0 sm:w-1/3">
            <h3 className="font-extrabold text-gray-900 dark:text-white truncate">{note.title}</h3>
            <span className="text-[10px] text-gray-400 dark:text-slate-500 sm:hidden">
              {note.date} &middot; {note.time}
            </span>
          </div>
          <p className="text-sm text-gray-600 dark:text-slate-450 truncate sm:w-1/2">
            {note.excerpt}
          </p>
          <div className="flex items-center gap-2 shrink-0">
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${tagColorClass}`}>
              {note.tag}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0 relative" onClick={(e) => e.stopPropagation()}>
          <span className="text-xs text-slate-400 dark:text-slate-500 hidden sm:inline whitespace-nowrap">
            {note.date} &middot; {note.time}
          </span>
          
          {!note.deleted && (
            <button 
              onClick={() => toggleFavorite(note.id)} 
              aria-label="Toggle favorite"
              className="p-1 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-lg transition-colors"
            >
              <Star
                className={`w-4 h-4 ${
                  note.favorite ? "fill-amber-400 text-amber-400" : "text-slate-350 dark:text-slate-600"
                }`}
              />
            </button>
          )}

          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-1 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-lg transition-colors"
              aria-label="More options"
            >
              <MoreVertical className="w-4 h-4 text-slate-400 dark:text-slate-500" />
            </button>

            {isMenuOpen && (
              <div className="absolute right-0 bottom-full sm:bottom-auto sm:top-full mt-1 mb-1 sm:mb-0 w-44 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-lg p-1 z-30">
                {menuItems}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      onClick={handleCardClick}
      className={`border border-gray-200 dark:border-slate-800 ${note.accent} border-l-4 rounded-2xl p-5 bg-white dark:bg-slate-800 flex flex-col gap-3 hover:border-gray-350 dark:hover:border-slate-700 hover:shadow-md transition-all duration-200 cursor-pointer select-none`}
    >
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-extrabold text-gray-900 dark:text-white line-clamp-1 flex-1">{note.title}</h3>
        <div className="flex items-center gap-1 shrink-0" onClick={(e) => e.stopPropagation()}>
          {!note.deleted && (
            <button 
              onClick={() => toggleFavorite(note.id)} 
              aria-label="Toggle favorite"
              className="p-1 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-lg"
            >
              <Star
                className={`w-3.5 h-3.5 ${
                  note.favorite ? "fill-amber-400 text-amber-400" : "text-slate-350 dark:text-slate-600"
                }`}
              />
            </button>
          )}
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-1 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-lg"
              aria-label="More options"
            >
              <MoreVertical className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
            </button>

            {isMenuOpen && (
              <div className="absolute right-0 top-full mt-1 w-44 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-lg p-1 z-30">
                {menuItems}
              </div>
            )}
          </div>
        </div>
      </div>

      <p className="text-sm text-gray-650 dark:text-slate-450 leading-relaxed line-clamp-2 h-10">
        {note.excerpt}
      </p>

      <div className="flex items-center justify-between pt-3 mt-1 border-t border-gray-100 dark:border-slate-750">
        <span className="text-[10px] text-gray-400 dark:text-slate-500">
          {note.date} &middot; {note.time}
        </span>
        <span
          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${tagColorClass}`}
        >
          {note.tag}
        </span>
      </div>
    </div>
  );
}