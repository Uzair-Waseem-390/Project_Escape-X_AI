import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { gameAPI } from "../api/game";
import Spaceship3D from "../components/station/Spaceship3D";
import StationHUD from "../components/station/StationHUD";
import { LockedLevelModal, StartLevelModal } from "../components/station/LevelModals";

const MARKER_POSITIONS = [
    { level: 1, system: "NAVIGATION", position: [0, 0.45, 2.5] },
    { level: 2, system: "POWER", position: [-1.6, -0.1, -0.2] },
    { level: 3, system: "COMMS", position: [0, 1.1, -0.1] },
    { level: 4, system: "LIFE SUPPORT", position: [1.6, -0.1, -0.2] },
    { level: 5, system: "ENGINE", position: [0, -0.05, -2.3] },
];


/**
 * SpaceStation — 3D interactive hub showing the damaged spacecraft.
 * Route: /station
 */
const SpaceStation = () => {
    const navigate = useNavigate();
    const { isAuthenticated, loading: authLoading } = useAuth();

    const [highestUnlocked, setHighestUnlocked] = useState(1);
    const [sessions, setSessions] = useState([]);
    const [selectedMarker, setSelectedMarker] = useState(null);
    const [lockedMarker, setLockedMarker] = useState(null);

    useEffect(() => {
        if (!authLoading && !isAuthenticated) {
            navigate("/login", { replace: true });
        }
    }, [authLoading, isAuthenticated, navigate]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [progressData, sessionsData] = await Promise.all([
                    gameAPI.getProgress().catch(() => ({ highest_level_unlocked: 1 })),
                    gameAPI.getSessionHistory().catch(() => []),
                ]);
                setHighestUnlocked(progressData?.highest_level_unlocked || 1);
                setSessions(sessionsData || []);
            } catch { }
        };
        if (isAuthenticated) fetchData();
    }, [isAuthenticated]);

    const markers = MARKER_POSITIONS.map((m) => {
        const isUnlocked = m.level <= highestUnlocked;
        const levelSessions = sessions.filter((s) => s.level === m.level);
        const hasPassed = levelSessions.some((s) => s.status === "passed");
        return { ...m, unlocked: isUnlocked, completed: hasPassed };
    });

    const completedCount = markers.filter((m) => m.completed).length;

    const handleMarkerClick = (marker) => {
        if (!marker.unlocked) {
            setLockedMarker(marker);
        } else {
            setSelectedMarker(marker);
        }
    };

    return (
        <div style={{ position: "relative", width: "100%", height: "100vh", overflow: "hidden", background: "#010409" }}>
            <Spaceship3D markers={markers} onMarkerClick={handleMarkerClick} />

            <StationHUD highestUnlocked={highestUnlocked} completedLevels={completedCount} />

            {/* Level legend at bottom */}
            <div
                style={{
                    position: "fixed",
                    bottom: "1.5rem",
                    left: "50%",
                    transform: "translateX(-50%)",
                    zIndex: 50,
                    display: "flex",
                    gap: "0.5rem",
                    flexWrap: "wrap",
                    justifyContent: "center",
                }}
            >
                {markers.map((m) => (
                    <div
                        key={m.level}
                        style={{
                            padding: "5px 12px",
                            background: "rgba(10,11,13,0.85)",
                            border: `1px solid ${m.completed ? "#26c6da44" : m.unlocked ? "#e5393544" : "#5a636e33"}`,
                            borderRadius: 4,
                            backdropFilter: "blur(8px)",
                            display: "flex",
                            alignItems: "center",
                            gap: "0.4rem",
                        }}
                    >
                        <div
                            style={{
                                width: 6,
                                height: 6,
                                borderRadius: "50%",
                                background: m.completed ? "#26c6da" : m.unlocked ? "#e53935" : "#5a636e",
                                boxShadow: m.unlocked ? `0 0 6px ${m.completed ? "#26c6da" : "#e53935"}` : "none",
                                animation: m.unlocked && !m.completed ? "pulse-red 2s ease-in-out infinite" : "none",
                            }}
                        />
                        <span
                            className="font-mono"
                            style={{
                                fontSize: "0.55rem",
                                color: m.completed ? "#26c6da" : m.unlocked ? "var(--grey-300)" : "var(--grey-500)",
                                letterSpacing: "0.08em",
                            }}
                        >
                            L{m.level} {m.system}
                        </span>
                    </div>
                ))}
            </div>

            {lockedMarker && (
                <LockedLevelModal level={lockedMarker.level} system={lockedMarker.system} onClose={() => setLockedMarker(null)} />
            )}

            {selectedMarker && (
                <StartLevelModal
                    level={selectedMarker.level}
                    system={selectedMarker.system}
                    completed={selectedMarker.completed}
                    onClose={() => setSelectedMarker(null)}
                />
            )}
        </div>
    );
};

export default SpaceStation;