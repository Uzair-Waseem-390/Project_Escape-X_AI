import { useEffect, useState } from "react";

/**
 * ScoreDisplay — animated score counter.
 * Shows +2 or -2 animation on score change.
 */
const ScoreDisplay = ({ score, pointsDelta }) => {
    const [displayScore, setDisplayScore] = useState(score);
    const [showDelta, setShowDelta] = useState(false);

    useEffect(() => {
        if (pointsDelta) {
            setShowDelta(true);
            const timer = setTimeout(() => setShowDelta(false), 1500);
            // Animate score count
            const interval = setInterval(() => {
                setDisplayScore((prev) => {
                    if (prev === score) {
                        clearInterval(interval);
                        return prev;
                    }
                    return prev < score ? prev + 1 : prev - 1;
                });
            }, 50);
            return () => {
                clearTimeout(timer);
                clearInterval(interval);
            };
        } else {
            setDisplayScore(score);
        }
    }, [score, pointsDelta]);

    return (
        <div style={{ position: "relative", display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <span style={{ fontSize: "1rem" }}>🎯</span>
            <div>
                <div className="font-mono" style={{ fontSize: "0.55rem", color: "var(--grey-400)", letterSpacing: "0.1em", textTransform: "uppercase" }}>
                    Score
                </div>
                <div className="font-display" style={{ fontSize: "1.1rem", fontWeight: 800, color: "var(--white)", letterSpacing: "0.04em" }}>
                    {displayScore}<span style={{ fontSize: "0.7rem", color: "var(--grey-400)" }}>/30</span>
                </div>
            </div>
            {showDelta && pointsDelta && (
                <span
                    className="font-mono"
                    style={{
                        position: "absolute",
                        top: -8,
                        right: -30,
                        fontSize: "0.75rem",
                        fontWeight: 700,
                        color: pointsDelta > 0 ? "#4caf50" : "var(--red-400)",
                        animation: "slide-in-up 0.4s ease forwards",
                    }}
                >
                    {pointsDelta > 0 ? `+${pointsDelta}` : pointsDelta}
                </span>
            )}
        </div>
    );
};

export default ScoreDisplay;