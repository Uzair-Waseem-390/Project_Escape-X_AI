/**
 * SubjectRadar — Horizontal bar chart for subject performance.
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
    math: "var(--cyan-400)",
    computer: "#4caf50",
    physics: "var(--red-400)",
    chemistry: "var(--amber-400, #ffb300)",
    gk: "#a78bfa",
};

const SubjectRadar = ({ analytics }) => {
    const getSubjectData = (subject) => {
        return analytics.find((a) => a.subject === subject) || null;
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
                ◈ SUBJECT PERFORMANCE
            </div>

            {analytics.length === 0 ? (
                <div style={{ textAlign: "center", padding: "2rem 0" }}>
                    <span className="font-mono" style={{ fontSize: "0.7rem", color: "var(--grey-400)" }}>
                        Complete a level to see your subject analytics.
                    </span>
                </div>
            ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                    {SUBJECT_ORDER.map((subject) => {
                        const data = getSubjectData(subject);
                        const accuracy = data?.accuracy_percent || 0;
                        const color = SUBJECT_COLORS[subject];

                        return (
                            <div key={subject}>
                                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
                                    <span className="font-heading" style={{ fontSize: "0.72rem", color: "var(--grey-300)", textTransform: "uppercase", letterSpacing: "0.04em" }}>
                                        {SUBJECT_LABELS[subject]}
                                    </span>
                                    <span className="font-mono" style={{ fontSize: "0.65rem", color, fontWeight: 600 }}>
                                        {accuracy}%
                                    </span>
                                </div>
                                <div style={{ height: 4, background: "rgba(255,255,255,0.06)", borderRadius: 2, overflow: "hidden" }}>
                                    <div
                                        style={{
                                            height: "100%",
                                            width: `${accuracy}%`,
                                            background: `linear-gradient(90deg, ${color}88, ${color})`,
                                            borderRadius: 2,
                                            boxShadow: `0 0 6px ${color}44`,
                                            transition: "width 1s ease",
                                        }}
                                    />
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default SubjectRadar;