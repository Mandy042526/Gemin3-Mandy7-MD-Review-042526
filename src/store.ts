import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Language = 'en' | 'zh-TW';
export type Theme = 'light' | 'dark' | 'starry-night' | 'sunflowers' | 'mona-lisa' | 'scream' | 'persistence-of-memory' | 'girl-with-pearl-earring' | 'birth-of-venus' | 'creation-of-adam' | 'guernica' | 'kiss' | 'water-lilies' | 'night-watch' | 'las-meninas' | 'arnolfini-portrait' | 'school-of-athens' | 'wanderer' | 'impression-sunrise' | 'great-wave' | 'cafe-terrace' | 'american-gothic';

export interface AppState {
  language: Language;
  setLanguage: (lang: Language) => void;
  theme: Theme;
  setTheme: (theme: Theme) => void;
  apiKey: string;
  setApiKey: (key: string) => void;
  defaultModel: string;
  setDefaultModel: (model: string) => void;
  maxTokens: number;
  setMaxTokens: (tokens: number) => void;
  temperature: number;
  setTemperature: (temp: number) => void;
  runHistory: any[];
  addRunHistory: (run: any) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      language: 'zh-TW',
      setLanguage: (lang) => set({ language: lang }),
      theme: 'light',
      setTheme: (theme) => set({ theme }),
      apiKey: '',
      setApiKey: (key) => set({ apiKey: key }),
      defaultModel: 'gemini-2.5-flash',
      setDefaultModel: (model) => set({ defaultModel: model }),
      maxTokens: 12000,
      setMaxTokens: (tokens) => set({ maxTokens: tokens }),
      temperature: 0.7,
      setTemperature: (temp) => set({ temperature: temp }),
      runHistory: [],
      addRunHistory: (run) => set((state) => ({ runHistory: [run, ...state.runHistory] })),
    }),
    {
      name: 'app-storage',
    }
  )
);
