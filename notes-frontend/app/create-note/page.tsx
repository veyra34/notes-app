"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, Star, Save, X, Folder, HelpCircle } from "lucide-react";
import { useNotes } from "@/context/NotesContext";
import Sidebar from "@/components/Sidebar";
import Topbar from "@/components/Topbar";
import TextAreaField from "@/components/TextAreaField";

function CreateNoteForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get("edit");
  
  const { notes, categories, addNote, updateNote } = useNotes();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tag, setTag] = useState("Personal");
  const [favorite, setFavorite] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // If edit mode, load existing note
  useEffect(() => {
    if (editId) {
      const noteToEdit = notes.find((n) => n.id === editId && !n.deleted);
      if (noteToEdit) {
        setTitle(noteToEdit.title);
        setContent(noteToEdit.content);
        setTag(noteToEdit.tag);
        setFavorite(noteToEdit.favorite);
        setIsEditing(true);
      } else {
        // If note is not found or is deleted, redirect back
        router.push("/dashboard");
      }
    }
  }, [editId, notes, router]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() && !content.trim()) {
      alert("Please fill in either a title or note content.");
      return;
    }

    if (isEditing && editId) {
      updateNote(editId, {
        title: title || "Untitled Note",
        content: content,
        tag: tag,
        favorite: favorite,
      });
    } else {
      addNote(title || "Untitled Note", content, tag, favorite);
    }

    router.push("/dashboard");
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-slate-950 text-gray-900 dark:text-slate-100 transition-colors">
      <Sidebar />

      <div className="flex-1 min-w-0 overflow-y-auto h-screen">
        <Topbar />

        <main className="px-6 md:px-8 py-8 max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8 gap-4">
            <div className="flex items-center gap-3">
              <button
                onClick={handleCancel}
                className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-350 rounded-xl border border-slate-200 dark:border-slate-700 transition-all active:scale-95"
                title="Go back"
              >
                <ArrowLeft className="w-4.5 h-4.5" />
              </button>
              <div>
                <h1 className="text-xl font-bold text-slate-900 dark:text-white">
                  {isEditing ? "Edit Note" : "Create New Note"}
                </h1>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  {isEditing ? "Modify your note details below" : "Draft a new thought, brainstorm or study notes"}
                </p>
              </div>
            </div>

            {/* Favorite & Tag Controls */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setFavorite(!favorite)}
                className={`p-2.5 rounded-xl border transition-all active:scale-95 flex items-center gap-1.5 text-xs font-semibold ${
                  favorite
                    ? "bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-900/50 text-amber-600 dark:text-amber-400"
                    : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500 hover:text-slate-850 dark:text-slate-300"
                }`}
                title="Toggle Favorite"
              >
                <Star className={`w-4 h-4 ${favorite ? "fill-amber-400 text-amber-400" : ""}`} />
                <span className="hidden sm:inline">Favorite</span>
              </button>
            </div>
          </div>

          {/* Form Editor Card */}
          <form onSubmit={handleSave} className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl p-6 md:p-8 shadow-sm flex flex-col gap-6">
            {/* Note Title Input */}
            <div className="border-b border-slate-100 dark:border-slate-750 pb-4">
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Title your note..."
                className="w-full bg-transparent border-0 text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white placeholder:text-slate-300 dark:placeholder:text-slate-600 focus:outline-none focus:ring-0 py-1"
                required
              />
            </div>

            {/* Tag Selection Dropdown */}
            <div className="flex flex-wrap items-center gap-4 bg-slate-50 dark:bg-slate-850/60 p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-500 dark:text-slate-450">
                <Folder className="w-4 h-4" />
                Select Category:
              </div>
              <div className="flex items-center gap-2">
                <select
                  value={tag}
                  onChange={(e) => setTag(e.target.value)}
                  className="bg-white dark:bg-slate-800 border border-slate-250 dark:border-slate-700 text-xs font-semibold rounded-xl px-3 py-2 text-slate-750 dark:text-slate-250 focus:outline-none focus:ring-2 focus:ring-slate-900/10 dark:focus:ring-white/10 transition-shadow"
                >
                  {categories.map((cat) => (
                    <option key={cat.name} value={cat.name}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Note Content Textarea */}
            <div>
              <TextAreaField
                value={content}
                onChange={setContent}
                placeholder="Start writing down your ideas, study notes, or schedules. Support multi-line layout and auto-expansion..."
                maxLength={2000}
                label="Note Content"
              />
            </div>

            {/* Action Bar */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-750">
              <button
                type="button"
                onClick={handleCancel}
                className="flex items-center gap-2 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50 text-slate-700 dark:text-slate-350 text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors"
              >
                <X className="w-4 h-4" />
                Cancel
              </button>
              <button
                type="submit"
                className="flex items-center gap-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-850 dark:hover:bg-slate-100 text-sm font-semibold px-5 py-2.5 rounded-xl transition-all shadow-sm active:scale-95"
              >
                <Save className="w-4 h-4" />
                {isEditing ? "Update Note" : "Save Note"}
              </button>
            </div>
          </form>
        </main>
      </div>
    </div>
  );
}

export default function CreateNotePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900 text-slate-500">
        Loading editor...
      </div>
    }>
      <CreateNoteForm />
    </Suspense>
  );
}
