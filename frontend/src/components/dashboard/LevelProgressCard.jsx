/**
 * LevelProgressCard — Visual progress bar for all 5 levels.
 */
const LEVELS = [
    { n: 1, name: "NAVIGATION", icon: "🧭", color: "#22c55e" },
    { n: 2, name: "POWER", icon: "⚡", color: "#4ade80" },
    { n: 3, name: "COMMS", icon: "📡", color: "#f59e0b" },
    { n: 4, name: "LIFE SUPPORT", icon: "🫁", color: "#f97316" },
    { n: 5, name: "ENGINE", icon: "🔥", color: "#e53935" },
];

const LevelProgressCard = ({ highestUnlocked, sessions, onSelectLevel }) => {
    const getLevelStatus = (levelNum) => {
        if (levelNum < highestUnlocked) return "passed";
        if (levelNum === highestUnlocked) return "unlocked";
        return "locked";
    };

    const getLastAttempt = (levelNum) => {
        const levelSessions = sessions.filter((s) => s.level === levelNum);
        if (levelSessions.length === 0) return null;
        const last = levelSessions[0];
        return last.status === "passed" ? "PASSED" : last.status === "failed" ? "FAILED" : "TIMED OUT";
    };

    return (
        <div
            style={{
                background: "var(--bg-card)",
                border: "1px solid rgba(255,255,255,0.06)",
                borderRadius: 8,
                padding: "1.25rem 1.5rem",
            }}
        >
            <div
                className="font-mono"
                style={{
                    fontSize: "0.6rem",
                    color: "var(--red-400)",
                    letterSpacing: "0.15em",
                    textTransform: "uppercase",
                    marginBottom: "1rem",
                }}
            >
                ◈ SHIP REPAIR STATUS
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                {LEVELS.map((level) => {
                    const status = getLevelStatus(level.n);
                    const lastAttempt = getLastAttempt(level.n);
                    const isClickable = status !== "locked";

                    return (
                        <div
                            key={level.n}
                            onClick={() => isClickable && onSelectLevel(level.n)}
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "0.75rem",
                                padding: "0.6rem 0.75rem",
                                background: status === "passed" ? "rgba(76,175,80,0.04)" : status === "unlocked" ? "rgba(229,57,53,0.03)" : "rgba(255,255,255,0.01)",
                                border: `1px solid ${status === "passed" ? "rgba(76,175,80,0.15)" : status === "unlocked" ? "rgba(229,57,53,0.12)" : "rgba(255,255,255,0.03)"}`,
                                borderRadius: 4,
                                cursor: isClickable ? "pointer" : "default",
                                opacity: status === "locked" ? 0.4 : 1,
                                transition: "background 0.2s, border-color 0.2s",
                            }}
                            onMouseEnter={(e) => {
                                if (isClickable) {
                                    e.currentTarget.style.background = "rgba(229,57,53,0.06)";
                                    e.currentTarget.style.borderColor = "rgba(229,57,53,0.3)";
                                }
                            }}
                            onMouseLeave={(e) => {
                                if (isClickable) {
                                    e.currentTarget.style.background = status === "passed" ? "rgba(76,175,80,0.04)" : "rgba(229,57,53,0.03)";
                                    e.currentTarget.style.borderColor = status === "passed" ? "rgba(76,175,80,0.15)" : "rgba(229,57,53,0.12)";
                                }
                            }}
                        >
                            {/* Status indicator */}
                            <div
                                style={{
                                    width: 10,
                                    height: 10,
                                    borderRadius: "50%",
                                    background: status === "passed" ? "#4caf50" : status === "unlocked" ? "var(--red-400)" : "var(--grey-600)",
                                    boxShadow: status !== "locked" ? `0 0 8px ${status === "passed" ? "rgba(76,175,80,0.5)" : "var(--red-glow)"}` : "none",
                                    flexShrink: 0,
                                    animation: status === "unlocked" ? "pulse-red 2s ease-in-out infinite" : "none",
                                }}
                            />

                            {/* Level info */}
                            <div style={{ flex: 1, display: "flex", alignItems: "center", gap: "0.5rem" }}>
                                <span style={{ fontSize: "1rem", flexShrink: 0 }}>{level.icon}</span>
                                <div>
                                    <div className="font-heading" style={{ fontSize: "0.78rem", fontWeight: 600, color: "var(--grey-200)", letterSpacing: "0.04em", textTransform: "uppercase" }}>
                                        L{level.n}: {level.name}
                                    </div>
                                </div>
                            </div>

                            {/* Status badge */}
                            {lastAttempt && (
                                <span
                                    className="font-mono"
                                    style={{
                                        fontSize: "0.55rem",
                                        padding: "2px 7px",
                                        borderRadius: 2,
                                        color: lastAttempt === "PASSED" ? "#4caf50" : "var(--red-400)",
                                        background: lastAttempt === "PASSED" ? "rgba(76,175,80,0.1)" : "var(--red-subtle)",
                                        border: `1px solid ${lastAttempt === "PASSED" ? "rgba(76,175,80,0.2)" : "rgba(229,57,53,0.2)"}`,
                                        letterSpacing: "0.08em",
                                    }}
                                >
                                    {lastAttempt}
                                </span>
                            )}

                            {!lastAttempt && status === "unlocked" && (
                                <span
                                    className="font-mono"
                                    style={{
                                        fontSize: "0.55rem",
                                        color: "var(--red-400)",
                                        letterSpacing: "0.08em",
                                    }}
                                >
                                    PENDING
                                </span>
                            )}

                            {status === "locked" && (
                                <span style={{ fontSize: "0.8rem", opacity: 0.5 }}>🔒</span>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default LevelProgressCard;