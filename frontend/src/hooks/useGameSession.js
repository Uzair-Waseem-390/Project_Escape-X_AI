import { useState, useCallback, useRef, useEffect } from "react";
import { gameAPI } from "../api/game";

const SUBJECT_ORDER = ["math", "computer", "physics", "chemistry", "gk"];
const SUBJECT_LABELS = {
    math: "Mathematics",
    computer: "Computer Science",
    physics: "Physics",
    chemistry: "Chemistry",
    gk: "General Knowledge",
};
const LEVEL_DURATION = 15 * 60; // 15 minutes in seconds

/**
 * useGameSession — manages the entire gameplay state.
 * @param {number} levelId - The level being played
 * @returns {object} All game state + actions
 */
export const useGameSession = (levelId) => {
    const [session, setSession] = useState(null); // Full session object
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0); // 0-14
    const [score, setScore] = useState(0);
    const [timeLeft, setTimeLeft] = useState(LEVEL_DURATION);
    const [phase, setPhase] = useState("loading"); // loading | playing | subject-transition | completed | timeout
    const [feedback, setFeedback] = useState(null); // { is_correct, points_delta, correct_option, explanation }
    const [currentSubject, setCurrentSubject] = useState(SUBJECT_ORDER[0]);
    const [subjectQuestionIndex, setSubjectQuestionIndex] = useState(0); // 0-2 within subject
    const [isTimerActive, setIsTimerActive] = useState(false);
    const timerRef = useRef(null);
    const levelTimerRef = useRef(null);

    // ── Start session ──────────────────────────────────────────────────
    const startSession = useCallback(async () => {
        setPhase("loading");
        try {
            const sessionData = await gameAPI.startSession(levelId);
            setSession(sessionData);
            setScore(sessionData.score);
            setCurrentQuestionIndex(0);
            setCurrentSubject(SUBJECT_ORDER[0]);
            setSubjectQuestionIndex(0);
            setTimeLeft(LEVEL_DURATION);
            setPhase("playing");
            setIsTimerActive(true);

            // Start first subject timer
            await gameAPI.updateTimer(sessionData.id, SUBJECT_ORDER[0], "start");
        } catch (err) {
            console.error("Failed to start session:", err);
            setPhase("error");
        }
    }, [levelId]);

    // ── Level timer countdown ──────────────────────────────────────────
    useEffect(() => {
        if (!isTimerActive || phase !== "playing") return;

        levelTimerRef.current = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(levelTimerRef.current);
                    setIsTimerActive(false);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(levelTimerRef.current);
    }, [isTimerActive, phase]);

    // ── Auto-complete on timeout ──────────────────────────────────────
    useEffect(() => {
        if (timeLeft === 0 && session && phase === "playing") {
            handleCompleteLevel();
        }
    }, [timeLeft]);

    // ── Submit answer ──────────────────────────────────────────────────
    const submitAnswer = useCallback(
        async (answer) => {
            if (!session || feedback) return; // Prevent double-submit

            const questions = session.session_questions;
            const currentQ = questions[currentQuestionIndex];

            try {
                const result = await gameAPI.submitAnswer(session.id, currentQ.order, answer);

                setScore(result.score);
                setFeedback({
                    is_correct: result.is_correct,
                    points_delta: result.points_delta,
                    correct_option: result.correct_option,
                    explanation: result.explanation,
                });

                // Update session with answer result
                setSession((prev) => {
                    const updated = { ...prev };
                    updated.session_questions = [...prev.session_questions];
                    updated.session_questions[currentQuestionIndex] = {
                        ...updated.session_questions[currentQuestionIndex],
                        is_correct: result.is_correct,
                        user_answer: answer,
                    };
                    updated.score = result.score;
                    return updated;
                });

                return result;
            } catch (err) {
                console.error("Failed to submit answer:", err);
                return null;
            }
        },
        [session, currentQuestionIndex, feedback]
    );

    // ── Move to next question ─────────────────────────────────────────
    const nextQuestion = useCallback(async () => {
        if (!session) return;

        const questions = session.session_questions;
        const nextIndex = currentQuestionIndex + 1;

        // Clear feedback
        setFeedback(null);

        if (nextIndex >= questions.length) {
            // All 15 questions answered — complete level
            await handleCompleteLevel();
            return;
        }

        const nextQ = questions[nextIndex];
        const nextSubject = nextQ.subject;

        // Check if subject changed
        if (nextSubject !== currentSubject) {
            // Stop current subject timer
            await gameAPI.updateTimer(session.id, currentSubject, "stop");

            // Show transition
            setPhase("subject-transition");
            setCurrentSubject(nextSubject);
            setSubjectQuestionIndex(0);

            // After transition delay, start new subject
            setTimeout(async () => {
                await gameAPI.updateTimer(session.id, nextSubject, "start");
                setCurrentQuestionIndex(nextIndex);
                setPhase("playing");
            }, 2500);
        } else {
            setCurrentQuestionIndex(nextIndex);
            setSubjectQuestionIndex((prev) => prev + 1);
        }
    }, [session, currentQuestionIndex, currentSubject]);

    // ── Complete level ─────────────────────────────────────────────────
    const handleCompleteLevel = useCallback(async () => {
        if (!session || phase === "completed") return;

        setIsTimerActive(false);
        clearInterval(levelTimerRef.current);

        // Stop current subject timer
        try {
            await gameAPI.updateTimer(session.id, currentSubject, "stop");
        } catch { }

        try {
            const result = await gameAPI.completeLevel(session.id);
            setSession((prev) => ({
                ...prev,
                status: result.passed ? "passed" : "failed",
            }));
            setPhase("completed");

            // Trigger AI report generation
            const { aiAPI } = await import("../api/ai");
            try {
                await aiAPI.generateReport(session.id);
            } catch { }

            return result;
        } catch (err) {
            console.error("Failed to complete level:", err);
        }
    }, [session, currentSubject, phase]);

    // ── Abandon session (exit without completing) ──────────────────────
    const abandonSession = useCallback(async () => {
        if (!session) return;

        setIsTimerActive(false);
        clearInterval(levelTimerRef.current);

        // Stop current subject timer
        try {
            await gameAPI.updateTimer(session.id, currentSubject, "stop");
        } catch { }

        // Mark session as failed/completed on backend
        try {
            await gameAPI.completeLevel(session.id);
        } catch { }

        // Don't set phase to "completed" — just reset locally
        setSession(null);
    }, [session, currentSubject]);

    // ── Derived values ─────────────────────────────────────────────────
    const currentQuestion = session?.session_questions?.[currentQuestionIndex];
    const totalQuestions = session?.session_questions?.length || 15;
    const questionNumber = currentQuestionIndex + 1;
    const subjectProgress = `${subjectQuestionIndex + 1}/3`;
    const formattedTime = `${Math.floor(timeLeft / 60)}:${String(timeLeft % 60).padStart(2, "0")}`;

    return {
        // State
        session,
        currentQuestion,
        currentQuestionIndex,
        score,
        timeLeft,
        formattedTime,
        phase,
        feedback,
        currentSubject,
        subjectLabel: SUBJECT_LABELS[currentSubject] || currentSubject,
        subjectProgress,
        questionNumber,
        totalQuestions,

        // Actions
        startSession,
        submitAnswer,
        nextQuestion,
        handleCompleteLevel,
        abandonSession,
    };
};