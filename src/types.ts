export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface GeneratedCode {
  html: string;
  title: string;
}

export type PreviewTab = 'preview' | 'code';
export type Theme = 'dark' | 'light';
