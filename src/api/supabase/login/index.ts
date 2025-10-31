import { useQuery } from '@tanstack/react-query';
import { mockService } from '@/lib/mockService';

const fetchUser = async (): Promise<any> => {
    // if (!id) throw new Error('ID requis pour récupérer le profil');

    if (mockService.isEnabled) {
        return mockService.get(null);
    }

    try {
    } catch (error: any) {
        if (error.response?.status === 401) {
            throw new Error('Non autorisé, veuillez vous reconnecter.');
        }
        if (error.response?.status === 403) {
            throw new Error('Accès refusé au user demandé.');
        }
        throw new Error('Impossible de récupérer les données du user.');
    }
};

export const useGetUser = () => {
    return useQuery({
        queryKey: ['user'],
        queryFn: () => fetchUser(),
        staleTime: 1000 * 60 * 10,
        retry: 1,
        refetchOnWindowFocus: false,
    });
};
