"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useNotes } from "@/context/NotesContext";

import {
  LayoutDashboard,
  FileText,
  Star,
  Trash2,
  Folder,
  LogOut,
  Settings,
  Plus,
} from "lucide-react";

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { categories, notes } = useNotes();

  const navItems = [
    { label: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
    { label: "All Notes", icon: FileText, href: "/notes" },
    { label: "Favorites", icon: Star, href: "/favorites" },
    { label: "Categories", icon: Folder, href: "/categories" },
    { label: "Trash", icon: Trash2, href: "/trash" },
    { label: "Settings", icon: Settings, href: "/settings" },
  ];

  const handleLogout = () => {
    router.push("/login");
  };

  return (
    <aside className="hidden md:flex md:flex-col w-64 shrink-0 border-r border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 h-screen sticky top-0 px-4 py-5 transition-colors">
      {/* Brand logo */}
      <div className="flex items-center justify-between px-2 mb-6">
        <Link href="/dashboard" className="flex items-center gap-2.5">
          <div className="h-9 w-9 bg-slate-900 dark:bg-white text-white dark:text-slate-950 rounded-xl flex items-center justify-center font-extrabold text-base shadow-sm">
            N
          </div>
          <span className="text-lg font-bold text-gray-900 dark:text-white tracking-tight">Notes</span>
        </Link>
        <Link
          href="/create-note"
          className="p-1.5 bg-gray-50 hover:bg-gray-100 dark:bg-slate-800 dark:hover:bg-slate-700 text-gray-700 dark:text-slate-200 rounded-lg border border-gray-200 dark:border-slate-700 hover:scale-105 active:scale-95 transition-all shadow-sm"
          title="Create new note"
        >
          <Plus className="w-4 h-4" />
        </Link>
      </div>

      {/* Main navigation */}
      <nav className="flex flex-col gap-1">
        {navItems.map(({ label, icon: Icon, href }) => {
          const isActive = pathname === href || (href !== "/dashboard" && pathname.startsWith(href));
          return (
            <Link
              key={label}
              href={href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-150 ${
                isActive
                  ? "bg-gray-100 dark:bg-slate-800 text-gray-900 dark:text-white font-bold"
                  : "text-gray-500 dark:text-slate-450 hover:bg-gray-50 dark:hover:bg-slate-800/40 hover:text-gray-900 dark:hover:text-slate-205"
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? "text-gray-900 dark:text-white" : "text-gray-400 dark:text-slate-500"}`} />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Categories section */}
      <div className="mt-6 border-t border-gray-200 dark:border-slate-700 pt-4 overflow-y-auto no-scrollbar max-h-48">
        <p className="px-3 text-[10px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-widest mb-2.5">
          Categories
        </p>

        <div className="flex flex-col gap-0.5">
          {categories.map((cat) => {
            const count = notes.filter((n) => n.tag === cat.name && !n.deleted).length;
            return (
              <Link
                key={cat.name}
                href={`/notes?category=${cat.name}`}
                className="flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold text-gray-650 dark:text-slate-400 hover:bg-gray-50 dark:hover:bg-slate-800 hover:text-gray-900 dark:hover:text-slate-200 text-left transition-colors"
              >
                <span className="flex items-center gap-2.5 truncate">
                  <span className={`w-2.5 h-2.5 rounded-full ${cat.color} shrink-0`} />
                  <span className="truncate">{cat.name}</span>
                </span>
                <span className="text-[10px] text-gray-500 dark:text-slate-400 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-800 px-2 py-0.5 rounded-md font-mono font-bold">
                  {count}
                </span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Footer / Logout */}
      <div className="mt-auto pt-4 border-t border-gray-200 dark:border-slate-700">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-gray-550 hover:bg-red-50 hover:text-red-655 dark:text-slate-400 dark:hover:bg-red-950/20 dark:hover:text-red-400 w-full text-left transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </div>
    </aside>
  );
}