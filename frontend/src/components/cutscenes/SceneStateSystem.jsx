import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * SceneStateSystem — Reusable cutscene engine.
 * Props:
 *   scenes: Array of { type, text?, icon?, duration }
 *     type: "text" | "alert" | "action"
 *   onComplete: Called when all scenes finish
 *   onSkip: Called when user skips
 */

const sceneVariants = {
    enter: { opacity: 0, y: 30, filter: "blur(4px)" },
    center: { opacity: 1, y: 0, filter: "blur(0px)" },
    exit: { opacity: 0, y: -20, filter: "blur(4px)" },
};

const SceneStateSystem = ({ scenes, onComplete, onSkip }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isComplete, setIsComplete] = useState(false);

    const advance = useCallback(() => {
        if (currentIndex < scenes.length - 1) {
            setCurrentIndex((prev) => prev + 1);
        } else if (!isComplete) {
            setIsComplete(true);
            onComplete?.();
        }
    }, [currentIndex, scenes.length, isComplete, onComplete]);

    // Auto-advance based on duration
    useEffect(() => {
        if (isComplete) return;
        const scene = scenes[currentIndex];
        if (!scene?.duration) return;

        const timer = setTimeout(advance, scene.duration);
        return () => clearTimeout(timer);
    }, [currentIndex, scenes, advance, isComplete]);

    // Keyboard: Space or Enter to advance, Escape to skip
    useEffect(() => {
        const handleKey = (e) => {
            if (e.key === " " || e.key === "Enter") {
                e.preventDefault();
                advance();
            } else if (e.key === "Escape") {
                onSkip?.();
            }
        };
        window.addEventListener("keydown", handleKey);
        return () => window.removeEventListener("keydown", handleKey);
    }, [advance, onSkip]);

    const currentScene = scenes[currentIndex];
    if (!currentScene) return null;

    // Progress dots
    const progress = ((currentIndex + 1) / scenes.length) * 100;

    return (
        <div
            style={{
                position: "relative",
                minHeight: "100vh",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                padding: "4rem 1.5rem",
                overflow: "hidden",
            }}
        >
            {/* Background */}
            <div
                style={{
                    position: "absolute",
                    inset: 0,
                    background: "radial-gradient(ellipse 80% 60% at 50% 40%, rgba(229,57,53,0.08), transparent 60%), radial-gradient(ellipse 40% 30% at 20% 70%, rgba(0,188,212,0.04), transparent 60%)",
                    pointerEvents: "none",
                }}
            />

            {/* Progress bar */}
            <div
                style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    height: 2,
                    background: "rgba(255,255,255,0.06)",
                    zIndex: 5,
                }}
            >
                <motion.div
                    style={{
                        height: "100%",
                        background: "linear-gradient(90deg, var(--red-600), var(--red-400))",
                        boxShadow: "0 0 8px var(--red-glow)",
                    }}
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.4, ease: "easeInOut" }}
                />
            </div>

            {/* Scene content */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={currentIndex}
                    variants={sceneVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: 0.55, ease: [0.25, 0.1, 0.25, 1] }}
                    style={{
                        maxWidth: 680,
                        width: "100%",
                        textAlign: "center",
                        position: "relative",
                        zIndex: 2,
                    }}
                >
                    {/* Type: Alert */}
                    {currentScene.type === "alert" && (
                        <div
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                gap: "1.5rem",
                            }}
                        >
                            {/* Alert icon */}
                            <motion.div
                                animate={{
                                    scale: [1, 1.08, 1],
                                    opacity: [0.6, 1, 0.6],
                                }}
                                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                                style={{
                                    width: 80,
                                    height: 80,
                                    borderRadius: "50%",
                                    background: "var(--red-subtle)",
                                    border: "2px solid rgba(229,57,53,0.4)",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    fontSize: "2.2rem",
                                }}
                            >
                                {currentScene.icon || "⚠"}
                            </motion.div>

                            {/* Alert text */}
                            <div
                                style={{
                                    background: "rgba(229,57,53,0.06)",
                                    border: "1px solid rgba(229,57,53,0.2)",
                                    borderRadius: 6,
                                    padding: "1.5rem 2rem",
                                    maxWidth: 560,
                                }}
                            >
                                <div
                                    className="font-mono"
                                    style={{
                                        fontSize: "0.6rem",
                                        color: "var(--red-400)",
                                        letterSpacing: "0.2em",
                                        marginBottom: "0.5rem",
                                    }}
                                >
                                    SYSTEM FAILURE DETECTED
                                </div>
                                <p
                                    className="font-display"
                                    style={{
                                        fontSize: "clamp(1.2rem, 2.5vw, 1.6rem)",
                                        fontWeight: 700,
                                        color: "var(--red-400)",
                                        textTransform: "uppercase",
                                        letterSpacing: "0.04em",
                                        lineHeight: 1.3,
                                    }}
                                >
                                    {currentScene.text}
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Type: Text */}
                    {currentScene.type === "text" && (
                        <div style={{ maxWidth: 580, margin: "0 auto" }}>
                            {currentScene.icon && (
                                <div style={{ fontSize: "2.5rem", marginBottom: "1.5rem" }}>
                                    {currentScene.icon}
                                </div>
                            )}
                            <p
                                className="font-body"
                                style={{
                                    fontSize: "clamp(1rem, 2vw, 1.25rem)",
                                    color: "var(--grey-200)",
                                    lineHeight: 1.8,
                                    letterSpacing: "0.02em",
                                }}
                            >
                                {currentScene.text}
                            </p>
                        </div>
                    )}

                    {/* Type: Action */}
                    {currentScene.type === "action" && (
                        <div
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                gap: "1.5rem",
                            }}
                        >
                            <p
                                className="font-display"
                                style={{
                                    fontSize: "clamp(1.4rem, 3vw, 2rem)",
                                    fontWeight: 800,
                                    color: "var(--white)",
                                    textTransform: "uppercase",
                                    letterSpacing: "0.04em",
                                }}
                            >
                                {currentScene.text}
                            </p>
                            <motion.button
                                className="btn-primary"
                                onClick={advance}
                                whileHover={{ scale: 1.03 }}
                                whileTap={{ scale: 0.97 }}
                                style={{
                                    padding: "16px 40px",
                                    fontSize: "0.9rem",
                                    cursor: "pointer",
                                }}
                            >
                                {currentScene.buttonText || "BEGIN REPAIR"}
                            </motion.button>
                        </div>
                    )}
                </motion.div>
            </AnimatePresence>

            {/* Click-to-continue hint */}
            {currentScene.type !== "action" && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.5 }}
                    transition={{ delay: 2, duration: 0.8 }}
                    style={{
                        position: "absolute",
                        bottom: "3rem",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: "0.5rem",
                        zIndex: 2,
                    }}
                >
                    <span
                        className="font-mono"
                        style={{
                            fontSize: "0.6rem",
                            color: "var(--grey-400)",
                            letterSpacing: "0.15em",
                        }}
                    >
                        CLICK OR PRESS SPACE TO CONTINUE
                    </span>
                    <motion.div
                        animate={{ y: [0, 6, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                        style={{
                            width: 1,
                            height: 20,
                            background: "linear-gradient(180deg, var(--red-500), transparent)",
                        }}
                    />
                </motion.div>
            )}

            {/* Click anywhere to advance */}
            {currentScene.type !== "action" && (
                <div
                    onClick={advance}
                    style={{
                        position: "absolute",
                        inset: 0,
                        zIndex: 1,
                        cursor: "pointer",
                    }}
                />
            )}
        </div>
    );
};

export default SceneStateSystem;