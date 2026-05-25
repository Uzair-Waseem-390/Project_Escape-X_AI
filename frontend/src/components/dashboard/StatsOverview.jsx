/**
 * StatsOverview — 2 large stat cards filling the full space.
 */
const STATS = [
    { key: "total", label: "TOTAL MISSIONS", icon: "🚀", color: "var(--cyan-400)" },
    { key: "unlocked", label: "LEVELS UNLOCKED", icon: "🔓", color: "var(--amber-400, #ffb300)" },
];

const StatsOverview = ({ totalSessions, highestUnlocked }) => {
    const values = {
        total: totalSessions,
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
                        borderRadius: 8,
                        padding: "1.75rem 1.25rem",
                        textAlign: "center",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "0.5rem",
                        minHeight: 140,
                    }}
                >
                    <div style={{ fontSize: "2rem" }}>{stat.icon}</div>
                    <div
                        className="font-display"
                        style={{
                            fontSize: "2rem",
                            fontWeight: 800,
                            color: stat.color,
                            letterSpacing: "0.04em",
                            lineHeight: 1,
                        }}
                    >
                        {values[stat.key]}
                    </div>
                    <div
                        className="font-mono"
                        style={{
                            fontSize: "0.6rem",
                            color: "var(--grey-400)",
                            letterSpacing: "0.12em",
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