"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { notes as initialNotes, Note as InitialNote } from "@/app/data";
import { useTheme } from "next-themes";

export type Note = {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  tag: string;
  date: string;
  time: string;
  favorite: boolean;
  accent: string;
  deleted: boolean;
};

export type Category = {
  name: string;
  color: string; // bg color class (e.g., bg-blue-500)
  textColor: string; // text color class (e.g., text-blue-700)
  bgColor: string; // light bg color class (e.g., bg-blue-50)
  accentBorder: string; // border color class (e.g., border-l-blue-500)
};

export type UserProfile = {
  name: string;
  email: string;
  avatar: string;
  theme: "light" | "dark";
  emailNotifications: boolean;
  pushNotifications: boolean;
};

type NotesContextType = {
  notes: Note[];
  categories: Category[];
  user: UserProfile;
  addNote: (title: string, content: string, tag: string, favorite: boolean) => void;
  updateNote: (id: string, updates: Partial<Note>) => void;
  toggleFavorite: (id: string) => void;
  trashNote: (id: string) => void;
  restoreNote: (id: string) => void;
  deleteNotePermanently: (id: string) => void;
  emptyTrash: () => void;
  bulkRestore: (ids: string[]) => void;
  bulkDeletePermanently: (ids: string[]) => void;
  addCategory: (category: Category) => void;
  updateCategory: (oldName: string, category: Category) => void;
  deleteCategory: (name: string) => void;
  updateSettings: (userUpdates: Partial<UserProfile>) => void;
  toggleTheme: () => void;
};

const NotesContext = createContext<NotesContextType | undefined>(undefined);

const defaultCategories: Category[] = [
  { name: "Work", color: "bg-slate-500", textColor: "text-slate-700", bgColor: "bg-slate-100", accentBorder: "border-l-slate-400" },
  { name: "Study", color: "bg-blue-500", textColor: "text-blue-700", bgColor: "bg-blue-100", accentBorder: "border-l-blue-500" },
  { name: "Ideas", color: "bg-amber-400", textColor: "text-amber-700", bgColor: "bg-amber-100", accentBorder: "border-l-amber-400" },
  { name: "Personal", color: "bg-green-500", textColor: "text-green-700", bgColor: "bg-green-100", accentBorder: "border-l-green-500" }
];

const defaultUser: UserProfile = {
  name: "Veyra",
  email: "veyra@notesapp.io",
  avatar: "profile.jpg",
  theme: "light",
  emailNotifications: true,
  pushNotifications: false,
};

export const NotesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { theme: nextTheme, setTheme } = useTheme();
  const [notes, setNotes] = useState<Note[]>([]);
  const [categories, setCategories] = useState<Category[]>(defaultCategories);
  const [user, setUser] = useState<UserProfile>(defaultUser);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load state from localStorage on mount
  useEffect(() => {
    try {
      const storedNotes = localStorage.getItem("notes_app_notes");
      const storedCategories = localStorage.getItem("notes_app_categories");
      const storedUser = localStorage.getItem("notes_app_user");

      if (storedNotes) {
        setNotes(JSON.parse(storedNotes));
      } else {
        // Hydrate from initial notes in data.ts
        const hydrated: Note[] = initialNotes.map((n) => {
          let accentColor = "border-l-transparent";
          const cat = defaultCategories.find((c) => c.name.toLowerCase() === n.tag.toLowerCase());
          if (cat) accentColor = cat.accentBorder;
          return {
            id: n.id,
            title: n.title,
            excerpt: n.excerpt,
            content: n.excerpt + "\n\nThis is the detailed content for " + n.title + ". You can customize and write rich content here.",
            tag: n.tag,
            date: n.date,
            time: n.time,
            favorite: n.favorite,
            accent: accentColor,
            deleted: false,
          };
        });
        setNotes(hydrated);
        localStorage.setItem("notes_app_notes", JSON.stringify(hydrated));
      }

      if (storedCategories) {
        setCategories(JSON.parse(storedCategories));
      } else {
        localStorage.setItem("notes_app_categories", JSON.stringify(defaultCategories));
      }

      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        setTheme(parsedUser.theme);
      } else {
        localStorage.setItem("notes_app_user", JSON.stringify(defaultUser));
        setTheme("light");
      }
    } catch (e) {
      console.error("Failed to load local storage notes", e);
    }
    setIsLoaded(true);
  }, []);

  // Save notes to localStorage
  const saveNotes = (updatedNotes: Note[]) => {
    setNotes(updatedNotes);
    localStorage.setItem("notes_app_notes", JSON.stringify(updatedNotes));
  };

  // Save categories to localStorage
  const saveCategories = (updatedCategories: Category[]) => {
    setCategories(updatedCategories);
    localStorage.setItem("notes_app_categories", JSON.stringify(updatedCategories));
  };

  // Save user to localStorage
  const saveUser = (updatedUser: UserProfile) => {
    setUser(updatedUser);
    localStorage.setItem("notes_app_user", JSON.stringify(updatedUser));
  };

  const addNote = (title: string, content: string, tag: string, favorite: boolean) => {
    const matchedCat = categories.find((c) => c.name.toLowerCase() === tag.toLowerCase());
    const accent = matchedCat ? matchedCat.accentBorder : "border-l-transparent";
    
    const now = new Date();
    const dateOptions: Intl.DateTimeFormatOptions = { month: "short", day: "numeric", year: "numeric" };
    const timeOptions: Intl.DateTimeFormatOptions = { hour: "2-digit", minute: "2-digit" };
    
    const newNote: Note = {
      id: Date.now().toString(),
      title: title || "Untitled Note",
      content: content,
      excerpt: content ? (content.length > 80 ? content.slice(0, 80) + "..." : content) : "No additional content",
      tag: tag || "Personal",
      date: now.toLocaleDateString("en-US", dateOptions),
      time: now.toLocaleTimeString("en-US", timeOptions),
      favorite: favorite,
      accent: accent,
      deleted: false,
    };

    saveNotes([newNote, ...notes]);
  };

  const updateNote = (id: string, updates: Partial<Note>) => {
    const updated = notes.map((note) => {
      if (note.id === id) {
        const next = { ...note, ...updates };
        if (updates.content !== undefined) {
          next.excerpt = updates.content ? (updates.content.length > 80 ? updates.content.slice(0, 80) + "..." : updates.content) : "No additional content";
        }
        if (updates.tag !== undefined) {
          const matchedCat = categories.find((c) => c.name.toLowerCase() === updates.tag?.toLowerCase());
          next.accent = matchedCat ? matchedCat.accentBorder : "border-l-transparent";
        }
        return next;
      }
      return note;
    });
    saveNotes(updated);
  };

  const toggleFavorite = (id: string) => {
    const updated = notes.map((note) => 
      note.id === id ? { ...note, favorite: !note.favorite } : note
    );
    saveNotes(updated);
  };

  const trashNote = (id: string) => {
    const updated = notes.map((note) => 
      note.id === id ? { ...note, deleted: true } : note
    );
    saveNotes(updated);
  };

  const restoreNote = (id: string) => {
    const updated = notes.map((note) => 
      note.id === id ? { ...note, deleted: false } : note
    );
    saveNotes(updated);
  };

  const deleteNotePermanently = (id: string) => {
    const updated = notes.filter((note) => note.id !== id);
    saveNotes(updated);
  };

  const emptyTrash = () => {
    const updated = notes.filter((note) => !note.deleted);
    saveNotes(updated);
  };

  const bulkRestore = (ids: string[]) => {
    const updated = notes.map((note) => 
      ids.includes(note.id) ? { ...note, deleted: false } : note
    );
    saveNotes(updated);
  };

  const bulkDeletePermanently = (ids: string[]) => {
    const updated = notes.filter((note) => !ids.includes(note.id));
    saveNotes(updated);
  };

  const addCategory = (category: Category) => {
    saveCategories([...categories, category]);
  };

  const updateCategory = (oldName: string, updatedCategory: Category) => {
    // Update category definition
    const updatedCats = categories.map((c) => 
      c.name.toLowerCase() === oldName.toLowerCase() ? updatedCategory : c
    );
    saveCategories(updatedCats);

    // Update accent border styles and tag names in all notes that were in this category
    const updatedNotes = notes.map((n) => {
      if (n.tag.toLowerCase() === oldName.toLowerCase()) {
        return {
          ...n,
          tag: updatedCategory.name,
          accent: updatedCategory.accentBorder
        };
      }
      return n;
    });
    saveNotes(updatedNotes);
  };

  const deleteCategory = (name: string) => {
    // Remove the category
    const updatedCats = categories.filter((c) => c.name.toLowerCase() !== name.toLowerCase());
    saveCategories(updatedCats);

    // Re-tag deleted category notes to "Personal"
    const updatedNotes = notes.map((n) => {
      if (n.tag.toLowerCase() === name.toLowerCase()) {
        const personalCat = updatedCats.find((c) => c.name === "Personal") || defaultCategories[3];
        return {
          ...n,
          tag: "Personal",
          accent: personalCat.accentBorder
        };
      }
      return n;
    });
    saveNotes(updatedNotes);
  };

  const updateSettings = (userUpdates: Partial<UserProfile>) => {
    const nextUser = { ...user, ...userUpdates };
    saveUser(nextUser);
    
    if (userUpdates.theme) {
      setTheme(userUpdates.theme);
    }
  };

  const toggleTheme = () => {
    const targetTheme = nextTheme === "dark" ? "light" : "dark";
    setTheme(targetTheme);
    updateSettings({ theme: targetTheme });
  };

  // Prevent hydration mismatches by returning children only after loaded
  if (!isLoaded) {
    return null;
  }

  return (
    <NotesContext.Provider
      value={{
        notes,
        categories,
        user,
        addNote,
        updateNote,
        toggleFavorite,
        trashNote,
        restoreNote,
        deleteNotePermanently,
        emptyTrash,
        bulkRestore,
        bulkDeletePermanently,
        addCategory,
        updateCategory,
        deleteCategory,
        updateSettings,
        toggleTheme
      }}
    >
      {children}
    </NotesContext.Provider>
  );
};

export const useNotes = () => {
  const context = useContext(NotesContext);
  if (context === undefined) {
    throw new Error("useNotes must be used within a NotesProvider");
  }
  return context;
};
