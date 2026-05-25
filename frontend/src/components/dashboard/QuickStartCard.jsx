import { Button } from "../ui/UIKit";

/**
 * QuickStartCard — Primary action: start next level via intro page.
 */
const QuickStartCard = ({
    highestUnlocked,
    allLevelsPassed,
    onStartLevel,
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
                    You've repaired every system and returned home safely. Replay any level from the progress panel below.
                </p>
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
                    READY FOR <span className="gradient-text-red">LEVEL {highestUnlocked}</span>
                </h2>
                <p className="font-body" style={{ fontSize: "0.85rem", color: "var(--grey-400)", lineHeight: 1.6 }}>
                    Your spacecraft needs repairs. View the mission briefing before starting your repair.
                </p>
                <Button variant="primary" onClick={() => onStartLevel(highestUnlocked)} style={{ padding: "14px 32px", fontSize: "0.85rem" }}>
                    🚀 MISSION BRIEFING
                </Button>
            </>
        )}
    </div>
);

export default QuickStartCard;