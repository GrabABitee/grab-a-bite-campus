import { Toaster } from "@/components/ui/toaster";

import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";

import {
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";

import {
  BrowserRouter,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";

import { Layout } from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";

/* ========================= */
/* COMMON PAGES */
/* ========================= */

import LandingPage from "./pages/LandingPage";
import Onboarding from "./pages/Onboarding";
import NotFound from "./pages/NotFound";

/* ========================= */
/* AUTH PAGE */
/* ========================= */

import AuthPage from "./pages/AuthPage";

/* ========================= */
/* STUDENT PAGES */
/* ========================= */

import Dashboard from "./pages/student/Dashboard";
import CartPage from "./pages/student/CartPage";
import StudentOrders from "./pages/student/StudentOrders";
import AIPicks from "./pages/student/AIPicks";

/* ========================= */
/* ADMIN PAGES */
/* ========================= */
import AdminEntryPage from "./pages/admin/AdminEntryPage";
import AdminMenu from "./pages/admin/AdminMenu";
import AdminOrders from "./pages/admin/AdminOrders";
import AdminStandardMenu from "./pages/admin/AdminStandardMenu";
import AdminOnboarding from "./pages/admin/AdminOnboarding";
import Analytics from "./pages/admin/Analytics";


const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>

      <AuthProvider>

        <CartProvider>

          <BrowserRouter>

            <Toaster />

            <Routes>

              {/* ========================= */}
              {/* PUBLIC ROUTES */}
              {/* ========================= */}

              <Route
                path="/"
                element={<LandingPage />}
              />

              <Route
                path="/auth"
                element={<AuthPage />}
              />

              <Route
                path="/onboarding"
                element={<Onboarding />}
              />

              {/* ========================= */}
              {/* STUDENT ROUTES */}
              {/* ========================= */}

              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute
                    allowedRoles={["STUDENT"]}
                  >
                    <Layout userType="student" />
                  </ProtectedRoute>
                }
              >

                <Route
                  index
                  element={<Dashboard />}
                />

                <Route
                  path="cart"
                  element={<CartPage />}
                />

                <Route
                  path="orders"
                  element={<StudentOrders />}
                />

                <Route
                  path="ai-picks"
                  element={<AIPicks />}
                />

              </Route>

              {/* ========================= */}
              {/* ADMIN ROUTES */}
              {/* ========================= */}

              <Route
                path="/admin"
                element={
                  <ProtectedRoute
                    allowedRoles={[
                      "ADMIN",
                      "CAFETERIA_ADMIN",
                    ]}
                  >
                    <Layout userType="admin" />
                  </ProtectedRoute>
                }
              >

                <Route
                  index
                  element={
                    <Navigate to="/admin/entry" />
                  }
                />

                <Route
                  path="entry"
                  element={<AdminEntryPage />}
                />


                <Route
                  path="menu"
                  element={<AdminMenu />}
                />

                <Route
                  path="orders"
                  element={<AdminOrders />}
                />

                <Route
                  path="standard-menu"
                  element={<AdminStandardMenu />}
                />
                <Route
                  path="/admin/analytics"
                  element={<Analytics />}
                />

              </Route>

              {/* ========================= */}
              {/* ADMIN ONBOARDING */}
              {/* ========================= */}

              <Route
                path="/admin/onboarding"
                element={
                  <ProtectedRoute
                    allowedRoles={[
                      "ADMIN",
                      "CAFETERIA_ADMIN",
                    ]}
                  >
                    <AdminOnboarding />
                  </ProtectedRoute>
                }
              />

              {/* ========================= */}
              {/* 404 */}
              {/* ========================= */}

              <Route
                path="*"
                element={<NotFound />}
              />

            </Routes>

          </BrowserRouter>

        </CartProvider>

      </AuthProvider>

    </QueryClientProvider>
  );
}

export default App;