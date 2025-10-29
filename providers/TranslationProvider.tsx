'use client';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useLanguageStore } from '@/store/languageStore';

interface TranslationContextProps {
    t: (key: string) => string;
    language: string;
    setLanguage: (lang: string) => void;
}

interface TranslationProviderProps {
    children: React.ReactNode;
    defaultTranslations?: Record<string, string>;
    defaultLanguage?: string;
}

const TranslationContext = createContext<TranslationContextProps>({
    t: (key) => key,
    language: 'en',
    setLanguage: () => {},
});

export const TranslationProvider = ({
    children,
    defaultTranslations = {},
    defaultLanguage = 'en',
}: TranslationProviderProps) => {
    const [translations, setTranslations] = useState<Record<string, string>>(defaultTranslations);
    const [language, setLanguage] = useState(defaultLanguage);
    const { setLang } = useLanguageStore();

    useEffect(() => {
        setLang(language);
    }, [language]);

    useEffect(() => {
        const loadTranslations = async () => {
            if (process.env.NODE_ENV === 'development') {
                try {
                    const res = await fetch(`/api/translations?locale=${language}`);
                    if (!res.ok) throw new Error('Strapi fetch failed');
                    const data = await res.json();
                    setTranslations(data);
                } catch (err) {
                    console.warn('Strapi offline or fetch failed, using local JSON', err);
                    setTranslations(defaultTranslations);
                }
            }
        };

        loadTranslations();
    }, [language, defaultTranslations]);

    const t = (key: string) => translations[key] ?? key;

    return <TranslationContext.Provider value={{ t, language, setLanguage }}>{children}</TranslationContext.Provider>;
};

export const useTranslation = () => useContext(TranslationContext);
