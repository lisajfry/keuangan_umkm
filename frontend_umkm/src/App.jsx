import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import RegisterUmkmPage from "./components/Register";
import LoginPage from "./components/LoginPage";
import DashboardPage from "./components/DashboardPage";
import TransactionsPage from "./components/TransactionsPage";
import TransactionFormPage from "./pages/TransactionFormPage";
import ReportsSummary from "./pages/ReportsSummary";
import ProtectedRoute from "./components/ProtectedRoute";
import SidebarLayout from "./components/SidebarLayout";

export default function App() {
  return (
    <Routes>
      {/* Public Route */}
      

<Route path="/register" element={<RegisterUmkmPage />} />


      <Route path="/login" element={<LoginPage />} />

      {/* Protected Routes with Sidebar */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <SidebarLayout>
              <DashboardPage />
            </SidebarLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <SidebarLayout>
              <DashboardPage />
            </SidebarLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/transactions"
        element={
          <ProtectedRoute>
            <SidebarLayout>
              <TransactionsPage />
            </SidebarLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/transactions/new"
        element={
          <ProtectedRoute>
            <SidebarLayout>
              <TransactionFormPage />
            </SidebarLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/reports"
        element={
          <ProtectedRoute>
            <SidebarLayout>
              <ReportsSummary />
            </SidebarLayout>
          </ProtectedRoute>
        }
      />

      {/* Catch-all Redirect */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
