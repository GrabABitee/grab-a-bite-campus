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
} from "react-router-dom";

import { Layout } from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";

/* ===================================== */
/* ADMIN PAGES */
/* ===================================== */

import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminEntryPage from "./pages/admin/AdminEntryPage";
import AdminMenu from "./pages/admin/AdminMenu";
import AdminOnboarding from "./pages/admin/AdminOnboarding";
import AdminOrders from "./pages/admin/AdminOrders";
import AdminStandardMenu from "./pages/admin/AdminStandardMenu";

/* ===================================== */
/* STUDENT PAGES */
/* ===================================== */

import AIPicks from "./pages/student/AIPicks";
import CartPage from "./pages/student/CartPage";
import Dashboard from "./pages/student/Dashboard";
import Orders from "./pages/student/StudentOrders";

/* ===================================== */
/* COMMON PAGES */
/* ===================================== */

import LandingPage from "./pages/LandingPage";
import NotFound from "./pages/NotFound";
import Onboarding from "./pages/Onboarding";

const queryClient = new QueryClient();

function App() {

  return (

    <QueryClientProvider client={queryClient}>

      {/* ===================================== */}
      {/* AUTH + CART PROVIDERS */}
      {/* ===================================== */}

      <AuthProvider>

        <CartProvider>

          <Toaster />

          <BrowserRouter>

            <Routes>

              {/* ===================================== */}
              {/* PUBLIC */}
              {/* ===================================== */}

              <Route
                path="/"
                element={<LandingPage />}
              />

              <Route
                path="/onboarding"
                element={<Onboarding />}
              />

              {/* ===================================== */}
              {/* STUDENT */}
              {/* ===================================== */}

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

                {/* DASHBOARD */}

                <Route
                  index
                  element={<Dashboard />}
                />

                {/* CART */}

                <Route
                  path="cart"
                  element={<CartPage />}
                />

                {/* ORDERS */}

                <Route
                  path="orders"
                  element={<Orders />}
                />

                {/* AI PICKS */}

                <Route
                  path="ai-picks"
                  element={<AIPicks />}
                />

              </Route>

              {/* ===================================== */}
              {/* ADMIN */}
              {/* ===================================== */}

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

                {/* DASHBOARD */}

                <Route
                  index
                  element={<AdminDashboard />}
                />

                {/* ENTRY */}

                <Route
                  path="entry"
                  element={<AdminEntryPage />}
                />

                {/* STANDARD MENU */}

                <Route
                  path="standard-menu"
                  element={<AdminStandardMenu />}
                />

                {/* MENU */}

                <Route
                  path="menu"
                  element={<AdminMenu />}
                />

                {/* ORDERS */}

                <Route
                  path="orders"
                  element={<AdminOrders />}
                />

              </Route>

              {/* ===================================== */}
              {/* ADMIN ONBOARDING */}
              {/* ===================================== */}

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

              {/* ===================================== */}
              {/* 404 */}
              {/* ===================================== */}

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