import { Suspense, lazy } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import CssBaseline from "@mui/material/CssBaseline";
import { queryClient } from "@/services/react-query/query-client";
import ThemeProviderWrapper from "@/components/theme/theme-provider";
import AuthProvider from "@/services/auth/auth-provider";
import SnackbarProvider from "@/components/snackbar-provider";
import ResponsiveAppBar from "@/components/app-bar";
import PageLoading from "@/components/loading/page-loading";
import ErrorBoundary from "@/components/error/error-boundary";
import ProtectedRoute from "@/components/auth/protected-route";
import { useAuth } from "@/services/auth";

// Lazy load pages for code splitting
const HomePage = lazy(() => import("@/pages/home"));
const SignInPage = lazy(() => import("@/pages/sign-in"));
const SimpleProfilePage = lazy(() => import("@/pages/simple-profile"));
const EditProfilePage = lazy(() => import("@/pages/edit-profile"));
const ForgotPasswordPage = lazy(() => import("@/pages/forgot-password"));
const ClientsPage = lazy(() => import("@/pages/clients"));
const AdminDashboardPage = lazy(() => import("@/pages/admin-dashboard"));

// Initialize i18n
import "@/services/i18n/client";

// Loading component for Suspense fallback
function SuspenseLoading() {
  return <PageLoading message="Carregando página..." />;
}

function AppContent() {
  const { user, isLoaded } = useAuth();

  if (!isLoaded) {
    return <PageLoading message="Carregando aplicação..." />;
  }

  return (
    <Router>
      {user && <ResponsiveAppBar />}
      <ErrorBoundary>
        <Suspense fallback={<SuspenseLoading />}>
          <Routes>
            <Route
              path="/"
              element={user ? <HomePage /> : <Navigate to="/sign-in" replace />}
            />
            <Route
              path="/sign-in"
              element={user ? <Navigate to="/" replace /> : <SignInPage />}
            />
            {/* <Route 
              path="/sign-up" 
              element={user ? <Navigate to="/" replace /> : <SignUpPage />} 
            /> */}
            <Route
              path="/forgot-password"
              element={
                user ? <Navigate to="/" replace /> : <ForgotPasswordPage />
              }
            />
            <Route
              path="/profile"
              element={
                user ? (
                  <SimpleProfilePage />
                ) : (
                  <Navigate to="/sign-in" replace />
                )
              }
            />
            <Route
              path="/profile/edit"
              element={
                user ? <EditProfilePage /> : <Navigate to="/sign-in" replace />
              }
            />
            <Route
              path="/admin"
              element={
                <ProtectedRoute requiredRole="admin">
                  <AdminDashboardPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/clients"
              element={
                <ProtectedRoute requiredRole="admin">
                  <ClientsPage />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </ErrorBoundary>
    </Router>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProviderWrapper>
        <CssBaseline />
        <AuthProvider>
          <SnackbarProvider />
          <AppContent />
        </AuthProvider>
      </ThemeProviderWrapper>
    </QueryClientProvider>
  );
}

export default App;
