import axiosInstance from '@/api/axiosInstance';
import { useQuery } from '@tanstack/react-query';
import { config } from '@/api/config';
import { AnimalsDropdownBody, AnimalsDropdownResponse } from '@/api/animals/types';

const ANIMAL_DROPDOWN_URL = `${process.env.NEXT_PUBLIC_BASE_API_URL}/api/Animals/Dropdown`;

export const fetchAnimalsDropdown = async (
    body: AnimalsDropdownBody,
    signal?: AbortSignal,
): Promise<AnimalsDropdownResponse[]> => {
    const response = await axiosInstance.post(ANIMAL_DROPDOWN_URL, body, { signal });

    if (response.status !== 200) {
        throw new Error('Failed to fetch animals dropdown.');
    }
    return response.data as AnimalsDropdownResponse[];
};

export const useGetAnimalsDropdown = (body: AnimalsDropdownBody | null) => {
    const key = ['animals-dropdown', body ? JSON.stringify(body) : null];

    return useQuery<AnimalsDropdownResponse[], Error>({
        queryKey: key,
        queryFn: ({ signal }) => {
            if (!body) throw new Error('No request body');
            return fetchAnimalsDropdown(body, signal);
        },
        enabled: Boolean(body),
        ...config,
    });
};
