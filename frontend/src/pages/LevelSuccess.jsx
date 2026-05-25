import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import SceneStateSystem from "../components/cutscenes/SceneStateSystem";
import SkipButton from "../components/ui/SkipButton";
import StarField from "../components/ui/StarField";
import getSuccessScenes from "../components/cutscenes/LevelSuccessScene";

const SYSTEM_NAMES = {
    1: "NAVIGATION SYSTEM",
    2: "POWER DISTRIBUTION",
    3: "COMMUNICATION ARRAY",
    4: "LIFE SUPPORT",
    5: "ENGINE CORE",
};

/**
 * LevelSuccess — Shown when a level is passed.
 * Route: /level/:id/success
 */
const LevelSuccess = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const levelId = parseInt(id);
    const [isComplete, setIsComplete] = useState(false);

    const systemName = SYSTEM_NAMES[levelId] || `LEVEL ${levelId}`;
    const nextLevelId = levelId + 1;
    const isLastLevel = levelId === 5;

    const scenes = getSuccessScenes(levelId, systemName, nextLevelId);

    const handleComplete = () => {
        if (isComplete) return;
        setIsComplete(true);

        if (isLastLevel) {
            // Final ending — navigate to ending page (will be built later)
            navigate("/ending", { replace: true });
        } else {
            // Go to next level intro
            navigate(`/level/${nextLevelId}/intro`, { replace: true });
        }
    };

    const handleSkip = () => {
        if (isComplete) return;
        setIsComplete(true);

        if (isLastLevel) {
            navigate("/ending", { replace: true });
        } else {
            navigate(`/level/${nextLevelId}/intro`, { replace: true });
        }
    };

    return (
        <div style={{ position: "relative", minHeight: "100vh", background: "var(--bg-primary)", overflow: "hidden" }}>
            <StarField />
            <div className="noise-overlay" />

            {/* Level indicator */}
            <div
                style={{
                    position: "fixed",
                    top: "1.25rem",
                    left: "1.25rem",
                    zIndex: 100,
                    padding: "6px 14px",
                    background: "rgba(10,11,13,0.85)",
                    border: "1px solid rgba(76,175,80,0.3)",
                    borderRadius: 4,
                    backdropFilter: "blur(12px)",
                }}
            >
                <span
                    className="font-mono"
                    style={{
                        fontSize: "0.6rem",
                        color: "#4caf50",
                        letterSpacing: "0.15em",
                    }}
                >
                    ✓ LEVEL {levelId} COMPLETE · {systemName}
                </span>
            </div>

            <SkipButton onSkip={handleSkip} label={isLastLevel ? "SKIP TO ENDING" : "SKIP TO NEXT"} />

            <SceneStateSystem
                scenes={scenes}
                onComplete={handleComplete}
                onSkip={handleSkip}
            />
        </div>
    );
};

export default LevelSuccess;