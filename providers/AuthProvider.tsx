'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { mockService } from '@/helpers/mockService';

type AuthContextType = {
    getTokens: (options?: { code: string }) => Promise<string | undefined>;
    user: unknown | undefined;
    loading: boolean;
    logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getTokens();
    }, []);

    const getTokens = async (): Promise<string | undefined> => {
        try {
            if (mockService.isEnabled) {
                console.log("📢 Mode localhost: utilisation d'un token mocké");
                return;
            }
        } catch (error) {
            console.warn('Erreur récupération du token', error);
            return;
        }
    };

    const logout = async () => {
        sessionStorage.clear();
    };

    return <AuthContext.Provider value={{ getTokens, user: null, loading, logout }}>{children}</AuthContext.Provider>;
};

export const useAuthContext = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth doit être utilisé dans AuthProvider');
    }
    return context;
};
