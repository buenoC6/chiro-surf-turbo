'use client';

import { createContext, useMemo } from 'react';
import { useAuthContext } from '@/providers/AuthProvider';

type LoadingContextType = object;

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

export const LoadingProvider = ({ children }: { children: React.ReactNode }) => {
    const { loading: auth, user } = useAuthContext();

    const content = useMemo(() => {
        return <>{children}</>;
    }, [children]);

    // if (auth) {
    //     return <Loader />;
    // }

    return <LoadingContext.Provider value={{}}>{content}</LoadingContext.Provider>;
};
