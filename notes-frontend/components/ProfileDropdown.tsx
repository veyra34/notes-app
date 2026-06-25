"use client";

import Link from "next/link";
import { User, Settings, Sun, Moon, LogOut } from "lucide-react";
import { useNotes } from "@/context/NotesContext";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";

type ProfileDropdownProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function ProfileDropdown({ isOpen, onClose }: ProfileDropdownProps) {
  const { user, toggleTheme } = useNotes();
  const router = useRouter();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onClose();
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      ref={dropdownRef}
      className="absolute right-0 top-full mt-2 w-64 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-xl py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
    >
      {/* Header Info */}
      <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-700 flex flex-col gap-0.5">
        <p className="text-sm font-semibold text-slate-900 dark:text-white">{user.name}</p>
        <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{user.email}</p>
      </div>

      {/* Menu Options */}
      <div className="p-1">
        <Link
          href="/settings"
          onClick={onClose}
          className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors font-medium"
        >
          <User className="w-4 h-4 text-slate-400" />
          My Profile
        </Link>
        <Link
          href="/settings"
          onClick={onClose}
          className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors font-medium"
        >
          <Settings className="w-4 h-4 text-slate-400" />
          Settings
        </Link>

        {/* Theme Toggle */}
        <button
          onClick={() => {
            toggleTheme();
          }}
          className="flex items-center justify-between w-full px-3 py-2 rounded-xl text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors font-medium text-left"
        >
          <span className="flex items-center gap-3">
            {user.theme === "dark" ? (
              <Moon className="w-4 h-4 text-purple-400" />
            ) : (
              <Sun className="w-4 h-4 text-amber-500" />
            )}
            Theme Preferences
          </span>
          <span className="text-[10px] bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded-full uppercase">
            {user.theme}
          </span>
        </button>
      </div>

      <div className="border-t border-slate-100 dark:border-slate-700 mt-1 pt-1 p-1">
        <button
          onClick={() => {
            onClose();
            router.push("/login");
          }}
          className="flex items-center gap-3 w-full px-3 py-2 rounded-xl text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors font-medium text-left"
        >
          <LogOut className="w-4 h-4 text-red-500" />
          Logout
        </button>
      </div>
    </div>
  );
}
