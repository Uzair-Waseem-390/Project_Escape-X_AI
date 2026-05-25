/**
 * TimerBar — 15-minute countdown display.
 * Pulses red when < 2 minutes remaining.
 */
const TimerBar = ({ timeLeft, formattedTime }) => {
    const isUrgent = timeLeft <= 120; // Last 2 minutes
    const pct = (timeLeft / (15 * 60)) * 100;

    return (
        <div
            style={{
                display: "flex",
                alignItems: "center",
                gap: "0.75rem",
                padding: "0.5rem 1rem",
                background: "rgba(10,11,13,0.9)",
                border: `1px solid ${isUrgent ? "rgba(229,57,53,0.5)" : "rgba(255,255,255,0.1)"}`,
                borderRadius: 4,
                backdropFilter: "blur(12px)",
            }}
        >
            {/* Timer icon */}
            <span style={{ fontSize: "1.1rem" }}>⏱</span>

            {/* Progress bar */}
            <div style={{ flex: 1, height: 4, background: "rgba(255,255,255,0.08)", borderRadius: 2, overflow: "hidden" }}>
                <div
                    style={{
                        height: "100%",
                        width: `${pct}%`,
                        background: isUrgent
                            ? "linear-gradient(90deg, var(--red-600), var(--red-400))"
                            : "linear-gradient(90deg, var(--cyan-500), var(--cyan-400))",
                        borderRadius: 2,
                        boxShadow: isUrgent ? "0 0 8px var(--red-glow)" : "0 0 8px var(--cyan-glow)",
                        transition: "width 1s linear",
                    }}
                />
            </div>

            {/* Time display */}
            <span
                className="font-mono"
                style={{
                    fontSize: "0.85rem",
                    fontWeight: 700,
                    color: isUrgent ? "var(--red-400)" : "var(--cyan-400)",
                    letterSpacing: "0.06em",
                    animation: isUrgent ? "pulse-red 1s ease-in-out infinite" : "none",
                    minWidth: 50,
                    textAlign: "right",
                }}
            >
                {formattedTime}
            </span>
        </div>
    );
};

export default TimerBar;