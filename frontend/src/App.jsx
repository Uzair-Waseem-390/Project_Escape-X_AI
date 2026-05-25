import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ProfilePage from "./pages/ProfilePage";
import GeminiKeyPage from "./pages/GeminiKeyPage";
import LevelIntro from "./pages/LevelIntro";
import LevelPlayPage from "./pages/LevelPlayPage";
import LevelSuccess from "./pages/LevelSuccess";
import LevelFailure from "./pages/LevelFailure";

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
          <Route path="/level/:id/play" element={<LevelPlayPage />} />
          <Route path="/level/:id/success" element={<LevelSuccess />} />
          <Route path="/level/:id/failure" element={<LevelFailure />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}