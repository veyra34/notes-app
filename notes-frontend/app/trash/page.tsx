"use client";

import React, { useState } from "react";
import { Trash2, RotateCcw, AlertTriangle, CheckSquare, Square, RefreshCw } from "lucide-react";
import { useNotes } from "@/context/NotesContext";
import Sidebar from "@/components/Sidebar";
import Topbar from "@/components/Topbar";
import NoteCard from "@/components/NoteCard";
import EmptyState from "@/components/EmptyState";
import Modal from "@/components/Modal";

export default function TrashPage() {
  const { notes, restoreNote, deleteNotePermanently, emptyTrash, bulkRestore, bulkDeletePermanently } = useNotes();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isConfirmEmptyOpen, setIsConfirmEmptyOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Get only deleted notes
  const trashNotes = notes.filter((note) => note.deleted);

  const toggleSelectNote = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((item) => item !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const handleSelectAll = () => {
    if (selectedIds.length === trashNotes.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(trashNotes.map((note) => note.id));
    }
  };

  const handleBulkRestore = () => {
    bulkRestore(selectedIds);
    setSelectedIds([]);
  };

  const handleBulkDelete = () => {
    if (confirm("Are you sure you want to permanently delete these selected notes? This action cannot be undone.")) {
      bulkDeletePermanently(selectedIds);
      setSelectedIds([]);
    }
  };

  const handleEmptyTrashConfirm = () => {
    emptyTrash();
    setSelectedIds([]);
    setIsConfirmEmptyOpen(false);
  };

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
                <Trash2 className="w-6 h-6 text-slate-400" />
                Trash Bin
              </h1>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                Manage your deleted notes. Items in trash can be restored or permanently removed.
              </p>
            </div>
            
            {trashNotes.length > 0 && (
              <button
                onClick={() => setIsConfirmEmptyOpen(true)}
                className="flex items-center justify-center gap-2 bg-red-50 dark:bg-red-950/20 text-red-655 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 text-sm font-semibold px-4 py-2.5 rounded-xl border border-red-200 dark:border-red-900/50 transition-colors active:scale-95 text-center"
              >
                <Trash2 className="w-4 h-4" />
                Empty Trash Bin
              </button>
            )}
          </div>

          {trashNotes.length > 0 ? (
            <div className="flex flex-col gap-4">
              {/* Trash controls bar */}
              <div className="flex items-center justify-between bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-4 shadow-sm">
                <div className="flex items-center gap-3">
                  <button
                    onClick={handleSelectAll}
                    className="flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-350 hover:text-slate-850 dark:hover:text-white px-2.5 py-1.5 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-lg transition-colors"
                  >
                    {selectedIds.length === trashNotes.length ? (
                      <CheckSquare className="w-4.5 h-4.5 text-slate-700 dark:text-white" />
                    ) : (
                      <Square className="w-4.5 h-4.5 text-slate-400" />
                    )}
                    Select All ({selectedIds.length} chosen)
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setViewMode(viewMode === "grid" ? "list" : "grid")}
                    className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-655 dark:text-slate-350 transition-colors"
                  >
                    {viewMode === "grid" ? "List View" : "Grid View"}
                  </button>
                </div>
              </div>

              {/* Trash notes grid list */}
              <div className="relative">
                <div
                  className={
                    viewMode === "grid"
                      ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4.5"
                      : "flex flex-col gap-3"
                  }
                >
                  {trashNotes.map((note) => {
                    const isSelected = selectedIds.includes(note.id);
                    return (
                      <div key={note.id} className="relative group">
                        {/* Checkbox overlay */}
                        <button
                          onClick={() => toggleSelectNote(note.id)}
                          className={`absolute left-3 top-3 z-25 p-1 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:scale-105 transition-all shadow-sm ${
                            isSelected
                              ? "opacity-100 border-slate-900 dark:border-white text-slate-900 dark:text-white"
                              : "opacity-0 group-hover:opacity-100 text-slate-300 hover:text-slate-400"
                          }`}
                          aria-label={isSelected ? "Deselect note" : "Select note"}
                        >
                          {isSelected ? (
                            <CheckSquare className="w-4.5 h-4.5" />
                          ) : (
                            <Square className="w-4.5 h-4.5" />
                          )}
                        </button>
                        
                        <div className={isSelected ? "ring-2 ring-slate-900 dark:ring-white rounded-2xl transition-shadow" : ""}>
                          <NoteCard note={note} viewMode={viewMode} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Floating bulk actions action bar */}
              {selectedIds.length > 0 && (
                <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 bg-slate-900 text-white dark:bg-white dark:text-slate-950 px-6 py-4.5 rounded-2xl flex items-center gap-6 shadow-2xl border border-slate-800 dark:border-slate-200/50 animate-in slide-in-from-bottom-5 duration-200">
                  <span className="text-xs font-bold whitespace-nowrap">
                    {selectedIds.length} items selected
                  </span>
                  <div className="h-5 w-px bg-slate-800 dark:bg-slate-200" />
                  <div className="flex items-center gap-3">
                    <button
                      onClick={handleBulkRestore}
                      className="flex items-center gap-1.5 hover:bg-slate-800 dark:hover:bg-slate-100 text-xs font-bold px-3 py-1.5 rounded-lg transition-colors text-white dark:text-slate-950"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      Restore Selected
                    </button>
                    <button
                      onClick={handleBulkDelete}
                      className="flex items-center gap-1.5 hover:bg-red-900 hover:text-white dark:hover:bg-red-50 text-red-400 dark:text-red-655 text-xs font-bold px-3 py-1.5 rounded-lg transition-colors"
                    >
                      <AlertTriangle className="w-3.5 h-3.5 text-red-500" />
                      Delete Permanently
                    </button>
                    <button
                      onClick={() => setSelectedIds([])}
                      className="text-xs text-slate-450 hover:text-slate-300 dark:text-slate-500 dark:hover:text-slate-700 font-semibold px-2"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <EmptyState
              icon={Trash2}
              title="Trash bin is empty"
              description="Any notes you delete will end up here, where you can restore them or delete them permanently."
            />
          )}

          {/* --- CONFIRM EMPTY TRASH MODAL --- */}
          <Modal
            isOpen={isConfirmEmptyOpen}
            onClose={() => setIsConfirmEmptyOpen(false)}
            title="Empty Trash Bin"
          >
            <div className="flex flex-col gap-4">
              <div className="flex items-start gap-3 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/50 p-4 rounded-2xl">
                <AlertTriangle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white leading-tight">
                    Confirm Permanent Purge
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-450 mt-1 leading-relaxed">
                    Are you sure you want to permanently delete all notes currently in the Trash Bin? <strong>This action cannot be undone</strong> and all data will be lost forever.
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-700">
                <button
                  type="button"
                  onClick={() => setIsConfirmEmptyOpen(false)}
                  className="border border-slate-200 dark:border-slate-700 text-slate-655 dark:text-slate-350 text-xs font-semibold px-4 py-2.5 rounded-xl hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleEmptyTrashConfirm}
                  className="bg-red-550 hover:bg-red-600 text-white text-xs font-semibold px-4 py-2.5 rounded-xl active:scale-95 transition-all shadow-sm"
                >
                  Yes, Empty All
                </button>
              </div>
            </div>
          </Modal>
        </main>
      </div>
    </div>
  );
}