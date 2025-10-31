import Home from './page';
import Login from './login/page';
import { FC } from 'react';
import Dashboard from '@/pages/dashboard/page';
import Register from '@/pages/register/page';
import ConfirmEmail from '@/pages/confirm/page';

export interface AppRoute {
    id: string;
    path: string;
    component: FC;
    protected?: boolean;
}

export const routes = [
    {
        path: '/',
        id: 'home',
        component: Home,
        protected: true,
    },
    {
        path: '/dashboard',
        id: 'dashboard',
        component: Dashboard,
        protected: true,
    },
    {
        path: '/login',
        id: 'login',
        component: Login,
        protected: false,
    },
    {
        path: '/register',
        id: 'register',
        component: Register,
        protected: false,
    },
    {
        path: '/confirm-email',
        id: 'confirm-email',
        component: ConfirmEmail,
        protected: false,
    },
];
