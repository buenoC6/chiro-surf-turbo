export interface AutocompleteAddressResponse {
    placeId?: string;
    street?: string;
    number?: string;
    city?: string;
    country?: string;
    fullAddress: string;
}

export interface JawgFeature {
    type: 'Feature';
    geometry: {
        type: 'Point' | 'Polygon' | string;
        coordinates: [number, number] | number[][];
    };
    bbox?: [number, number, number, number];
    properties: {
        id: string;
        gid: string;
        layer: string;
        label: string;
        accuracy?: string;
        match_type?: string;
        country: string;
        country_a: string;
        country_code: string;
        region?: string;
        region_a?: string;
        county?: string;
        county_gid?: string;
        locality?: string;
        locality_gid?: string;
        localadmin?: string;
        localadmin_gid?: string;
        macroregion?: string;
        macroregion_a?: string;
        macroregion_gid?: string;
        source?: string;
        source_id?: string;
        confidence?: number;
        street?: string;
        housenumber?: number;
        name?: string;
    };
}

export interface JawgSearchResponse {
    type: string;
    features: JawgFeature[];
}
