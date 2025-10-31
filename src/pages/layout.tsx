'use client';

import { ReactNode, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AuthProvider } from '@/context/AuthProvider';
import { LoadingProvider } from '@/context/LoadingProvider';
import { ErrorBoundary } from '@/components/common/ErrorBoundary';

export default function Layout({ children }: { children: ReactNode }) {
    return (
        <AuthProvider>
            <LoadingProvider>
                <ErrorBoundary>
                    <div className='page' style={{ minHeight: '100dvh', display: 'flex', flexDirection: 'column' }}>
                        <SiteHeader />
                        <main style={{ flex: 1, width: '100%' }}>{children}</main>
                        <SiteFooter />
                    </div>
                </ErrorBoundary>
            </LoadingProvider>
        </AuthProvider>
    );
}

function SiteHeader() {
    const [theme, setTheme] = useState<'light' | 'dark'>('dark');

    useEffect(() => {
        // Charger le thème enregistré ou préférences système
        const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
        if (savedTheme) {
            setTheme(savedTheme);
            document.documentElement.setAttribute('data-theme', savedTheme);
        } else {
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            const initial = prefersDark ? 'dark' : 'light';
            setTheme(initial);
            document.documentElement.setAttribute('data-theme', initial);
        }
    }, []);

    const toggleTheme = () => {
        const newTheme = theme === 'dark' ? 'light' : 'dark';
        setTheme(newTheme);
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
    };

    return (
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 0' }}>
            <div>
                <Link to='/' style={{ textDecoration: 'none', color: 'inherit' }}>
                    <strong style={{ color: 'var(--primary-800)' }}>Chironium</strong>
                </Link>
            </div>

            {/* Bouton light/dark */}
            <button
                onClick={toggleTheme}
                style={{
                    padding: '0.5rem 1rem',
                    borderRadius: '0.25rem',
                    border: '1px solid var(--surface-500)',
                    backgroundColor: 'var(--surface-200)',
                    cursor: 'pointer',
                }}
            >
                {theme === 'dark' ? '☀️ Light' : '🌙 Dark'}
            </button>
        </header>
    );
}

function SiteFooter() {
    const year = new Date().getFullYear();
    return (
        <footer style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem 0' }}>
            <span>© {year} Chironium</span>
            <span>Fait avec ❤</span>
        </footer>
    );
}

function NavLink({ to, children }: { to: string; children: ReactNode }) {
    return (
        <Link
            to={to}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--primary-100)')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
            style={{ padding: '0.25rem 0.5rem', borderRadius: '0.25rem' }}
        >
            {children}
        </Link>
    );
}
