import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { authAPI } from "../api/auth";
import { Button, HUDTag, CornerBrackets } from "../components/ui/UIKit";

const GeminiKeyPage = () => {
    const navigate = useNavigate();
    const { isAuthenticated, loading } = useAuth();

    const [geminiKey, setGeminiKey] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const t = setTimeout(() => setVisible(true), 100);
        return () => clearTimeout(t);
    }, []);

    useEffect(() => {
        if (!loading && !isAuthenticated) {
            navigate("/login", { replace: true });
        }
    }, [loading, isAuthenticated, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        if (!geminiKey.trim()) {
            setError("Gemini API key cannot be empty.");
            return;
        }

        setSubmitting(true);
        try {
            await authAPI.updateGeminiKey(geminiKey.trim());
            setSuccess("Gemini API key updated and validated successfully.");
            setGeminiKey("");
        } catch (err) {
            const data = err.response?.data;
            if (data?.gemini_api_key) {
                setError(Array.isArray(data.gemini_api_key) ? data.gemini_api_key[0] : data.gemini_api_key);
            } else {
                setError(data?.message || "Failed to update Gemini API key. Please check your key.");
            }
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span className="font-mono" style={{ color: "var(--red-400)", letterSpacing: "0.15em", animation: "pulse-red 1.5s infinite" }}>
                    LOADING...
                </span>
            </div>
        );
    }

    return (
        <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "6rem 1.5rem 3rem", position: "relative", zIndex: 10 }}>
            <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 60% 50% at 50% 50%, rgba(38,198,218,0.04), transparent 70%)", pointerEvents: "none" }} />

            <div style={{ width: "100%", maxWidth: 480, opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(20px)", transition: "opacity 0.6s ease, transform 0.6s ease" }}>
                <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
                    <div style={{ marginBottom: "0.8rem", display: "flex", justifyContent: "center" }}>
                        <HUDTag color="cyan">GEMINI API CONFIG</HUDTag>
                    </div>
                    <h1 className="font-display" style={{ fontSize: "clamp(1.4rem, 3vw, 1.8rem)", fontWeight: 800, textTransform: "uppercase", color: "var(--white)" }}>
                        UPDATE <span className="gradient-text-cyan" style={{ background: "linear-gradient(135deg, #26c6da, #00bcd4)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>AI KEY</span>
                    </h1>
                    <p className="font-body" style={{ fontSize: "0.85rem", color: "var(--grey-400)", marginTop: "0.5rem", lineHeight: 1.6 }}>
                        Replace your stored Gemini API key. Your key is encrypted before storage.
                    </p>
                </div>

                <CornerBrackets>
                    <div style={{ background: "rgba(15,17,20,0.95)", border: "1px solid rgba(38,198,218,0.15)", borderRadius: 6, padding: "2rem", backdropFilter: "blur(16px)" }}>
                        {error && (
                            <div style={{ background: "var(--red-subtle)", border: "1px solid rgba(229,57,53,0.3)", borderRadius: 4, padding: "0.8rem 1rem", marginBottom: "1.5rem" }}>
                                <span className="font-mono" style={{ fontSize: "0.75rem", color: "var(--red-400)" }}>⚠ {error}</span>
                            </div>
                        )}
                        {success && (
                            <div style={{ background: "rgba(76,175,80,0.08)", border: "1px solid rgba(76,175,80,0.25)", borderRadius: 4, padding: "0.8rem 1rem", marginBottom: "1.5rem" }}>
                                <span className="font-mono" style={{ fontSize: "0.75rem", color: "#4caf50" }}>✓ {success}</span>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                            <div>
                                <label className="font-mono" style={{ fontSize: "0.65rem", color: "var(--grey-300)", letterSpacing: "0.1em", textTransform: "uppercase", display: "block", marginBottom: 5 }}>
                                    New Gemini API Key
                                </label>
                                <input
                                    type="password"
                                    value={geminiKey}
                                    onChange={(e) => setGeminiKey(e.target.value)}
                                    placeholder="AI-xxxxxxxxxxxx"
                                    style={{
                                        width: "100%",
                                        padding: "12px 14px",
                                        background: "rgba(255,255,255,0.04)",
                                        border: "1px solid rgba(255,255,255,0.1)",
                                        borderRadius: 4,
                                        color: "var(--white)",
                                        fontFamily: "var(--font-body)",
                                        fontSize: "0.9rem",
                                        outline: "none",
                                        transition: "border-color 0.2s",
                                    }}
                                />
                                <p className="font-mono" style={{ fontSize: "0.6rem", color: "var(--grey-400)", marginTop: 5, letterSpacing: "0.04em" }}>
                                    Get your key at{" "}
                                    <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" style={{ color: "var(--cyan-400)", textDecoration: "none" }}>
                                        aistudio.google.com
                                    </a>
                                </p>
                            </div>

                            <Button type="submit" variant="primary" disabled={submitting} style={{ width: "100%", padding: "14px 24px", fontSize: "0.85rem" }}>
                                {submitting ? "VALIDATING..." : "🔑 UPDATE & VALIDATE KEY"}
                            </Button>
                        </form>

                        <div style={{ display: "flex", alignItems: "center", gap: "1rem", margin: "1.5rem 0" }}>
                            <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.08)" }} />
                            <span className="font-mono" style={{ fontSize: "0.65rem", color: "var(--grey-400)" }}>BACK</span>
                            <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.08)" }} />
                        </div>

                        <Link to="/profile" style={{ display: "block", textAlign: "center", fontFamily: "var(--font-body)", fontSize: "0.88rem", color: "var(--cyan-400)", textDecoration: "none", transition: "color 0.2s" }}
                            onMouseEnter={(e) => (e.target.style.color = "var(--white)")}
                            onMouseLeave={(e) => (e.target.style.color = "var(--cyan-400)")}>
                            → Back to Cadet Profile
                        </Link>
                    </div>
                </CornerBrackets>
            </div>
        </div>
    );
};

export default GeminiKeyPage;