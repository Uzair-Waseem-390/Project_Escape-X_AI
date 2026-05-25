import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ProfilePage from "./pages/ProfilePage";
import GeminiKeyPage from "./pages/GeminiKeyPage";
import LevelIntro from "./pages/LevelIntro";

/**
 * App — Root component with routing.
 */
export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/gemini-key" element={<GeminiKeyPage />} />
          <Route path="/level/:id/intro" element={<LevelIntro />} />
          {/* Phase 3: <Route path="/level/:id/play" element={<LevelPlayPage />} /> */}
          {/* Phase 4: <Route path="/dashboard" element={<Dashboard />} /> */}
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}