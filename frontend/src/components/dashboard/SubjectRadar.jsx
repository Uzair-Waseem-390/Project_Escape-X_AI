import { useEffect, useState } from "react";

/**
 * SubjectRadar — Horizontal bar chart for subject performance.
 * Renders bar fills using a simple div with inline background style.
 * No CSS transitions — uses React state to trigger re-render with final width.
 */
const SUBJECT_ORDER = ["math", "computer", "physics", "chemistry", "gk"];

const SUBJECT_LABELS = {
    math: "Mathematics",
    computer: "Computer Science",
    physics: "Physics",
    chemistry: "Chemistry",
    gk: "General Knowledge",
};

const SUBJECT_COLORS = {
    math: "#26c6da",
    computer: "#4caf50",
    physics: "#e53935",
    chemistry: "#ffb300",
    gk: "#a78bfa",
};

const SubjectRadar = ({ analytics }) => {
    // Build a lookup map from the analytics array
    const analyticsMap = {};
    if (Array.isArray(analytics)) {
        analytics.forEach((item) => {
            if (item && item.subject) {
                analyticsMap[item.subject] = item;
            }
        });
    }

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
                ◈ SUBJECT PERFORMANCE
            </div>

            {Object.keys(analyticsMap).length === 0 ? (
                <div style={{ textAlign: "center", padding: "2rem 0" }}>
                    <span className="font-mono" style={{ fontSize: "0.7rem", color: "var(--grey-400)" }}>
                        Complete a level to see your subject analytics.
                    </span>
                </div>
            ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
                    {SUBJECT_ORDER.map((subject, index) => {
                        const data = analyticsMap[subject];
                        const accuracy = data ? (data.accuracy_percent ?? 0) : 0;
                        const color = SUBJECT_COLORS[subject];

                        return <SubjectBar key={subject} subject={subject} accuracy={accuracy} color={color} index={index} />;
                    })}
                </div>
            )}
        </div>
    );
};

/** Individual animated bar */
const SubjectBar = ({ subject, accuracy, color, index }) => {
    const [animWidth, setAnimWidth] = useState(0);

    useEffect(() => {
        const timer = setTimeout(() => {
            setAnimWidth(accuracy);
        }, 150 + index * 100);
        return () => clearTimeout(timer);
    }, [accuracy, index]);

    return (
        <div>
            {/* Label row */}
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                <span
                    style={{
                        fontSize: "0.72rem",
                        fontFamily: "var(--font-heading)",
                        color: "var(--grey-300)",
                        textTransform: "uppercase",
                        letterSpacing: "0.04em",
                        fontWeight: 600,
                    }}
                >
                    {SUBJECT_LABELS[subject]}
                </span>
                <span
                    style={{
                        fontSize: "0.65rem",
                        fontFamily: "var(--font-mono)",
                        color: color,
                        fontWeight: 600,
                    }}
                >
                    {accuracy}%
                </span>
            </div>

            {/* Bar track */}
            <div
                style={{
                    width: "100%",
                    height: 6,
                    background: "rgba(255,255,255,0.06)",
                    borderRadius: 3,
                    overflow: "hidden",
                }}
            >
                {/* Bar fill */}
                <div
                    style={{
                        height: "100%",
                        width: `${animWidth}%`,
                        background: color,
                        borderRadius: 3,
                        boxShadow: accuracy > 0 ? `0 0 10px ${color}` : "none",
                        transition: "width 1s cubic-bezier(0.4, 0, 0.2, 1)",
                    }}
                />
            </div>
        </div>
    );
};

export default SubjectRadar;