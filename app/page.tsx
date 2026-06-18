"use client";

import { useNotesStore } from "@/lib/store";
import NoteList from "@/components/NoteList";
import NoteEditor from "@/components/NoteEditor";
import ChatPanel from "@/components/ChatPanel";

export default function Home() {
  const { isChatOpen } = useNotesStore();

  return (
    <div className="flex h-[calc(100vh-64px)]">
      {/* Sidebar — Note List */}
      <aside className="w-64 flex-shrink-0 glass border-r border-white/5 flex flex-col">
        <div className="px-4 py-3 border-b border-white/5">
          <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">
            Notes
          </p>
        </div>
        <NoteList />
      </aside>

      {/* Main — Note Editor */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <NoteEditor />
      </main>

      {/* Right Panel — Chat */}
      {isChatOpen && (
        <aside className="w-80 flex-shrink-0 glass border-l border-white/5 flex flex-col">
          <ChatPanel />
        </aside>
      )}
    </div>
  );
}
