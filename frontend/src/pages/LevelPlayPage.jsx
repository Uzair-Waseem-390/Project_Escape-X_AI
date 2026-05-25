import { useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useGameSession } from "../hooks/useGameSession";
import { useAuth } from "../hooks/useAuth";
import StarField from "../components/ui/StarField";
import TimerBar from "../components/game/TimerBar";
import ScoreDisplay from "../components/game/ScoreDisplay";
import SubjectIndicator from "../components/game/SubjectIndicator";
import QuestionPanel from "../components/game/QuestionPanel";
import AICopilotPanel from "../components/game/AICopilotPanel";
import SubjectTransition from "../components/game/SubjectTransition";

/**
 * LevelPlayPage — Main gameplay page.
 * Route: /level/:id/play
 */
const LevelPlayPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const levelId = parseInt(id);
    const { isAuthenticated, loading: authLoading } = useAuth();

    const {
        session,
        currentQuestion,
        currentQuestionIndex,
        score,
        formattedTime,
        timeLeft,
        phase,
        feedback,
        currentSubject,
        subjectLabel,
        subjectProgress,
        questionNumber,
        totalQuestions,
        startSession,
        submitAnswer,
        nextQuestion,
        pointsDelta,
    } = useGameSession(levelId);

    // Start session on mount
    useEffect(() => {
        if (!authLoading && !isAuthenticated) {
            navigate("/login", { replace: true });
            return;
        }
        startSession();
    }, [authLoading, isAuthenticated]);

    // Handle level completion
    useEffect(() => {
        if (phase === "completed" && session) {
            const timer = setTimeout(() => {
                if (session.status === "passed") {
                    navigate(`/level/${levelId}/success`, { replace: true });
                } else {
                    navigate(`/level/${levelId}/failure`, { replace: true });
                }
            }, 1500);
            return () => clearTimeout(timer);
        }
    }, [phase, session, levelId, navigate]);

    const handleSubmit = useCallback(
        async (answer) => {
            return await submitAnswer(answer);
        },
        [submitAnswer]
    );

    const handleNext = useCallback(() => {
        nextQuestion();
    }, [nextQuestion]);

    if (phase === "loading" || !session) {
        return (
            <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--bg-primary)" }}>
                <StarField />
                <div className="noise-overlay" />
                <span className="font-mono" style={{ color: "var(--red-400)", letterSpacing: "0.15em", animation: "pulse-red 1.5s infinite", zIndex: 10 }}>
                    INITIALISING LEVEL {levelId}...
                </span>
            </div>
        );
    }

    return (
        <div style={{ minHeight: "100vh", background: "var(--bg-primary)", position: "relative" }}>
            <StarField />
            <div className="noise-overlay" />

            {/* Main layout */}
            <div
                style={{
                    position: "relative",
                    zIndex: 10,
                    display: "grid",
                    gridTemplateColumns: "1fr 380px",
                    gridTemplateRows: "auto 1fr",
                    gap: "0",
                    height: "100vh",
                    padding: "1rem",
                }}
                className="gameplay-layout"
            >
                {/* Top bar */}
                <div
                    style={{
                        gridColumn: "1 / -1",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: "1rem",
                        padding: "0.5rem 0",
                        flexWrap: "wrap",
                    }}
                >
                    <SubjectIndicator
                        subject={currentSubject}
                        subjectLabel={subjectLabel}
                        subjectProgress={subjectProgress}
                        questionNumber={questionNumber}
                        totalQuestions={totalQuestions}
                    />
                    <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                        <ScoreDisplay score={score} pointsDelta={feedback?.points_delta} />
                        <TimerBar timeLeft={timeLeft} formattedTime={formattedTime} />
                    </div>
                </div>

                {/* Left: Question panel or Subject transition */}
                <div style={{ overflow: "auto", padding: "1rem 0" }}>
                    {phase === "subject-transition" ? (
                        <SubjectTransition subject={currentSubject} subjectLabel={subjectLabel} />
                    ) : phase === "completed" ? (
                        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", gap: "1rem" }}>
                            <span className="font-display" style={{ fontSize: "1.5rem", color: session.status === "passed" ? "#4caf50" : "var(--red-400)", textTransform: "uppercase" }}>
                                {session.status === "passed" ? "LEVEL COMPLETE!" : "LEVEL FAILED"}
                            </span>
                            <span className="font-mono" style={{ color: "var(--grey-400)" }}>Redirecting...</span>
                        </div>
                    ) : (
                        <QuestionPanel
                            question={currentQuestion}
                            feedback={feedback}
                            onSubmit={handleSubmit}
                            onNext={handleNext}
                            disabled={phase !== "playing"}
                        />
                    )}
                </div>

                {/* Right: AI Copilot */}
                <div style={{ overflow: "hidden", padding: "0.5rem 0 0.5rem 1rem" }}>
                    <AICopilotPanel
                        sessionId={session.id}
                        questionOrder={currentQuestion?.order}
                        subject={currentSubject}
                    />
                </div>
            </div>

            <style>{`
        @media (max-width: 1024px) {
          .gameplay-layout {
            grid-template-columns: 1fr !important;
            grid-template-rows: auto 1fr auto !important;
            height: auto !important;
            min-height: 100vh;
          }
        }
      `}</style>
        </div>
    );
};

export default LevelPlayPage;