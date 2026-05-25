import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { gameAPI } from "../api/game";
import { Button, HUDTag } from "../components/ui/UIKit";
import StarField from "../components/ui/StarField";
import WelcomeBanner from "../components/dashboard/WelcomeBanner";
import StatsOverview from "../components/dashboard/StatsOverview";
import LevelProgressCard from "../components/dashboard/LevelProgressCard";
import SubjectRadar from "../components/dashboard/SubjectRadar";
import RecentSessions from "../components/dashboard/RecentSessions";
// import QuickStartCard from "../components/dashboard/QuickStartCard";
import QuickStartCard from "../components/dashboard/QuickStartCard";

/**
 * Dashboard — Post-login mission control hub.
 * Shows user profile, progress, stats, and quick-start for next level.
 */
const Dashboard = () => {
    const navigate = useNavigate();
    const { user, isAuthenticated, loading: authLoading, logout } = useAuth();

    const [progress, setProgress] = useState(null);
    const [analytics, setAnalytics] = useState([]);
    const [sessions, setSessions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [visible, setVisible] = useState(false);

    // ── Redirect if not authenticated ─────────────────────────────────
    useEffect(() => {
        if (!authLoading && !isAuthenticated) {
            navigate("/login", { replace: true });
        }
    }, [authLoading, isAuthenticated, navigate]);

    // ── Fetch dashboard data ──────────────────────────────────────────
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
            setSessions((sessionsData || []).slice(0, 10)); // Last 10 sessions
        } catch (err) {
            setError("Failed to load mission data. Please try again.");
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

    // ── Derived values ────────────────────────────────────────────────
    const highestUnlocked = progress?.highest_level_unlocked || 1;
    const nextLevel = highestUnlocked;
    const allLevelsPassed = highestUnlocked > 5 || (progress?.highest_level_unlocked === 5 && sessions.some(s => s.status === "passed" && s.level === 5));
    const totalSessions = sessions.length;
    const totalPassed = sessions.filter((s) => s.status === "passed").length;
    const totalFailed = sessions.filter((s) => s.status === "failed" || s.status === "timed_out").length;
    const activeSession = sessions.find((s) => s.status === "in_progress");

    const handleLogout = async () => {
        await logout();
        navigate("/", { replace: true });
    };

    // ── Loading state ─────────────────────────────────────────────────
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
                {/* Top bar: Welcome + Logout */}
                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        gap: "1rem",
                        marginBottom: "2rem",
                        flexWrap: "wrap",
                    }}
                >
                    <WelcomeBanner user={user} />
                    <div style={{ display: "flex", gap: "0.6rem" }}>
                        <Button
                            variant="secondary"
                            onClick={() => navigate("/profile")}
                            style={{ padding: "8px 16px", fontSize: "0.7rem" }}
                        >
                            ⚙ PROFILE
                        </Button>
                        <Button
                            variant="secondary"
                            onClick={handleLogout}
                            style={{ padding: "8px 16px", fontSize: "0.7rem", borderColor: "rgba(229,57,53,0.4)", color: "var(--red-400)" }}
                        >
                            ⏻ LOGOUT
                        </Button>
                    </div>
                </div>

                {error && (
                    <div
                        style={{
                            background: "var(--red-subtle)",
                            border: "1px solid rgba(229,57,53,0.3)",
                            borderRadius: 4,
                            padding: "0.8rem 1rem",
                            marginBottom: "1.5rem",
                        }}
                    >
                        <span className="font-mono" style={{ fontSize: "0.75rem", color: "var(--red-400)" }}>⚠ {error}</span>
                        <button
                            onClick={fetchData}
                            className="font-mono"
                            style={{ marginLeft: "1rem", fontSize: "0.7rem", color: "var(--cyan-400)", background: "none", border: "none", cursor: "pointer", textDecoration: "underline" }}
                        >
                            RETRY
                        </button>
                    </div>
                )}

                {/* Active session alert */}
                {activeSession && (
                    <div
                        style={{
                            background: "rgba(255,179,0,0.06)",
                            border: "1px solid rgba(255,179,0,0.25)",
                            borderRadius: 6,
                            padding: "1rem 1.25rem",
                            marginBottom: "1.5rem",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            flexWrap: "wrap",
                            gap: "0.75rem",
                        }}
                    >
                        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                            <span style={{ fontSize: "1.2rem" }}>⚠</span>
                            <span className="font-mono" style={{ fontSize: "0.75rem", color: "var(--amber-400, #ffb300)", letterSpacing: "0.06em" }}>
                                ACTIVE MISSION: LEVEL {activeSession.level} — IN PROGRESS
                            </span>
                        </div>
                        <Button
                            variant="primary"
                            onClick={() => navigate(`/level/${activeSession.level}/play`)}
                            style={{ padding: "8px 20px", fontSize: "0.7rem" }}
                        >
                            RESUME MISSION ▸
                        </Button>
                    </div>
                )}

                {/* Main grid */}
                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr",
                        gridTemplateRows: "auto auto",
                        gap: "1rem",
                    }}
                    className="dashboard-grid"
                >
                    {/* Top-left: Quick Start */}
                    <QuickStartCard
                        highestUnlocked={highestUnlocked}
                        allLevelsPassed={allLevelsPassed}
                        hasActiveSession={!!activeSession}
                        activeSessionLevel={activeSession?.level}
                        onStartLevel={(level) => navigate(`/level/${level}/intro`)}
                        onResumeSession={() => navigate(`/level/${activeSession.level}/play`)}
                    />

                    {/* Top-right: Stats Overview */}
                    <StatsOverview
                        totalSessions={totalSessions}
                        totalPassed={totalPassed}
                        totalFailed={totalFailed}
                        highestUnlocked={highestUnlocked}
                    />

                    {/* Bottom-left: Level Progress */}
                    <LevelProgressCard
                        highestUnlocked={highestUnlocked}
                        sessions={sessions}
                        onSelectLevel={(level) => {
                            if (level <= highestUnlocked) {
                                navigate(`/level/${level}/intro`);
                            }
                        }}
                    />

                    {/* Bottom-right: Subject Performance */}
                    <SubjectRadar analytics={analytics} />
                </div>

                {/* Recent Sessions */}
                <div style={{ marginTop: "1rem" }}>
                    <RecentSessions sessions={sessions} />
                </div>
            </div>

            <style>{`
        @media (max-width: 900px) {
          .dashboard-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
        </div>
    );
};

export default Dashboard;