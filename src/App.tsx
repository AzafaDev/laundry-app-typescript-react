import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<div>Home</div>} />
        <Route path="/register" element={<div>Register</div>} />
        <Route path="/login" element={<div>Login</div>} />
        <Route path="/verify-email" element={<div>Verify Email</div>} />
        <Route path="/auth/callback" element={<div>OAuth Callback</div>} />
        <Route path="/forgot-password" element={<div>Forgot Password</div>} />
        <Route path="/reset-password" element={<div>Reset Password</div>} />
        <Route path="/profile" element={<div>Profile</div>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
