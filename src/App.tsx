import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { Register } from "./pages/Register";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<div>Home</div>} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<div>Login</div>} />
        <Route path="/verify-email" element={<div>Verify Email</div>} />
        <Route path="/auth/callback" element={<div>OAuth Callback</div>} />
        <Route path="/forgot-password" element={<div>Forgot Password</div>} />
        <Route path="/reset-password" element={<div>Reset Password</div>} />
        <Route path="/profile" element={<ProtectedRoute><div>Profile</div></ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
