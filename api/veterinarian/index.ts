import axiosInstance from '@/api/axiosInstance';
import { useQuery, QueryClient, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import { config } from '@/api/config';
import { PaginatedVetsRequestBody, PaginatedVetsResponse, PaginatedVetMapResponse } from '@/api/veterinarian/types';
import { VetClient, GetVetPublicProfileResponse } from '@/api/publicApiClient';

const VETS_URL = `${process.env.NEXT_PUBLIC_BASE_API_URL}/api/Vet/GetVets`;
const VETS_MAP_URL = `${process.env.NEXT_PUBLIC_BASE_API_URL}/api/Vet/GetVetMapPublic`;
const VET_AVAILABILITY_URL = `${process.env.NEXT_PUBLIC_BASE_API_URL}/api/Vet/GetImmediateAvailability`;

export const fetchPaginatedVeterinarians = async (
    body: PaginatedVetsRequestBody,
    signal?: AbortSignal,
): Promise<PaginatedVetsResponse> => {
    const response = await axiosInstance.post(VETS_URL, body, { signal });

    if (response.status !== 200) {
        throw new Error('Failed to fetch veterinarians.');
    }
    return response.data as PaginatedVetsResponse;
};

export const fetchVeterinariansForMap = async (
    body: PaginatedVetsRequestBody,
    signal?: AbortSignal,
): Promise<PaginatedVetMapResponse> => {
    const response = await axiosInstance.post(VETS_MAP_URL, body, { signal });

    if (response.status !== 200) {
        throw new Error('Failed to fetch veterinarians for map.');
    }
    return response.data as PaginatedVetMapResponse;
};

export const fetchImmediateAvailabilityByVetId = async (
    vetId?: number | null,
): Promise<{
    immediateAvailability: 1;
    hasPauseActive: false;
}> => {
    if (!vetId) throw new Error('VetId is required to get vet immediate availability');

    const response = await axiosInstance.get(`${VET_AVAILABILITY_URL}?vetId=${vetId}`);

    if (response.status !== 200) {
        throw new Error('Failed to fetch veterinarian availability.');
    }
    return response.data;
};

export const fetchVetPublicProfile = async (vetId: number): Promise<GetVetPublicProfileResponse> => {
    try {
        // Appel direct à l'API pour contourner le client généré défaillant
        const apiUrl = `${process.env.NEXT_PUBLIC_BASE_API_URL}/api/Vet/GetVetPublicProfile/${vetId}`;
        console.log('🔧 Direct API call to:', apiUrl);

        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error(`API call failed: ${response.status}`);
        }

        const vetData = await response.json();
        console.log('🔧 Raw API response:', vetData);

        // Créer une réponse formatée avec les vraies données
        const adaptedResponse = new GetVetPublicProfileResponse({
            isT0: true,
            isT1: false,
            asT0: vetData, // Les vraies données du vétérinaire
            asT1: undefined,
            value: vetData,
            index: 0,
        });

        console.log('✅ Adapted response:', adaptedResponse);
        console.log('✅ asT0 data:', adaptedResponse.asT0);
        return adaptedResponse;
    } catch (error) {
        console.error('❌ API call failed:', error);

        // En cas d'erreur, retourner une réponse d'erreur
        return new GetVetPublicProfileResponse({
            isT0: false,
            isT1: true,
            asT0: undefined,
            asT1: { message: 'Error fetching vet profile' } as never,
            value: undefined,
            index: 1,
        });
    }
};

export const useGetPaginatedVeterinarians = (body: PaginatedVetsRequestBody | null) => {
    const key = ['paginated-veterinarians', body ? JSON.stringify(body) : null];

    return useQuery<PaginatedVetsResponse, Error>({
        queryKey: key,
        queryFn: ({ signal }) => {
            if (!body) throw new Error('No request body');
            return fetchPaginatedVeterinarians(body, signal);
        },
        enabled: Boolean(body),
        placeholderData: keepPreviousData,
        ...config,
    });
};

export const useGetVeterinariansForMap = (body: PaginatedVetsRequestBody | null) => {
    const key = ['veterinarians-map1', body ? JSON.stringify(body) : null];

    return useQuery<PaginatedVetMapResponse, Error>({
        queryKey: key,
        queryFn: ({ signal }) => {
            if (!body) throw new Error('No request body');
            return fetchVeterinariansForMap(body, signal);
        },
        enabled: Boolean(body),
        ...config,
    });
};

export const useGetImmediateAvailability = (vetId?: number | null) => {
    const key = ['immediate-availability', vetId];

    return useQuery<
        {
            immediateAvailability: 1;
            hasPauseActive: false;
        },
        Error
    >({
        queryKey: key,
        queryFn: () => fetchImmediateAvailabilityByVetId(vetId),
        enabled: Boolean(vetId),
        ...config,
    });
};

export const useGetVetPublicProfile = (vetId?: number | null) => {
    const key = ['vet-public-profile', vetId];

    return useQuery<GetVetPublicProfileResponse, Error>({
        queryKey: key,
        queryFn: () => {
            if (!vetId) throw new Error('VetId is required');
            return fetchVetPublicProfile(vetId);
        },
        enabled: Boolean(vetId),
        ...config,
    });
};
