import axiosInstance from '@/api/axiosInstance';
import { useQuery } from '@tanstack/react-query';
import { config } from '@/api/config';
import { AutocompleteAddressResponse, JawgFeature } from '@/api/autocomplete/types';

const AUTOCOMPLETE_ADDRESS_URL = `${process.env.NEXT_PUBLIC_BASE_API_URL}/api/Public/Autocomplete`;
const JAWG_AUTOCOMPLETE_ADDRESS_URL = `https://api.jawg.io/places/v1`;

const COUNTRY_TRANSLATIONS: Record<string, Record<string, string>> = {
    BE: {
        fr: 'Belgique',
        nl: 'België',
        en: 'Belgium',
    },
    FR: {
        fr: 'France',
        nl: 'Frankrijk',
        en: 'France',
    },
};

export const fetchAutocompleteAddress = async (
    address?: string,
    signal?: AbortSignal,
): Promise<AutocompleteAddressResponse[]> => {
    const response = await axiosInstance.get(`${AUTOCOMPLETE_ADDRESS_URL}?input=${address}&country=BE`, { signal });

    if (response.status !== 200) {
        throw new Error('Failed to fetch autocompleted address.');
    }
    return response.data as AutocompleteAddressResponse[];
};

export const fetchJawgReverse = async (
    lat: number,
    lon: number,
    locale: string,
): Promise<AutocompleteAddressResponse> => {
    const response = await axiosInstance.get(
        `${JAWG_AUTOCOMPLETE_ADDRESS_URL}/reverse?point.lat=${lat}&point.lon=${lon}&lang=${locale}&access-token=${process.env.NEXT_PUBLIC_JAWG_TOKEN}`,
    );

    if (response.status !== 200) {
        throw new Error('Failed to fetch reverse geocoding.');
    }

    const f = response.data.features[0];
    const p = f.properties;

    return {
        placeId: p.id,
        street: p.street,
        number: p.housenumber,
        city: p.locality || p.localadmin || p.county,
        country: p.country,
        fullAddress: p.label,
    };
};

const fetchJawgAutocomplete = async (
    value: string,
    locale: string,
    signal?: AbortSignal,
): Promise<AutocompleteAddressResponse[]> => {
    const response = await axiosInstance.get(
        `${JAWG_AUTOCOMPLETE_ADDRESS_URL}/search?text=${encodeURIComponent(value)}&boundary.country=BE,FR&lang=${locale}&access-token=${process.env.NEXT_PUBLIC_JAWG_TOKEN}`,
        { signal },
    );

    if (response.status !== 200) {
        throw new Error('Failed to fetch autocompleted address.');
    }

    const mapped = response.data.features.map((f: JawgFeature) => {
        const p = f.properties;

        const isAddress = p.layer === 'address';
        const isStreet = p.layer === 'street';
        const isLocality = p.layer === 'locality';

        const street = isAddress ? p.street : isStreet ? p.name : undefined;
        const number = isAddress ? p.housenumber : undefined;
        const city = p.locality || p.localadmin || p.county || undefined;
        const region = p.region && !p.region_a?.match(/^[A-Z]{2,3}$/) ? p.region : undefined;

        const countryCode = p.country_code?.toUpperCase();
        const country =
            countryCode && COUNTRY_TRANSLATIONS[countryCode]?.[locale]
                ? COUNTRY_TRANSLATIONS[countryCode][locale]
                : p.country;

        let fullAddress: string;
        if (isAddress) {
            fullAddress = [street, number, city, country].filter(Boolean).join(', ');
        } else if (isLocality) {
            fullAddress = [city, region, country].filter(Boolean).join(', ');
        } else {
            fullAddress = p.label;
        }

        return {
            placeId: p.id,
            street,
            number,
            city,
            country,
            fullAddress,
        } as AutocompleteAddressResponse;
    });

    return mapped.filter(
        (v: AutocompleteAddressResponse, i: number, self: AutocompleteAddressResponse[]) =>
            i === self.findIndex((t) => t.fullAddress === v.fullAddress),
    );
};

export const useGetAutocompleteAddress = (locale: string, address?: string) => {
    const key = ['autocomplete-address', address];

    return useQuery<AutocompleteAddressResponse[], Error>({
        queryKey: key,
        queryFn: ({ signal }) => fetchJawgAutocomplete(address!, locale, signal),
        enabled: Boolean(address),
        ...config,
    });
};
