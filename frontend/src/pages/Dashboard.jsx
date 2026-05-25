import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { gameAPI } from "../api/game";
import { Button, HUDTag } from "../components/ui/UIKit";
import StarField from "../components/ui/StarField";
import StatsOverview from "../components/dashboard/StatsOverview";
import LevelProgressCard from "../components/dashboard/LevelProgressCard";
import SubjectRadar from "../components/dashboard/SubjectRadar";
import RecentSessions from "../components/dashboard/RecentSessions";

const Dashboard = () => {
    const navigate = useNavigate();
    const { user, isAuthenticated, loading: authLoading, logout } = useAuth();

    const [progress, setProgress] = useState(null);
    const [analytics, setAnalytics] = useState([]);
    const [sessions, setSessions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        if (!authLoading && !isAuthenticated) navigate("/login", { replace: true });
    }, [authLoading, isAuthenticated, navigate]);

    const fetchData = useCallback(async () => {
        setLoading(true);
        setError("");
        try {
            const [progressData, analyticsData, sessionsData] = await Promise.all([
                gameAPI.getProgress().catch(() => null),
                gameAPI.getAnalytics().catch(() => []),
                gameAPI.getSessionHistory().catch(() => []),
            ]);
            setProgress(progressData);
            setAnalytics(analyticsData || []);
            setSessions((sessionsData || []).slice(0, 10));
        } catch {
            setError("Failed to load mission data.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (isAuthenticated) {
            fetchData();
            const t = setTimeout(() => setVisible(true), 100);
            return () => clearTimeout(t);
        }
    }, [isAuthenticated, fetchData]);

    const highestUnlocked = progress?.highest_level_unlocked || 1;
    const allLevelsPassed = highestUnlocked > 5;
    const totalSessions = sessions.length;
    const completedCount = [...new Set(sessions.filter((s) => s.status === "passed").map((s) => s.level))].length;

    const handleLogout = async () => {
        await logout();
        navigate("/", { replace: true });
    };

    if (authLoading || (loading && !visible)) {
        return (
            <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--bg-primary)" }}>
                <StarField />
                <div className="noise-overlay" />
                <span className="font-mono" style={{ color: "var(--red-400)", letterSpacing: "0.15em", animation: "pulse-red 1.5s infinite", zIndex: 10 }}>
                    ACCESSING MISSION CONTROL...
                </span>
            </div>
        );
    }

    return (
        <div style={{ minHeight: "100vh", background: "var(--bg-primary)", position: "relative" }}>
            <StarField />
            <div className="noise-overlay" />

            <div
                style={{
                    maxWidth: 1280,
                    margin: "0 auto",
                    padding: "5rem 1.5rem 3rem",
                    position: "relative",
                    zIndex: 10,
                    opacity: visible ? 1 : 0,
                    transform: visible ? "translateY(0)" : "translateY(20px)",
                    transition: "opacity 0.6s ease, transform 0.6s ease",
                }}
            >
                {/* ── HEADER ─────────────────────────────────────────────── */}
                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        gap: "1rem",
                        marginBottom: "2rem",
                        flexWrap: "wrap",
                    }}
                >
                    <div>
                        <div style={{ marginBottom: "0.5rem" }}>
                            <HUDTag>MISSION CONTROL</HUDTag>
                        </div>
                        <h1 className="font-display" style={{ fontSize: "clamp(1.5rem, 3vw, 2rem)", fontWeight: 800, textTransform: "uppercase", color: "var(--white)", letterSpacing: "0.03em", lineHeight: 1.2 }}>
                            WELCOME BACK, <span className="gradient-text-red">{user?.first_name?.toUpperCase() || "CADET"}</span>
                        </h1>
                        <p className="font-body" style={{ fontSize: "0.85rem", color: "var(--grey-400)", marginTop: "0.3rem" }}>{user?.email}</p>
                    </div>

                    <div style={{ display: "flex", gap: "0.6rem", alignItems: "center" }}>
                        <Button variant="secondary" onClick={() => navigate("/profile")} style={{ padding: "8px 16px", fontSize: "0.7rem" }}>⚙ PROFILE</Button>
                        <Button variant="secondary" onClick={handleLogout} style={{ padding: "8px 16px", fontSize: "0.7rem", borderColor: "rgba(229,57,53,0.4)", color: "var(--red-400)" }}>⏻ LOGOUT</Button>
                    </div>
                </div>

                {error && (
                    <div style={{ background: "var(--red-subtle)", border: "1px solid rgba(229,57,53,0.3)", borderRadius: 4, padding: "0.8rem 1rem", marginBottom: "1.5rem" }}>
                        <span className="font-mono" style={{ fontSize: "0.75rem", color: "var(--red-400)" }}>⚠ {error}</span>
                        <button onClick={fetchData} className="font-mono" style={{ marginLeft: "1rem", fontSize: "0.7rem", color: "var(--cyan-400)", background: "none", border: "none", cursor: "pointer", textDecoration: "underline" }}>RETRY</button>
                    </div>
                )}

                {/* ── HERO CARD — Space Station Access ──────────────────── */}
                <div
                    style={{
                        background: "linear-gradient(135deg, rgba(229,57,53,0.08), rgba(10,13,18,0.95))",
                        border: "1px solid rgba(229,57,53,0.2)",
                        borderRadius: 12,
                        padding: "2.5rem 2rem",
                        marginBottom: "1.5rem",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: "2rem",
                        flexWrap: "wrap",
                    }}
                >
                    <div>
                        <div className="font-mono" style={{ fontSize: "0.6rem", color: "var(--red-400)", letterSpacing: "0.15em", marginBottom: "0.5rem" }}>
                            ◈ DAMAGE REPORT
                        </div>
                        <h2 className="font-display" style={{ fontSize: "1.4rem", fontWeight: 800, color: "var(--white)", textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: "0.5rem" }}>
                            {allLevelsPassed ? "ALL SYSTEMS REPAIRED" : `${completedCount}/5 SYSTEMS OPERATIONAL`}
                        </h2>
                        <p className="font-body" style={{ fontSize: "0.9rem", color: "var(--grey-400)", lineHeight: 1.6, maxWidth: 400, marginBottom: "1.25rem" }}>
                            {allLevelsPassed
                                ? "Every system is back online. You're ready to return home, Cadet."
                                : "Your spacecraft has critical damage. Inspect the ship and repair each system using your STEM knowledge."}
                        </p>
                        <Button
                            variant="primary"
                            onClick={() => navigate("/station")}
                            style={{ padding: "14px 32px", fontSize: "0.85rem" }}
                        >
                            🛸 INSPECT SPACECRAFT
                        </Button>
                    </div>
                    {/* Ship silhouette */}
                    <div style={{ flexShrink: 0, opacity: 0.6 }}>
                        <svg viewBox="0 0 200 100" width="180" height="90" fill="none">
                            <ellipse cx="100" cy="50" rx="80" ry="20" fill="rgba(229,57,53,0.06)" stroke="rgba(229,57,53,0.3)" strokeWidth="1" />
                            <path d="M40 50 L70 30 L130 30 L160 50 L130 70 L70 70 Z" fill="rgba(26,29,36,0.9)" stroke="rgba(229,57,53,0.4)" strokeWidth="1" />
                            <circle cx="55" cy="42" r="4" fill="#e53935" opacity="0.8"><animate attributeName="opacity" values="0.4;1;0.4" dur="2s" repeatCount="indefinite" /></circle>
                            <circle cx="145" cy="42" r="4" fill="#e53935" opacity="0.8"><animate attributeName="opacity" values="0.4;1;0.4" dur="2.3s" repeatCount="indefinite" /></circle>
                            <circle cx="100" cy="22" r="3" fill="#e53935" opacity="0.8"><animate attributeName="opacity" values="1;0.4;1" dur="1.8s" repeatCount="indefinite" /></circle>
                            <circle cx="100" cy="72" r="5" fill="#ff6b35" opacity="0.6"><animate attributeName="opacity" values="0.3;0.8;0.3" dur="1.5s" repeatCount="indefinite" /></circle>
                        </svg>
                    </div>
                </div>

                {/* ── STATS + LEVEL PROGRESS ROW ────────────────────────── */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1rem" }} className="dashboard-grid">
                    <StatsOverview totalSessions={totalSessions} highestUnlocked={highestUnlocked} />
                    <LevelProgressCard highestUnlocked={highestUnlocked} sessions={sessions} onSelectLevel={(l) => l <= highestUnlocked && navigate(`/level/${l}/intro`)} />
                </div>

                {/* ── SUBJECT PERFORMANCE ────────────────────────────────── */}
                <div style={{ marginBottom: "1rem" }}>
                    <SubjectRadar analytics={analytics} />
                </div>

                {/* ── RECENT SESSIONS ───────────────────────────────────── */}
                <RecentSessions sessions={sessions} />
            </div>

            <style>{`
        @media (max-width: 900px) {
          .dashboard-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
        </div>
    );
};

export default Dashboard;