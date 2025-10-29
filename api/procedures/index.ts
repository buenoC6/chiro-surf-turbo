import axiosInstance from '@/api/axiosInstance';
import { useQuery } from '@tanstack/react-query';
import { config } from '@/api/config';
import { ProceduresDropdownBody, ProceduresDropdownResponse } from '@/api/procedures/types';

const PROCEDURES_DROPDOWN_URL = `${process.env.NEXT_PUBLIC_BASE_API_URL}/api/Procedure/Dropdown`;

export const fetchProceduresDropdown = async (
    body: ProceduresDropdownBody,
    signal?: AbortSignal,
): Promise<ProceduresDropdownResponse[]> => {
    const response = await axiosInstance.post(PROCEDURES_DROPDOWN_URL, body, { signal });

    if (response.status !== 200) {
        throw new Error('Failed to fetch procedures dropdown.');
    }
    return response.data as ProceduresDropdownResponse[];
};

export const useGetProceduresDropdown = (body: ProceduresDropdownBody | null) => {
    const key = ['procedures-dropdown', body ? JSON.stringify(body) : null];

    return useQuery<ProceduresDropdownResponse[], Error>({
        queryKey: key,
        queryFn: ({ signal }) => {
            if (!body) throw new Error('No request body');
            return fetchProceduresDropdown(body, signal);
        },
        enabled: Boolean(body),
        ...config,
    });
};
