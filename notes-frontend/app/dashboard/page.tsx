"use client";

import { FileText, Star, Folder, Trash2, Plus, Search, CheckCircle2 } from "lucide-react";
import Sidebar from "@/components/Sidebar";
import Topbar from "@/components/Topbar";
import StatCard from "@/components/StatCard";
import NoteCard from "@/components/NoteCard";
import { useNotes } from "@/context/NotesContext";
import Link from "next/link";
import { useState } from "react";

export default function DashboardPage() {
  const { notes, categories, user } = useNotes();
  
  // State for search and category inside the dashboard
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  // Calculate dynamic stats
  const activeNotes = notes.filter((n) => !n.deleted);
  const totalNotesCount = activeNotes.length;
  const favoritesCount = activeNotes.filter((n) => n.favorite).length;
  const categoriesCount = categories.length;
  const trashCount = notes.filter((n) => n.deleted).length;

  // Filter recent notes for dashboard display
  const filteredRecentNotes = activeNotes.filter((note) => {
    const matchesCategory = selectedCategory === "All" || note.tag.toLowerCase() === selectedCategory.toLowerCase();
    const matchesSearch = 
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.content.toLowerCase().includes(searchQuery.toLowerCase());
      
    return matchesCategory && matchesSearch;
  });

  // Show top 3 recent notes
  const recentNotes = filteredRecentNotes.slice(0, 3);

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-slate-950 text-gray-900 dark:text-slate-100 transition-colors">
      <Sidebar />

      <div className="flex-1 min-w-0 overflow-y-auto h-screen">
        <Topbar />

        <main className="px-6 md:px-8 py-10 max-w-7xl mx-auto flex flex-col gap-8">
          {/* Welcome section */}
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-gray-905 dark:text-white text-3xl font-extrabold tracking-tight">
                Welcome back, {user.name}! 👋
              </h1>
              <p className="text-gray-600 dark:text-slate-400 mt-1 text-sm font-medium">
                Here&apos;s what&apos;s happening with your notes and ideas.
              </p>
            </div>
            <Link
              href="/create-note"
              className="flex items-center gap-2 bg-slate-900 hover:bg-slate-805 dark:bg-white text-white dark:text-slate-900 text-sm font-bold px-4.5 py-2.5 rounded-xl transition-all shadow-sm hover:scale-[1.02] active:scale-95"
            >
              <Plus className="w-4 h-4" />
              Create Note
            </Link>
          </div>

          {/* Stats grid cards linking to respective paths */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
            <Link href="/notes" className="hover:scale-[1.02] transition-transform block">
              <StatCard icon={FileText} label="Total Notes" value={totalNotesCount} sublabel="All active notes" />
            </Link>
            <Link href="/favorites" className="hover:scale-[1.02] transition-transform block">
              <StatCard icon={Star} label="Favorites" value={favoritesCount} sublabel="Starred notes" />
            </Link>
            <Link href="/categories" className="hover:scale-[1.02] transition-transform block">
              <StatCard icon={Folder} label="Categories" value={categoriesCount} sublabel="Total folders" />
            </Link>
            <Link href="/trash" className="hover:scale-[1.02] transition-transform block">
              <StatCard icon={Trash2} label="Trash" value={trashCount} sublabel="Deleted items" />
            </Link>
          </div>

          {/* Recent Notes listing section */}
          <div className="border border-gray-250 dark:border-slate-800 rounded-2xl p-6.5 bg-white dark:bg-slate-800 shadow-sm hover:shadow-md transition-all duration-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <h2 className="text-lg font-extrabold text-gray-905 dark:text-white tracking-tight">Recent Notes</h2>
                <p className="text-xs text-gray-400 dark:text-slate-500 mt-0.5 font-medium">Quick lookup of recently saved drafts</p>
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <div className="relative flex-1 sm:w-56">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-slate-500" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search recent..."
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs placeholder:text-gray-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-200 dark:focus:ring-white/10"
                  />
                </div>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="border border-gray-300 dark:border-slate-700 rounded-xl text-xs font-semibold px-3 py-2 bg-white dark:bg-slate-800 text-gray-700 dark:text-slate-350 focus:outline-none focus:ring-2 focus:ring-slate-200 dark:focus:ring-white/10"
                >
                  <option value="All">All Categories</option>
                  {categories.map((cat) => (
                    <option key={cat.name} value={cat.name}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* List notes */}
            {recentNotes.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {recentNotes.map((note) => (
                  <NoteCard key={note.id} note={note} />
                ))}
              </div>
            ) : (
              <div className="py-12 text-center flex flex-col items-center justify-center border border-dashed border-gray-200 dark:border-slate-700/50 rounded-2xl bg-gray-50/50 dark:bg-transparent">
                <p className="text-sm font-semibold text-gray-500 dark:text-slate-400">No recent notes found matching current search/filters</p>
                <Link
                  href="/create-note"
                  className="mt-3 text-xs font-bold text-gray-900 dark:text-white hover:underline flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Create a new note
                </Link>
              </div>
            )}

            {recentNotes.length > 0 && (
              <div className="flex items-center justify-center gap-2 text-xs font-bold text-gray-500 dark:text-slate-500 mt-8">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                Showing up to 3 recent items &middot;{" "}
                <Link href="/notes" className="text-gray-900 dark:text-white hover:underline font-bold">
                  View All Notes
                </Link>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}