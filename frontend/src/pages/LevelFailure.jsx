import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import SceneStateSystem from "../components/cutscenes/SceneStateSystem";
import SkipButton from "../components/ui/SkipButton";
import StarField from "../components/ui/StarField";

import LEVEL_1_FAILURE_SCENES from "../components/cutscenes/Level1FailureScene";
import LEVEL_2_FAILURE_SCENES from "../components/cutscenes/Level2FailureScene";
import LEVEL_3_FAILURE_SCENES from "../components/cutscenes/Level3FailureScene";
import LEVEL_4_FAILURE_SCENES from "../components/cutscenes/Level4FailureScene";
import LEVEL_5_FAILURE_SCENES from "../components/cutscenes/Level5FailureScene";

const FAILURE_SCENES = {
    1: LEVEL_1_FAILURE_SCENES,
    2: LEVEL_2_FAILURE_SCENES,
    3: LEVEL_3_FAILURE_SCENES,
    4: LEVEL_4_FAILURE_SCENES,
    5: LEVEL_5_FAILURE_SCENES,
};

const SYSTEM_NAMES = {
    1: "NAVIGATION SYSTEM",
    2: "POWER DISTRIBUTION",
    3: "COMMUNICATION ARRAY",
    4: "LIFE SUPPORT",
    5: "ENGINE CORE",
};

/**
 * LevelFailure — Shown when a level is failed (time up or score too low).
 * Route: /level/:id/failure
 */
const LevelFailure = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const levelId = parseInt(id);
    const [isComplete, setIsComplete] = useState(false);

    const scenes = FAILURE_SCENES[levelId];
    const systemName = SYSTEM_NAMES[levelId] || `LEVEL ${levelId}`;

    const handleComplete = () => {
        if (isComplete) return;
        setIsComplete(true);
        // Retry — go back to level intro then play
        navigate(`/level/${levelId}/intro`, { replace: true });
    };

    const handleSkip = () => {
        if (isComplete) return;
        setIsComplete(true);
        navigate(`/level/${levelId}/intro`, { replace: true });
    };

    if (!scenes) return null;

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
                    border: "1px solid rgba(229,57,53,0.3)",
                    borderRadius: 4,
                    backdropFilter: "blur(12px)",
                }}
            >
                <span
                    className="font-mono"
                    style={{
                        fontSize: "0.6rem",
                        color: "var(--red-400)",
                        letterSpacing: "0.15em",
                    }}
                >
                    LEVEL {levelId} FAILED · {systemName}
                </span>
            </div>

            <SkipButton onSkip={handleSkip} label="SKIP & RETRY" />

            <SceneStateSystem
                scenes={scenes}
                onComplete={handleComplete}
                onSkip={handleSkip}
            />
        </div>
    );
};

export default LevelFailure;