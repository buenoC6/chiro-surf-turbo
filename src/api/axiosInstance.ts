import axios from 'axios';

export const axiosSupabaseInstance = axios.create({
    baseURL: import.meta.env.VITE_SUPABASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

axiosSupabaseInstance.interceptors.request.use(
    async (config) => {
        config.headers['Accept-Language'] = 'fr';
        return config;
    },
    (error) => {
        return Promise.reject(error);
    },
);
