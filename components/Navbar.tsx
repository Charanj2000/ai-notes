"use client";

import { useNotesStore } from "@/lib/store";

const Navbar = () => {
  const { addNote, toggleChat, isChatOpen } = useNotesStore();

  return (
    <nav className="glass border-b border-white/5 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-indigo-500 flex items-center justify-center pulse-glow">
            <span className="text-white text-sm">✦</span>
          </div>
          <h1 className="text-lg font-semibold gradient-text">NoteAI</h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={toggleChat}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              isChatOpen
                ? "bg-indigo-500 text-white"
                : "glass text-slate-300 hover:text-white hover:border-indigo-500/50"
            }`}
          >
            {isChatOpen ? "✕ Close Chat" : "✦ Ask AI"}
          </button>
          <button
            onClick={addNote}
            className="px-4 py-2 rounded-lg text-sm font-medium bg-indigo-500 hover:bg-indigo-600 text-white transition-all duration-200 glow"
          >
            + New Note
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
