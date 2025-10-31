import NotFound from '../../pages/not-found';

export function ErrorBoundary({ children }: { children: React.ReactNode }) {
    try {
        return <>{children}</>;
    } catch (e) {
        console.error('Routing error', e);
        return <NotFound />;
    }
}
