export const isDevWithMock = () =>
    window.location.hostname.includes('localhost') && process.env.NODE_ENV === 'development';

export const mockService = {
    get isEnabled() {
        return false;
        // return isDevWithMock();
    },
    get: <T>(mockData: T): Promise<T> => Promise.resolve(mockData),
    update: <T>(mockData: T): Promise<T> => Promise.resolve(mockData),
    delete: <T>(mockData: T): Promise<T> => Promise.resolve(mockData),
};
