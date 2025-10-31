import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Suspense } from 'react';
import { routes } from './pages/routes';
import NotFound from './pages/not-found';
import ProtectedRoute from '@/components/common/ProtectedRoute';
import Layout from '@/pages/layout';

export default function App() {
    return (
        <Router>
            <Layout>
                <Suspense fallback={<div>Chargement...</div>}>
                    <Routes>
                        {routes.map((route) => {
                            const element = route.protected ? (
                                <ProtectedRoute>
                                    <route.component></route.component>
                                </ProtectedRoute>
                            ) : (
                                <route.component />
                            );

                            return <Route key={route.id} path={route.path} element={element} />;
                        })}
                        <Route path='*' element={<NotFound />} />
                    </Routes>
                </Suspense>
            </Layout>
        </Router>
    );
}
