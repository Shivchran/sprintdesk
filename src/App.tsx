import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";
import { lazy, Suspense } from "react";

import ProtectedRoute from "./components/ProtectedRoute";

// =====================================================
// LAZY LOADED PAGES
// =====================================================

const LoginPage = lazy(
  () => import("./pages/LoginPage")
);

const DashboardPage = lazy(
  () => import("./pages/DashboardPage")
);

const AnalyticsPage = lazy(
  () => import("./pages/AnalyticsPage")
);

// =====================================================
// LOADING SCREEN
// =====================================================

function PageLoader() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100">
      <div className="text-center">
        <div className="mx-auto mb-3 h-8 w-8 animate-spin rounded-full border-4 border-slate-300 border-t-blue-600" />

        <p className="text-sm font-medium text-slate-600">
          Loading SprintDesk...
        </p>
      </div>
    </div>
  );
}

// =====================================================
// APP
// =====================================================

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<PageLoader />}>
        <Routes>

          {/* ==========================================
              PUBLIC ROUTE
          ========================================== */}

          <Route
            path="/login"
            element={<LoginPage />}
          />

          {/* ==========================================
              PROTECTED ROUTES
          ========================================== */}

          <Route element={<ProtectedRoute />}>

            <Route
              path="/dashboard"
              element={<DashboardPage />}
            />

            {/* Existing dashboard is currently
                also used as the board page */}
            <Route
              path="/board"
              element={<DashboardPage />}
            />

            <Route
              path="/analytics"
              element={<AnalyticsPage />}
            />

          </Route>

          {/* ==========================================
              ROOT
          ========================================== */}

          <Route
            path="/"
            element={
              <Navigate
                to="/dashboard"
                replace
              />
            }
          />

          {/* ==========================================
              UNKNOWN ROUTES
          ========================================== */}

          <Route
            path="*"
            element={
              <Navigate
                to="/dashboard"
                replace
              />
            }
          />

        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;