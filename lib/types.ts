export interface Note {
  id: string;
  title: string;
  content: string;
  summary?: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Message {
  role: 'user' | 'assistant';
  content: string;
}