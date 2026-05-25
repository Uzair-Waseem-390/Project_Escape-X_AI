import { Button } from "../ui/UIKit";

/**
 * QuickStartCard — Primary action: start next level or resume active session.
 */
const QuickStartCard = ({
    highestUnlocked,
    nextLevel,
    allLevelsPassed,
    hasActiveSession,
    activeSessionLevel,
    onStartLevel,
    onResumeSession,
}) => (
    <div
        style={{
            background: "linear-gradient(135deg, rgba(229,57,53,0.06), rgba(10,11,13,0.95))",
            border: "1px solid rgba(229,57,53,0.2)",
            borderRadius: 8,
            padding: "1.75rem",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            textAlign: "center",
            gap: "1.25rem",
        }}
    >
        {allLevelsPassed ? (
            <>
                <div style={{ fontSize: "3rem" }}>🏆</div>
                <h2
                    className="font-display"
                    style={{
                        fontSize: "1.3rem",
                        fontWeight: 800,
                        color: "var(--white)",
                        textTransform: "uppercase",
                        letterSpacing: "0.04em",
                    }}
                >
                    ALL MISSIONS <span className="gradient-text-red">COMPLETE</span>
                </h2>
                <p className="font-body" style={{ fontSize: "0.85rem", color: "var(--grey-400)", lineHeight: 1.6 }}>
                    You've repaired every system and returned home safely. Replay any level to improve your skills.
                </p>
            </>
        ) : hasActiveSession ? (
            <>
                <div style={{ fontSize: "3rem" }}>⏳</div>
                <h2
                    className="font-display"
                    style={{
                        fontSize: "1.3rem",
                        fontWeight: 800,
                        color: "var(--white)",
                        textTransform: "uppercase",
                        letterSpacing: "0.04em",
                    }}
                >
                    MISSION <span className="gradient-text-red">IN PROGRESS</span>
                </h2>
                <p className="font-body" style={{ fontSize: "0.85rem", color: "var(--grey-400)", lineHeight: 1.6 }}>
                    You have an active Level {activeSessionLevel} session. Resume or start a different level.
                </p>
                <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
                    <Button variant="primary" onClick={onResumeSession} style={{ padding: "12px 24px", fontSize: "0.8rem" }}>
                        ▶ RESUME LEVEL {activeSessionLevel}
                    </Button>
                    <Button variant="secondary" onClick={() => onStartLevel(highestUnlocked)} style={{ padding: "12px 24px", fontSize: "0.8rem" }}>
                        NEW LEVEL {highestUnlocked}
                    </Button>
                </div>
            </>
        ) : (
            <>
                <div style={{ fontSize: "3rem" }}>🚀</div>
                <h2
                    className="font-display"
                    style={{
                        fontSize: "1.3rem",
                        fontWeight: 800,
                        color: "var(--white)",
                        textTransform: "uppercase",
                        letterSpacing: "0.04em",
                    }}
                >
                    READY FOR <span className="gradient-text-red">LEVEL {nextLevel}</span>
                </h2>
                <p className="font-body" style={{ fontSize: "0.85rem", color: "var(--grey-400)", lineHeight: 1.6 }}>
                    Your spacecraft needs repairs. Start your next mission to fix another system and get closer to home.
                </p>
                <Button variant="primary" onClick={() => onStartLevel(nextLevel)} style={{ padding: "14px 32px", fontSize: "0.85rem" }}>
                    🚀 START LEVEL {nextLevel}
                </Button>
            </>
        )}
    </div>
);

export default QuickStartCard;