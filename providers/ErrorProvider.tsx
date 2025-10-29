'use client';
import React, { createContext, useCallback, useContext, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { usePathname } from 'next/navigation';

export type ErrorStrategy = 'page' | 'toast' | 'silent';

export type ReportMeta = {
    code?: string;
    scope?: string;
    tags?: string[];
    extras?: Record<string, unknown>;
};

export type ReportOptions = {
    strategy?: ErrorStrategy;
    message?: string;
    meta?: ReportMeta;
};

type ErrorContextType = {
    report: (error: unknown, options?: ReportOptions) => void;
    reportToast: (error: unknown, message?: string, meta?: ReportMeta) => void;
    reportPage: (error: unknown, meta?: ReportMeta) => void;
    reportSilent: (error: unknown, meta?: ReportMeta) => void;
};

type ErrorProviderProps = {
    children: React.ReactNode;
    errorPagePath?: string;
    onToast?: (message: string) => void;
    onLog?: (payload: { error: unknown; meta?: ReportMeta; strategy?: ErrorStrategy }) => void;
};

const ErrorContext = createContext<ErrorContextType | undefined>(undefined);

export const ErrorProvider = ({ children, errorPagePath = '/global-error', onToast, onLog }: ErrorProviderProps) => {
    const pathname = usePathname();
    const router = useRouter();

    const normalizedMessage = (error: unknown, fallback = 'Une erreur est survenue.') => {
        if (typeof error === 'string') return error;
        if (error instanceof Error) return error.message || fallback;
        return fallback;
    };

    const log = useCallback(
        (error: unknown, meta?: ReportMeta, strategy?: ErrorStrategy) => {
            try {
                if (onLog) onLog({ error, meta, strategy });
            } catch {
            }
        },
        [onLog],
    );

    useEffect(() => {
        const onWindowError = (event: ErrorEvent) => {
            log(event.error ?? event.message ?? 'window.onerror', { scope: 'window' }, 'silent');
        };
        const onUnhandledRejection = (event: PromiseRejectionEvent) => {
            log(event.reason ?? 'unhandledrejection', { scope: 'promise' }, 'silent');
        };

        window.addEventListener('error', onWindowError);
        window.addEventListener('unhandledrejection', onUnhandledRejection);
        return () => {
            window.removeEventListener('error', onWindowError);
            window.removeEventListener('unhandledrejection', onUnhandledRejection);
        };
    }, [log]);

    const reportToast = useCallback(
        (error: unknown, message?: string, meta?: ReportMeta) => {
            log(error, meta, 'toast');
            const msg = message ?? normalizedMessage(error);
            if (onToast) onToast(msg);
            else console.error('[toast]', msg, { meta, error });
            if (!(error instanceof Error)) {
                try {
                } catch {}
            }
        },
        [log, onToast],
    );

    const reportPage = useCallback(
        (error: unknown, meta?: ReportMeta) => {
            log(error, meta, 'page');
            if (pathname?.startsWith(errorPagePath)) return;
            const query = new URLSearchParams({
                code: meta?.code ?? 'UNKNOWN',
                scope: meta?.scope ?? '',
            }).toString();
            router.push(`${errorPagePath}?${query}`);
        },
        [log, router, errorPagePath, pathname],
    );

    const reportSilent = useCallback(
        (error: unknown, meta?: ReportMeta) => {
            log(error, meta, 'silent');
        },
        [log],
    );

    const report = useCallback(
        (error: unknown, options?: ReportOptions) => {
            const strategy = options?.strategy ?? 'toast';
            const { meta, message } = options ?? {};
            switch (strategy) {
                case 'page':
                    reportPage(error, meta);
                    break;
                case 'silent':
                    reportSilent(error, meta);
                    break;
                case 'toast':
                default:
                    reportToast(error, message, meta);
                    break;
            }
        },
        [reportPage, reportSilent, reportToast],
    );

    const value = useMemo<ErrorContextType>(
        () => ({ report, reportToast, reportPage, reportSilent }),
        [report, reportToast, reportPage, reportSilent],
    );

    return <ErrorContext.Provider value={value}>{children}</ErrorContext.Provider>;
};

export const useError = () => {
    const ctx = useContext(ErrorContext);
    if (!ctx) throw new Error('useError doit être utilisé dans un ErrorProvider');
    return ctx;
};

type BoundaryProps = {
    children: React.ReactNode;
    mode?: ErrorStrategy;
    meta?: ReportMeta;
    fallback?: React.ReactNode;
};

class BoundaryClass extends React.Component<
    BoundaryProps & { onCaught: (error: unknown) => void },
    { hasError: boolean }
> {
    constructor(props: BoundaryProps & { onCaught: (error: unknown) => void }) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError() {
        return { hasError: true };
    }

    componentDidCatch(error: unknown) {
        this.props.onCaught(error);
    }

    render() {
        if (this.state.hasError) {
            return this.props.fallback ?? null;
        }
        return this.props.children;
    }
}

export const ErrorBoundary = (props: BoundaryProps & { resetKey?: string }) => {
    const { report } = useError();
    const { mode = 'silent', meta, fallback, children, resetKey } = props;
    const onCaught = (error: unknown) => report(error, { strategy: mode, meta });
    return (
        <BoundaryClass key={resetKey} onCaught={onCaught} mode={mode} meta={meta} fallback={fallback}>
            {children}
        </BoundaryClass>
    );
};
