"use client";

import { useState, useEffect, useRef } from "react";
import { useNotesStore } from "@/lib/store";

const NoteEditor = () => {
  const { notes, activeNoteId, updateNote } = useNotesStore();
  const activeNote = notes.find((n) => n.id === activeNoteId);
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [isTagging, setIsTagging] = useState(false);
  const titleRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (activeNote && titleRef.current) {
      titleRef.current.value = activeNote.title;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeNoteId]);

  if (!activeNote) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4">
        <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 flex items-center justify-center">
          <span className="text-3xl">✦</span>
        </div>
        <div className="text-center">
          <h2 className="text-slate-300 font-medium">No note selected</h2>
          <p className="text-slate-500 text-sm mt-1">
            Create a new note or select one from the sidebar
          </p>
        </div>
      </div>
    );
  }

  const handleSummarize = async () => {
    if (!activeNote.content || activeNote.content.length < 10) return;
    setIsSummarizing(true);
    try {
      const res = await fetch("/api/summarize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: activeNote.content }),
      });
      const data = await res.json();
      if (data.summary) {
        updateNote(activeNote.id, { summary: data.summary });
      }
    } finally {
      setIsSummarizing(false);
    }
  };

  const handleGenerateTags = async () => {
    if (!activeNote.content || activeNote.content.length < 10) return;
    setIsTagging(true);
    try {
      const res = await fetch("/api/tags", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: activeNote.content }),
      });
      const data = await res.json();
      if (data.tags) {
        updateNote(activeNote.id, { tags: data.tags });
      }
    } finally {
      setIsTagging(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
        <input
          ref={titleRef}
          defaultValue={activeNote.title}
          onChange={(e) => updateNote(activeNote.id, { title: e.target.value })}
          className="bg-transparent text-xl font-semibold text-slate-100 outline-none placeholder-slate-600 flex-1"
          placeholder="Note title..."
        />
        <div className="flex items-center gap-2">
          <button
            onClick={handleGenerateTags}
            disabled={isTagging}
            className="px-3 py-1.5 rounded-lg text-xs font-medium glass text-slate-300 hover:text-white hover:border-indigo-500/50 transition-all disabled:opacity-50"
          >
            {isTagging ? "..." : "# Tags"}
          </button>
          <button
            onClick={handleSummarize}
            disabled={isSummarizing}
            className="px-3 py-1.5 rounded-lg text-xs font-medium bg-indigo-500/20 text-indigo-300 hover:bg-indigo-500/30 transition-all disabled:opacity-50"
          >
            {isSummarizing ? "Summarizing..." : "✦ Summarize"}
          </button>
        </div>
      </div>

      {activeNote.tags.length > 0 && (
        <div className="flex gap-2 px-6 py-2 border-b border-white/5 flex-wrap">
          {activeNote.tags.map((tag) => (
            <span
              key={tag}
              className="text-xs bg-indigo-500/10 text-indigo-400 px-2 py-1 rounded-lg"
            >
              # {tag}
            </span>
          ))}
        </div>
      )}

      {activeNote.summary && (
        <div className="mx-6 mt-4 p-4 rounded-xl bg-indigo-500/5 border border-indigo-500/20">
          <p className="text-xs text-indigo-400 font-medium mb-1">
            ✦ AI Summary
          </p>
          <p className="text-sm text-slate-300 leading-relaxed">
            {activeNote.summary}
          </p>
        </div>
      )}

      <textarea
        value={activeNote.content}
        onChange={(e) => updateNote(activeNote.id, { content: e.target.value })}
        placeholder="Start writing your note..."
        className="flex-1 bg-transparent text-slate-300 outline-none resize-none px-6 py-4 text-sm leading-relaxed placeholder-slate-600"
      />
    </div>
  );
};

export default NoteEditor;
