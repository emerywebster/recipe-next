import { Suspense } from 'react';
import { useRoutes, Routes, Route, Navigate } from 'react-router-dom';
import Home from './components/home';
import RecipeDetail from './components/RecipeDetail';
import Profile from './components/pages/Profile';
import AppLayout from './components/layout/AppLayout';
import routes from 'tempo-routes';
import { AuthProvider, useAuth } from './lib/auth';
import { Toaster } from './components/ui/toaster';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>{/* Add loading spinner if needed */}</div>;
  }

  if (!user) {
    return <Navigate to="/" />;
  }

  return <>{children}</>;
}

function AppRoutes() {
  return (
    <Suspense fallback={<div>{/* Add loading spinner if needed */}</div>}>
      <AppLayout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/recipe/:id" element={<RecipeDetail />} />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
        </Routes>
        {process.env.NEXT_PUBLIC_TEMPO === 'true' && useRoutes(routes)}
      </AppLayout>
    </Suspense>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppRoutes />
      <Toaster />
    </AuthProvider>
  );
}

export default App;
