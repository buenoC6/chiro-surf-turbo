import { Navigate } from 'react-router-dom';
import { JSX } from 'react';
import { useAuth } from '@/context/AuthProvider';

export default function ProtectedRoute({ children }: { children: JSX.Element }) {
    const { user } = useAuth();
    if (!user?.id) return <Navigate to='/login' replace />;
    return children;
}
