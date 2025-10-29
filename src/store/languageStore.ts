import { create } from 'zustand';

type LanguageStore = {
    lang: string;
    setLang: (lang: string) => void;
};

export const useLanguageStore = create<LanguageStore>((set) => ({
    lang: 'en',
    setLang: (lang) => set({ lang }),
}));
