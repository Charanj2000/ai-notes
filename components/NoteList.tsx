"use client";

import { useNotesStore } from "@/lib/store";
import type { Note } from "@/lib/types";

const NoteList = () => {
  const { notes, activeNoteId, setActiveNote, deleteNote } = useNotesStore();

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  if (notes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-3 p-6">
        <div className="w-12 h-12 rounded-xl bg-indigo-500/10 flex items-center justify-center">
          <span className="text-2xl">✦</span>
        </div>
        <p className="text-slate-400 text-sm text-center">
          No notes yet. Create your first note!
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-1 p-3 overflow-y-auto h-full">
      {notes.map((note: Note) => (
        <div
          key={note.id}
          onClick={() => setActiveNote(note.id)}
          className={`group relative p-3 rounded-xl cursor-pointer transition-all duration-200 ${
            activeNoteId === note.id
              ? "bg-indigo-500/15 border border-indigo-500/30"
              : "hover:bg-white/3 border border-transparent"
          }`}
        >
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <h3
                className={`text-sm font-medium truncate ${
                  activeNoteId === note.id
                    ? "text-indigo-300"
                    : "text-slate-200"
                }`}
              >
                {note.title || "Untitled Note"}
              </h3>
              <p className="text-xs text-slate-500 mt-1 truncate">
                {note.content || "Empty note..."}
              </p>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-xs text-slate-600">
                  {formatDate(note.updatedAt)}
                </span>
                {note.tags.length > 0 && (
                  <div className="flex gap-1">
                    {note.tags.slice(0, 2).map((tag) => (
                      <span
                        key={tag}
                        className="text-xs bg-indigo-500/10 text-indigo-400 px-1.5 py-0.5 rounded"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                deleteNote(note.id);
              }}
              className="opacity-0 group-hover:opacity-100 text-slate-500 hover:text-red-400 transition-all text-xs p-1"
            >
              ✕
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default NoteList;
