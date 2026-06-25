"use client";

import { Search, Bell, ChevronDown } from "lucide-react";
import { useState } from "react";
import { useNotes } from "@/context/NotesContext";
import { useRouter } from "next/navigation";
import ProfileDropdown from "./ProfileDropdown";

export default function Topbar() {
  const { user, notes } = useNotes();
  const router = useRouter();
  const [searchVal, setSearchVal] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchVal.trim()) {
      router.push(`/notes?q=${encodeURIComponent(searchVal.trim())}`);
    } else {
      router.push("/notes");
    }
  };

  // Notification count (mocked or count of notes in trash as notification example)
  const notificationCount = notes.filter(n => n.deleted).length;

  return (
    <header className="flex items-center justify-between gap-4 px-6 md:px-8 py-4 border-b border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 transition-colors">
      {/* Global Search Bar Form */}
      <form onSubmit={handleSearchSubmit} className="relative w-full max-w-md">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500" />
        <input
          type="text"
          value={searchVal}
          onChange={(e) => setSearchVal(e.target.value)}
          placeholder="Search notes globally..."
          className="w-full pl-10 pr-14 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-900/10 dark:focus:ring-white/10 transition-shadow"
        />
        <button
          type="submit"
          className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-slate-450 dark:text-slate-400 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-650 hover:bg-slate-100 dark:hover:bg-slate-600 rounded px-1.5 py-0.5"
        >
          Enter
        </button>
      </form>

      {/* Topbar Actions */}
      <div className="flex items-center gap-5 shrink-0 relative">
        {/* Notifications Icon */}
        <button 
          onClick={() => router.push("/trash")}
          className="relative p-1.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 transition-colors"
          title={`${notificationCount} deleted items in trash`}
        >
          <Bell className="w-5 h-5" />
          {notificationCount > 0 && (
            <span className="absolute top-1 right-1 bg-red-500 text-white text-[9px] leading-none rounded-full w-4 h-4 flex items-center justify-center font-bold">
              {notificationCount}
            </span>
          )}
        </button>

        {/* User Profile Badge */}
        <div className="relative">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-2.5 p-1.5 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-colors text-left focus:outline-none"
          >
            <img
              src={user.avatar}
              alt={user.name}
              className="w-8 h-8 rounded-xl object-cover ring-2 ring-slate-100 dark:ring-slate-800"
            />
            <div className="hidden sm:block pr-1">
              <p className="text-xs text-slate-400 dark:text-slate-500 font-medium">Account</p>
              <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 leading-tight">{user.name}</p>
            </div>
            <ChevronDown className="w-4 h-4 text-slate-400 dark:text-slate-500 hidden sm:block" />
          </button>

          {/* Profile Dropdown Component */}
          <ProfileDropdown
            isOpen={isDropdownOpen}
            onClose={() => setIsDropdownOpen(false)}
          />
        </div>
      </div>
    </header>
  );
}