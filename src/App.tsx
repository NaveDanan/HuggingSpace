import React from 'react';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import { HomePage } from './pages/HomePage';
import { CreateSpacePage } from './pages/CreateSpace';
import { CreateModelPage } from './pages/CreateModelPage';
import { CreateDatasetPage } from './pages/CreateDatasetPage';
import { AuthPage } from './pages/AuthPage';
import { ViewProfilePage } from './pages/ViewProfilePage';
import { ModelsPage } from './pages/ModelsPage';
import { DatasetsPage } from './pages/DatasetsPage';
import { SpacesPage } from './pages/SpacesPage';
import { ContentPage } from './pages/ContentPage';
import { SettingsPage } from './pages/SettingsPage';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { ProtectedRoute } from './components/auth/ProtectedRoute';

const router = createBrowserRouter([
  {
    path: '/auth',
    element: <AuthPage />,
    loader: ({ request }) => {
      const url = new URL(request.url);
      return { next: url.searchParams.get('next') };
    }
  },
  {
    path: '/',
    element: <HomePage />
  },
  {
    path: '/create-space',
    element: <ProtectedRoute><CreateSpacePage /></ProtectedRoute>,
    loader: () => {
      return { returnTo: '/create-space' };
    }
  },
  {
    path: '/create-model',
    element: <ProtectedRoute><CreateModelPage /></ProtectedRoute>
  },
  {
    path: '/create-dataset',
    element: <ProtectedRoute><CreateDatasetPage /></ProtectedRoute>,
    loader: () => {
      return { returnTo: '/create-dataset' };
    }
  },
  {
    path: '/models',
    element: <ModelsPage />
  },
  {
    path: '/datasets',
    element: <DatasetsPage />
  },
  {
    path: '/spaces',
    element: <SpacesPage />
  },
  {
    path: '/models/:username/:slug',
    element: <ContentPage type="model" />
  },
  {
    path: '/datasets/:username/:slug',
    element: <ContentPage type="dataset" />
  },
  {
    path: '/spaces/:username/:slug',
    element: <ContentPage type="space" />
  },
  {
    path: '/profile/:username',
    element: <ViewProfilePage />
  },
  {
    path: '/settings',
    element: <ProtectedRoute><Navigate to="/settings/profile" replace /></ProtectedRoute>,
    loader: () => {
      return { returnTo: '/settings' };
    }
  },
  {
    path: '/settings/:tab',
    element: <ProtectedRoute><SettingsPage /></ProtectedRoute>,
    loader: () => {
      return { returnTo: '/settings' };
    }
  },
  {
    path: '*',
    element: <Navigate to="/" replace />
  }
], {
  future: {
    v7_normalizeFormMethod: true,
    v7_fetcherPersist: true,
    v7_relativeSplatPath: true
  }
});

export default function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <RouterProvider router={router} />
      </ThemeProvider>
    </AuthProvider>
  );
}