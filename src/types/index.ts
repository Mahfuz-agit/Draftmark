export interface DocumentItem {
  id: string;
  title: string;
  content: string;
  createdAt: number;
  updatedAt: number;
}

export type ViewMode = 'edit' | 'split' | 'preview';

export type ThemeMode = 'light' | 'dark' | 'sepia';

export interface AppSettings {
  theme: ThemeMode;
  viewMode: ViewMode;
  sidebarOpen: boolean;
  activeTab: 'documents' | 'outline';
}

export interface DocumentStats {
  words: number;
  characters: number;
  charactersNoSpaces: number;
  lines: number;
  readingTimeMinutes: number;
}

export interface OutlineItem {
  id: string;
  text: string;
  level: number;
}