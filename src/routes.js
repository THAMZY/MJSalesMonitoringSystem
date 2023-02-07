import { Navigate, useRoutes } from 'react-router-dom';
import Cookies from 'js-cookie';
// layouts
import { useEffect, useState } from 'react';
import DashboardLayout from './layouts/dashboard';
import SimpleLayout from './layouts/simple';
//
import BlogPage from './pages/BlogPage';
import UserPage from './pages/UserPage';
import LoginPage from './pages/LoginPage';
import Page404 from './pages/Page404';
import ProductsPage from './pages/ProductsPage';
import DashboardAppPage from './pages/DashboardAppPage';
import UpdateChartPage from './pages/UpdateChartPage';

// ----------------------------------------------------------------------

export default function Router() {
  const routes = useRoutes([
    {
      path: '/dashboard',
      element: <DashboardLayout />,
      children:
        Cookies.get('MJSMS_user_acc') !== undefined && Cookies.get('MJSMS_user_acc') !== ''
          ? [
              { element: <Navigate to="/dashboard/app" />, index: true },
              { path: 'app', element: <DashboardAppPage /> },
              { path: 'update-chart', element: <UpdateChartPage /> },
              { path: 'user', element: <UserPage /> },
              { path: 'products', element: <ProductsPage /> },
              { path: 'blog', element: <BlogPage /> },
            ]
          : [
              { element: <Navigate to="/dashboard/app" />, index: true },
              { path: '*', element: <Navigate to="/login" replace /> },
            ],
    },
    {
      path: 'login',
      element:
        Cookies.get('MJSMS_user_acc') !== undefined && Cookies.get('MJSMS_user_acc') !== '' ? (
          <Navigate to="/dashboard/app" />
        ) : (
          <LoginPage />
        ),
    },
    {
      element: <SimpleLayout />,
      children: [
        { element: <Navigate to="/dashboard/app" />, index: true },
        { path: '404', element: <Page404 /> },
        { path: '*', element: <Navigate to="/404" /> },
      ],
    },
    {
      path: '*',
      element: <Navigate to="/404" replace />,
    },
  ]);

  return routes;
}
