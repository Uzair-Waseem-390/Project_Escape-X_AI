import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import SceneStateSystem from "../components/cutscenes/SceneStateSystem";
import SkipButton from "../components/ui/SkipButton";
import StarField from "../components/ui/StarField";
import { Button } from "../components/ui/UIKit";

// Cutscene data imports
import LEVEL_1_SCENES from "../components/cutscenes/Level1Cutscene";
import LEVEL_2_SCENES from "../components/cutscenes/Level2Cutscene";
import LEVEL_3_SCENES from "../components/cutscenes/Level3Cutscene";
import LEVEL_4_SCENES from "../components/cutscenes/Level4Cutscene";
import LEVEL_5_SCENES from "../components/cutscenes/Level5Cutscene";

const LEVEL_SCENES = {
    1: LEVEL_1_SCENES,
    2: LEVEL_2_SCENES,
    3: LEVEL_3_SCENES,
    4: LEVEL_4_SCENES,
    5: LEVEL_5_SCENES,
};

const LEVEL_TITLES = {
    1: "NAVIGATION SYSTEM",
    2: "POWER DISTRIBUTION",
    3: "COMMUNICATION ARRAY",
    4: "LIFE SUPPORT",
    5: "ENGINE CORE",
};

/**
 * LevelIntro — Cutscene page shown before each level.
 * Route: /level/:id/intro
 */
const LevelIntro = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const levelId = parseInt(id);
    const [isComplete, setIsComplete] = useState(false);

    const scenes = LEVEL_SCENES[levelId];
    const levelTitle = LEVEL_TITLES[levelId] || `LEVEL ${levelId}`;

    // Redirect if invalid level
    useEffect(() => {
        if (!scenes || levelId < 1 || levelId > 5) {
            navigate("/dashboard", { replace: true });
        }
    }, [scenes, levelId, navigate]);

    const handleComplete = () => {
        if (isComplete) return;
        setIsComplete(true);
        navigate(`/level/${levelId}/play`, { replace: true });
    };

    const handleSkip = () => {
        if (isComplete) return;
        setIsComplete(true);
        navigate(`/level/${levelId}/play`, { replace: true });
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
                    border: "1px solid rgba(229,57,53,0.2)",
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
                    LEVEL {levelId} · {levelTitle}
                </span>
            </div>

            {/* Back to Dashboard button */}
            <div style={{ position: "fixed", top: "1.25rem", right: "5rem", zIndex: 100 }}>
                <Button
                    variant="secondary"
                    onClick={() => navigate("/dashboard")}
                    style={{ padding: "8px 16px", fontSize: "0.62rem", letterSpacing: "0.08em" }}
                >
                    ← DASHBOARD
                </Button>
            </div>

            {/* Skip button */}
            <SkipButton onSkip={handleSkip} />

            {/* Scene system */}
            <SceneStateSystem
                scenes={scenes}
                onComplete={handleComplete}
                onSkip={handleSkip}
            />
        </div>
    );
};

export default LevelIntro;