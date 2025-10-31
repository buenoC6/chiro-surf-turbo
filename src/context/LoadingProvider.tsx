'use client';

import { createContext, useMemo } from 'react';
import { useAuth } from '@/context/AuthProvider';
import { Loader } from 'lucide-react';

type LoadingContextType = object;

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

export const LoadingProvider = ({ children }: { children: React.ReactNode }) => {
    const { loading } = useAuth();

    const content = useMemo(() => {
        return <>{children}</>;
    }, [children]);

    if (loading) {
        return <Loader />;
    }

    return <LoadingContext.Provider value={{}}>{content}</LoadingContext.Provider>;
};
