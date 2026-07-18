import { Routes, Route } from "react-router-dom";
import { Layout } from "./components/Layout";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { GuestRoute } from "./components/GuestRoute";
import { StaffProtectedRoute } from "./components/StaffProtectedRoute";
import { StaffGuestRoute } from "./components/StaffGuestRoute";
import { SuperAdminRoute } from "./components/SuperAdminRoute";
import { WorkerRoute } from "./components/WorkerRoute";
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
import { Pickup } from "./pages/Pickup";
import { Orders } from "./pages/Orders";
import { OrderDetail } from "./pages/OrderDetail";
import { Payment } from "./pages/Payment";
import { Notifications } from "./pages/Notifications";
import { StaffLogin } from "./pages/StaffLogin";
import { StaffForgotPassword } from "./pages/StaffForgotPassword";
import { StaffResetPassword } from "./pages/StaffResetPassword";
import { StaffDashboard } from "./pages/StaffDashboard";
import { Outlets } from "./pages/admin/Outlets";
import { OutletForm } from "./pages/admin/OutletForm";
import { Employees } from "./pages/admin/Employees";
import { EmployeeForm } from "./pages/admin/EmployeeForm";
import { Attendance } from "./pages/staff/Attendance";
import { AttendanceHistory } from "./pages/staff/AttendanceHistory";
import { Station } from "./pages/staff/Station";
import { StationHistory } from "./pages/staff/StationHistory";

function App() {
  return (
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
        <Route path="/pickup" element={<ProtectedRoute><Pickup /></ProtectedRoute>} />
        <Route path="/orders" element={<ProtectedRoute><Orders /></ProtectedRoute>} />
        <Route path="/orders/:id" element={<ProtectedRoute><OrderDetail /></ProtectedRoute>} />
        <Route path="/payment/:id" element={<ProtectedRoute><Payment /></ProtectedRoute>} />
        <Route path="/notifications" element={<ProtectedRoute><Notifications /></ProtectedRoute>} />
        <Route path="/staff/login" element={<StaffGuestRoute><StaffLogin /></StaffGuestRoute>} />
        <Route path="/staff/forgot-password" element={<StaffGuestRoute><StaffForgotPassword /></StaffGuestRoute>} />
        <Route path="/staff/reset-password" element={<StaffGuestRoute><StaffResetPassword /></StaffGuestRoute>} />
        <Route path="/staff/dashboard" element={<StaffProtectedRoute><StaffDashboard /></StaffProtectedRoute>} />
        <Route path="/staff/admin/outlets" element={<SuperAdminRoute><Outlets /></SuperAdminRoute>} />
        <Route path="/staff/admin/outlets/new" element={<SuperAdminRoute><OutletForm /></SuperAdminRoute>} />
        <Route path="/staff/admin/outlets/:id/edit" element={<SuperAdminRoute><OutletForm /></SuperAdminRoute>} />
        <Route path="/staff/admin/employees" element={<SuperAdminRoute><Employees /></SuperAdminRoute>} />
        <Route path="/staff/admin/employees/new" element={<SuperAdminRoute><EmployeeForm /></SuperAdminRoute>} />
        <Route path="/staff/admin/employees/:id/edit" element={<SuperAdminRoute><EmployeeForm /></SuperAdminRoute>} />
        <Route path="/staff/attendance" element={<StaffProtectedRoute><Attendance /></StaffProtectedRoute>} />
        <Route path="/staff/attendance/history" element={<StaffProtectedRoute><AttendanceHistory /></StaffProtectedRoute>} />
        <Route path="/staff/station" element={<WorkerRoute><Station /></WorkerRoute>} />
        <Route path="/staff/station/history" element={<WorkerRoute><StationHistory /></WorkerRoute>} />
      </Routes>
    </Layout>
  );
}

export default App;
