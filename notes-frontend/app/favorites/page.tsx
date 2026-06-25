"use client";

import React, { useState } from "react";
import { Star, FileText } from "lucide-react";
import { useNotes } from "@/context/NotesContext";
import Sidebar from "@/components/Sidebar";
import Topbar from "@/components/Topbar";
import SearchBar from "@/components/SearchBar";
import NoteCard from "@/components/NoteCard";
import EmptyState from "@/components/EmptyState";
import { useRouter } from "next/navigation";

export default function FavoritesPage() {
  const { notes } = useNotes();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Filter notes to only show favorites that are not deleted
  const favoriteNotes = notes.filter((note) => {
    if (!note.favorite || note.deleted) return false;
    
    const matchesSearch = 
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.content.toLowerCase().includes(searchQuery.toLowerCase());
      
    return matchesSearch;
  });

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-slate-950 text-gray-900 dark:text-slate-100 transition-colors">
      <Sidebar />

      <div className="flex-1 min-w-0 overflow-y-auto h-screen">
        <Topbar />

        <main className="px-6 md:px-8 py-8 max-w-7xl mx-auto">
          {/* Header section */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Star className="w-6 h-6 text-amber-500 fill-amber-500" />
                Favorite Notes
              </h1>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                Quick access to your most important starred notes
              </p>
            </div>
          </div>

          {/* Search bar inside cards container */}
          <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center justify-between bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl p-5 shadow-sm mb-6">
            <SearchBar value={searchQuery} onChange={setSearchQuery} placeholder="Search favorites..." />
            
            <div className="flex items-center gap-2 border border-slate-200 dark:border-slate-700 rounded-xl p-0.5 bg-slate-50 dark:bg-slate-850 self-end sm:self-auto">
              <button
                onClick={() => setViewMode("grid")}
                className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors ${
                  viewMode === "grid"
                    ? "bg-white dark:bg-slate-705 text-slate-850 dark:text-white shadow-sm"
                    : "text-slate-450 hover:text-slate-700"
                }`}
              >
                Grid
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors ${
                  viewMode === "list"
                    ? "bg-white dark:bg-slate-705 text-slate-850 dark:text-white shadow-sm"
                    : "text-slate-450 hover:text-slate-700"
                }`}
              >
                List
              </button>
            </div>
          </div>

          {/* Favorites notes list */}
          {favoriteNotes.length > 0 ? (
            <div
              className={
                viewMode === "grid"
                  ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4.5"
                  : "flex flex-col gap-3"
              }
            >
              {favoriteNotes.map((note) => (
                <NoteCard key={note.id} note={note} viewMode={viewMode} />
              ))}
            </div>
          ) : (
            <EmptyState
              icon={Star}
              title="No favorites found"
              description={
                searchQuery
                  ? "We couldn't find any starred notes matching your search query."
                  : "You haven't favorited any notes yet. Star a note to see it here for quick access."
              }
              actionText={searchQuery ? "Clear Search" : "Browse All Notes"}
              onActionClick={
                searchQuery
                  ? () => setSearchQuery("")
                  : () => router.push("/notes")
              }
            />
          )}
        </main>
      </div>
    </div>
  );
}