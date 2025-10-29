import { VetClient } from './publicApiClient';

// Configuration du client API pour les vétérinaires
const baseUrl = process.env.NEXT_PUBLIC_BASE_API_URL || 'https://api.findyvet.be';

export const vetApiClient = new VetClient(baseUrl);

// Export des types pour faciliter l'utilisation
export type {
    GetVetsRequest,
    GetVetsResponse,
    GetVetMapPublicRequest,
    GetVetMapPublicResponse,
} from './publicApiClient';
