import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Note, Message } from './types';

interface NotesStore {
  notes: Note[];
  activeNoteId: string | null;
  messages: Message[];
  isChatOpen: boolean;

  addNote: () => void;
  updateNote: (id: string, updates: Partial<Note>) => void;
  deleteNote: (id: string) => void;
  setActiveNote: (id: string) => void;
  addMessage: (message: Message) => void;
  clearMessages: () => void;
  toggleChat: () => void;
}

export const useNotesStore = create<NotesStore>()(
  persist(
    (set) => ({
      notes: [],
      activeNoteId: null,
      messages: [],
      isChatOpen: false,

      addNote: () => {
        const newNote: Note = {
          id: crypto.randomUUID(),
          title: 'Untitled Note',
          content: '',
          tags: [],
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        set(state => ({
          notes: [newNote, ...state.notes],
          activeNoteId: newNote.id,
        }));
      },

      updateNote: (id, updates) => {
        set(state => ({
          notes: state.notes.map(note =>
            note.id === id
              ? { ...note, ...updates, updatedAt: new Date() }
              : note
          ),
        }));
      },

      deleteNote: (id) => {
        set(state => {
          const remaining = state.notes.filter(n => n.id !== id);
          return {
            notes: remaining,
            activeNoteId: remaining.length > 0 ? remaining[0].id : null,
          };
        });
      },

      setActiveNote: (id) => set({ activeNoteId: id }),
      addMessage: (message) => set(state => ({ messages: [...state.messages, message] })),
      clearMessages: () => set({ messages: [] }),
      toggleChat: () => set(state => ({ isChatOpen: !state.isChatOpen })),
    }),
    {
      name: 'ai-notes-storage',
    }
  )
);