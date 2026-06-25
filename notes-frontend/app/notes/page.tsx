"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { FileText, Plus, ChevronLeft, ChevronRight } from "lucide-react";
import { useNotes, Note } from "@/context/NotesContext";
import Sidebar from "@/components/Sidebar";
import Topbar from "@/components/Topbar";
import SearchBar from "@/components/SearchBar";
import FilterBar from "@/components/FilterBar";
import NoteCard from "@/components/NoteCard";
import EmptyState from "@/components/EmptyState";
import Link from "next/link";

function NotesContent() {
  const { notes, categories } = useNotes();
  const searchParams = useSearchParams();
  const router = useRouter();

  // Read URL query parameters
  const urlCategory = searchParams.get("category");
  const urlSearch = searchParams.get("q");

  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Sync URL query params to state
  useEffect(() => {
    if (urlCategory) {
      setSelectedCategory(urlCategory);
    } else {
      setSelectedCategory("All");
    }
  }, [urlCategory]);

  useEffect(() => {
    if (urlSearch) {
      setSearchQuery(urlSearch);
    } else {
      setSearchQuery("");
    }
  }, [urlSearch]);

  // Filter notes (excluding deleted ones)
  const filteredNotes = notes.filter((note) => {
    if (note.deleted) return false;
    
    const matchesCategory = selectedCategory === "All" || note.tag.toLowerCase() === selectedCategory.toLowerCase();
    
    const matchesSearch = 
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.content.toLowerCase().includes(searchQuery.toLowerCase());
      
    return matchesCategory && matchesSearch;
  });

  // Sort notes
  const sortedNotes = [...filteredNotes].sort((a, b) => {
    if (sortBy === "newest") {
      return new Date(b.date + " " + b.time).getTime() - new Date(a.date + " " + a.time).getTime();
    }
    if (sortBy === "oldest") {
      return new Date(a.date + " " + a.time).getTime() - new Date(b.date + " " + b.time).getTime();
    }
    if (sortBy === "title-asc") {
      return a.title.localeCompare(b.title);
    }
    if (sortBy === "title-desc") {
      return b.title.localeCompare(a.title);
    }
    return 0;
  });

  // Paginate notes
  const totalPages = Math.max(1, Math.ceil(sortedNotes.length / itemsPerPage));
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedNotes = sortedNotes.slice(startIndex, startIndex + itemsPerPage);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, searchQuery, sortBy]);

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-slate-950 text-gray-900 dark:text-slate-100 transition-colors">
      <Sidebar />

      <div className="flex-1 min-w-0 overflow-y-auto h-screen">
        <Topbar />

        <main className="px-6 md:px-8 py-8 max-w-7xl mx-auto">
          {/* Header section */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">All Notes</h1>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                Browse, search, and manage your complete list of notes
              </p>
            </div>
            
            <Link
              href="/create-note"
              className="flex items-center justify-center gap-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-sm font-semibold px-4 py-2.5 rounded-xl hover:bg-slate-850 dark:hover:bg-slate-100 transition-all shadow-sm active:scale-95 text-center"
            >
              <Plus className="w-4 h-4" />
              Create Note
            </Link>
          </div>

          {/* Filtering, Searching, Layout Controls */}
          <div className="flex flex-col gap-5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl p-6 shadow-sm mb-6">
            <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center justify-between">
              <SearchBar value={searchQuery} onChange={setSearchQuery} />
              
              {searchQuery && (
                <button
                  onClick={() => {
                    setSearchQuery("");
                    router.push("/notes");
                  }}
                  className="text-xs font-semibold text-slate-400 hover:text-slate-650 dark:hover:text-slate-250 text-left"
                >
                  Clear all search terms
                </button>
              )}
            </div>

            <FilterBar
              categories={categories}
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
              sortBy={sortBy}
              onSortChange={setSortBy}
              viewMode={viewMode}
              onViewModeChange={setViewMode}
            />
          </div>

          {/* Notes display */}
          {paginatedNotes.length > 0 ? (
            <div className="flex flex-col gap-6">
              <div
                className={
                  viewMode === "grid"
                    ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4.5"
                    : "flex flex-col gap-3"
                }
              >
                {paginatedNotes.map((note) => (
                  <NoteCard key={note.id} note={note} viewMode={viewMode} />
                ))}
              </div>

              {/* Pagination controls */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between border-t border-slate-200/60 dark:border-slate-800 pt-5 mt-4">
                  <span className="text-xs text-slate-450 dark:text-slate-500 font-semibold">
                    Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, sortedNotes.length)} of {sortedNotes.length} notes
                  </span>
                  
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className="p-2 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-850 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-50 disabled:pointer-events-none transition-colors"
                      aria-label="Previous page"
                    >
                      <ChevronLeft className="w-4 h-4 text-slate-600 dark:text-slate-300" />
                    </button>
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300 px-3">
                      Page {currentPage} of {totalPages}
                    </span>
                    <button
                      onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                      className="p-2 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-850 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-50 disabled:pointer-events-none transition-colors"
                      aria-label="Next page"
                    >
                      <ChevronRight className="w-4 h-4 text-slate-600 dark:text-slate-300" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <EmptyState
              icon={FileText}
              title="No notes found"
              description={
                searchQuery
                  ? "We couldn't find any notes matching your search query. Try clearing filters or typing something else."
                  : "Start creating your notes! Keep track of tasks, ideas, school work, and diary entries."
              }
              actionText={searchQuery ? "Clear Search" : "Create a Note"}
              onActionClick={
                searchQuery
                  ? () => setSearchQuery("")
                  : () => router.push("/create-note")
              }
            />
          )}
        </main>
      </div>
    </div>
  );
}

export default function NotesPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900 text-slate-500">
        Loading notes browser...
      </div>
    }>
      <NotesContent />
    </Suspense>
  );
}