/**
 * SubjectIndicator — shows current subject and progress within it.
 */
const SubjectIndicator = ({ subject, subjectLabel, subjectProgress, questionNumber, totalQuestions }) => (
    <div
        style={{
            display: "flex",
            alignItems: "center",
            gap: "1rem",
            padding: "0.4rem 1rem",
            background: "rgba(10,11,13,0.9)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 4,
            backdropFilter: "blur(12px)",
        }}
    >
        <div>
            <div className="font-mono" style={{ fontSize: "0.5rem", color: "var(--grey-400)", letterSpacing: "0.12em", textTransform: "uppercase" }}>
                Subject
            </div>
            <div className="font-heading" style={{ fontSize: "0.78rem", fontWeight: 700, color: "var(--cyan-400)", letterSpacing: "0.04em", textTransform: "uppercase" }}>
                {subjectLabel}
            </div>
        </div>
        <div style={{ width: 1, height: 28, background: "rgba(255,255,255,0.1)" }} />
        <div>
            <div className="font-mono" style={{ fontSize: "0.5rem", color: "var(--grey-400)", letterSpacing: "0.12em", textTransform: "uppercase" }}>
                Block
            </div>
            <div className="font-mono" style={{ fontSize: "0.78rem", fontWeight: 600, color: "var(--grey-200)", letterSpacing: "0.06em" }}>
                {subjectProgress}
            </div>
        </div>
        <div style={{ width: 1, height: 28, background: "rgba(255,255,255,0.1)" }} />
        <div>
            <div className="font-mono" style={{ fontSize: "0.5rem", color: "var(--grey-400)", letterSpacing: "0.12em", textTransform: "uppercase" }}>
                Question
            </div>
            <div className="font-mono" style={{ fontSize: "0.78rem", fontWeight: 600, color: "var(--grey-200)", letterSpacing: "0.06em" }}>
                {questionNumber}/{totalQuestions}
            </div>
        </div>
    </div>
);

export default SubjectIndicator;