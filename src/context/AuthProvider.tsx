'use client';

import { createContext, FC, ReactNode, useContext, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { mockService } from '@/lib/mockService';

interface User {
    id?: string;
    email?: string;
    role?: string;
}

interface AuthContextType {
    user: User | null;
    loading: boolean;
    loginWithGoogle: () => Promise<void>;
    loginWithEmail: (email: string, password: string) => Promise<void>;
    registerWithEmail: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    // Récupération de la session existante au montage
    useEffect(() => {
        const fetchUser = async () => {
            setLoading(true);
            try {
                if (mockService.isEnabled) {
                    console.log("📢 Mode localhost: utilisation d'un token mocké");
                    // Exemple de user mocké
                    setUser({ id: 'mock-id', email: 'mock@example.com', role: 'user' });
                } else {
                    const { data } = await supabase.auth.getSession();
                    setUser(data.session?.user ?? null);
                }
            } catch (error) {
                console.error('Erreur récupération du token', error);
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        fetchUser();

        const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
        });

        return () => {
            listener.subscription.unsubscribe();
        };
    }, []);

    const loginWithGoogle = async () => {
        setLoading(true);
        try {
            const { error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: { redirectTo: 'https://localhost:3000/' },
            });
            if (error) throw error;
        } finally {
            setLoading(false);
        }
    };

    const loginWithEmail = async (email: string, password: string) => {
        setLoading(true);
        try {
            const { error } = await supabase.auth.signInWithPassword({ email, password });
            if (error) throw error;

            const { data: sessionData } = await supabase.auth.getSession();
            setUser(sessionData.session?.user ?? null);
        } finally {
            setLoading(false);
        }
    };

    const registerWithEmail = async (email: string, password: string) => {
        setLoading(true);
        try {
            const { data, error } = await supabase.auth.signUp({
                email,
                password,
                options: { emailRedirectTo: 'http://localhost:3000/confirm-email' },
            });
            if (error) throw error;
            setUser(data?.user ?? null);
        } finally {
            setLoading(false);
        }
    };

    const logout = async () => {
        setLoading(true);
        try {
            await supabase.auth.signOut();
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthContext.Provider value={{ user, loading, loginWithGoogle, loginWithEmail, registerWithEmail, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth doit être utilisé dans AuthProvider');
    return context;
};
