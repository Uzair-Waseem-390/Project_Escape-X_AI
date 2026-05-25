/**
 * StatsOverview — 4 stat cards in a grid.
 */
const STATS = [
    { key: "total", label: "TOTAL MISSIONS", icon: "🚀", color: "var(--cyan-400)" },
    { key: "passed", label: "PASSED", icon: "✅", color: "#4caf50" },
    { key: "failed", label: "FAILED", icon: "❌", color: "var(--red-400)" },
    { key: "unlocked", label: "LEVELS UNLOCKED", icon: "🔓", color: "var(--amber-400, #ffb300)" },
];

const StatsOverview = ({ totalSessions, totalPassed, totalFailed, highestUnlocked }) => {
    const values = {
        total: totalSessions,
        passed: totalPassed,
        failed: totalFailed,
        unlocked: `${highestUnlocked}/5`,
    };

    return (
        <div
            style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "0.6rem",
            }}
        >
            {STATS.map((stat) => (
                <div
                    key={stat.key}
                    style={{
                        background: "var(--bg-card)",
                        border: `1px solid rgba(255,255,255,0.06)`,
                        borderRadius: 6,
                        padding: "1rem 1.1rem",
                        textAlign: "center",
                    }}
                >
                    <div style={{ fontSize: "1.3rem", marginBottom: "0.3rem" }}>{stat.icon}</div>
                    <div
                        className="font-display"
                        style={{
                            fontSize: "1.4rem",
                            fontWeight: 800,
                            color: stat.color,
                            letterSpacing: "0.04em",
                        }}
                    >
                        {values[stat.key]}
                    </div>
                    <div
                        className="font-mono"
                        style={{
                            fontSize: "0.55rem",
                            color: "var(--grey-400)",
                            letterSpacing: "0.1em",
                            textTransform: "uppercase",
                        }}
                    >
                        {stat.label}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default StatsOverview;