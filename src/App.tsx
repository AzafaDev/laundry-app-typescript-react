import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "./components/Layout";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { GuestRoute } from "./components/GuestRoute";
import { StaffProtectedRoute } from "./components/StaffProtectedRoute";
import { StaffGuestRoute } from "./components/StaffGuestRoute";
import { SuperAdminRoute } from "./components/SuperAdminRoute";
import { Home } from "./pages/Home";
import { Register } from "./pages/Register";
import { VerifyEmail } from "./pages/VerifyEmail";
import { Login } from "./pages/Login";
import { OAuthCallback } from "./pages/OAuthCallback";
import { ForgotPassword } from "./pages/ForgotPassword";
import { ResetPassword } from "./pages/ResetPassword";
import { Profile } from "./pages/Profile";
import { Addresses } from "./pages/Addresses";
import { AddressCreatePage } from "./pages/AddressCreatePage";
import { AddressEditPage } from "./pages/AddressEditPage";
import { StaffLogin } from "./pages/StaffLogin";
import { StaffDashboard } from "./pages/StaffDashboard";
import { Outlets } from "./pages/admin/Outlets";
import { OutletForm } from "./pages/admin/OutletForm";
import { Employees } from "./pages/admin/Employees";
import { EmployeeForm } from "./pages/admin/EmployeeForm";

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<GuestRoute><Register /></GuestRoute>} />
          <Route path="/login" element={<GuestRoute><Login /></GuestRoute>} />
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="/auth/callback" element={<OAuthCallback />} />
          <Route path="/forgot-password" element={<GuestRoute><ForgotPassword /></GuestRoute>} />
          <Route path="/reset-password" element={<GuestRoute><ResetPassword /></GuestRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/addresses" element={<ProtectedRoute><Addresses /></ProtectedRoute>} />
          <Route path="/addresses/new" element={<ProtectedRoute><AddressCreatePage /></ProtectedRoute>} />
          <Route path="/addresses/:id/edit" element={<ProtectedRoute><AddressEditPage /></ProtectedRoute>} />
          <Route path="/staff/login" element={<StaffGuestRoute><StaffLogin /></StaffGuestRoute>} />
          <Route path="/staff/dashboard" element={<StaffProtectedRoute><StaffDashboard /></StaffProtectedRoute>} />
          <Route path="/staff/admin/outlets" element={<SuperAdminRoute><Outlets /></SuperAdminRoute>} />
          <Route path="/staff/admin/outlets/new" element={<SuperAdminRoute><OutletForm /></SuperAdminRoute>} />
          <Route path="/staff/admin/outlets/:id/edit" element={<SuperAdminRoute><OutletForm /></SuperAdminRoute>} />
          <Route path="/staff/admin/employees" element={<SuperAdminRoute><Employees /></SuperAdminRoute>} />
          <Route path="/staff/admin/employees/new" element={<SuperAdminRoute><EmployeeForm /></SuperAdminRoute>} />
          <Route path="/staff/admin/employees/:id/edit" element={<SuperAdminRoute><EmployeeForm /></SuperAdminRoute>} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
