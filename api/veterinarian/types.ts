import { ExerciseType } from '@/api/publicApiClient';

export interface PaginatedVetsRequestBody {
    pageSize: number;
    pageNumber: number;
    search?: string;
    animalIds?: number[];
    procedureIds?: number[];
    address?: string;
    lat?: number | null;
    long?: number | null;
    languages?: string[];
    isEmergency?: boolean;
    exerciseType?: ExerciseType;
}

export interface PaginatedVetsResponse {
    result: Veterinarian[];
    totalItem: number;
}

export interface Veterinarian {
    id: number;
    firstName: string;
    lastName: string;
    officeName?: string;
    email: string;
    phone: string;
    addresses: {
        street: string;
        streetNumber: string;
        city: string;
        zipCode: string;
        countryCode: string;
        box: string;
        isCompleted: boolean;
    };
    animalNames: string[];
    procedureNames: string[];
    distance: number;
    exerciseType: number;
    profileImageUrl: string;
}

export interface VetMapResponse {
    id: number;
    firstName: string;
    lastName: string;
    officeName?: string;
    phone: string;
    latitude: number;
    longitude: number;
    distance?: number;
    animalNames: string[];
    procedureNames: string[];
}

export interface PaginatedVetMapResponse {
    result: VetMapResponse[];
    totalItem: number;
}
