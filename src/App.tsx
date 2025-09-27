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
import { useAuth } from "@/services/auth";

// Pages
import HomePage from "@/pages/home";
import SignInPage from "@/pages/sign-in";
// import SignUpPage from '@/pages/sign-up';
import SimpleProfilePage from "@/pages/simple-profile";
import ForgotPasswordPage from "@/pages/forgot-password";
import ClientsPage from "@/pages/clients";

// Initialize i18n
import "@/services/i18n/client";

function AppContent() {
  const { user, isLoaded } = useAuth();

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  return (
    <Router>
      {user && <ResponsiveAppBar />}
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
          element={user ? <Navigate to="/" replace /> : <ForgotPasswordPage />}
        />
        <Route
          path="/profile"
          element={
            user ? <SimpleProfilePage /> : <Navigate to="/sign-in" replace />
          }
        />
        <Route
          path="/clients"
          element={user ? <ClientsPage /> : <Navigate to="/sign-in" replace />}
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
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
