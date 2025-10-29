import axios from 'axios';
import { useLanguageStore } from '@/store/languageStore';

const baseURL = process.env.NEXT_PUBLIC_BASE_API_URL;

export const axiosInstance = axios.create({
    baseURL: baseURL,
    headers: {
        'Content-Type': 'application/json',
    },
});

axiosInstance.interceptors.request.use(
    async (config) => {
        const lang = useLanguageStore.getState().lang ?? 'fr';
        config.headers['Accept-Language'] = lang ?? 'fr';
        return config;
    },
    (error) => {
        return Promise.reject(error);
    },
);

export default axiosInstance;
