import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import OptionButton from "./OptionButton";

const OPTIONS = ["A", "B", "C", "D"];

/**
 * QuestionPanel — displays current question + options + feedback.
 */
const QuestionPanel = ({ question, feedback, onSubmit, onNext, disabled }) => {
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [showFeedback, setShowFeedback] = useState(false);

    const handleSelect = async (letter) => {
        if (selectedAnswer || disabled) return;
        setSelectedAnswer(letter);
        const result = await onSubmit(letter);
        if (result) {
            setShowFeedback(true);
        }
    };

    const handleNext = () => {
        setSelectedAnswer(null);
        setShowFeedback(false);
        onNext();
    };

    if (!question) {
        return (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%" }}>
                <span className="font-mono" style={{ color: "var(--grey-400)", letterSpacing: "0.1em" }}>Loading question...</span>
            </div>
        );
    }

    const q = question.question;
    const options = [
        { letter: "A", text: q.option_a },
        { letter: "B", text: q.option_b },
        { letter: "C", text: q.option_c },
        { letter: "D", text: q.option_d },
    ];

    return (
        <AnimatePresence mode="wait">
            <motion.div
                key={question.order}
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
                style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "1.25rem",
                    height: "100%",
                }}
            >
                {/* Question number + text */}
                <div>
                    <div
                        className="font-mono"
                        style={{
                            fontSize: "0.55rem",
                            color: "var(--red-400)",
                            letterSpacing: "0.15em",
                            textTransform: "uppercase",
                            marginBottom: "0.6rem",
                        }}
                    >
                        QUESTION {question.order} OF 15
                    </div>
                    <p
                        className="font-body"
                        style={{
                            fontSize: "1.05rem",
                            color: "var(--white)",
                            lineHeight: 1.7,
                            letterSpacing: "0.02em",
                        }}
                    >
                        {q.text}
                    </p>
                </div>

                {/* Options */}
                <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
                    {options.map((opt) => (
                        <OptionButton
                            key={opt.letter}
                            letter={opt.letter}
                            text={opt.text}
                            isSelected={selectedAnswer === opt.letter}
                            isCorrect={showFeedback && feedback?.correct_option === opt.letter}
                            isRevealed={showFeedback}
                            onClick={() => handleSelect(opt.letter)}
                            disabled={showFeedback}
                        />
                    ))}
                </div>

                {/* Feedback section */}
                {showFeedback && feedback && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        transition={{ duration: 0.3 }}
                    >
                        <div
                            style={{
                                background: feedback.is_correct
                                    ? "rgba(76,175,80,0.06)"
                                    : "var(--red-subtle)",
                                border: `1px solid ${feedback.is_correct ? "rgba(76,175,80,0.2)" : "rgba(229,57,53,0.2)"}`,
                                borderRadius: 6,
                                padding: "1rem 1.25rem",
                                marginTop: "0.25rem",
                            }}
                        >
                            <div
                                className="font-mono"
                                style={{
                                    fontSize: "0.65rem",
                                    color: feedback.is_correct ? "#4caf50" : "var(--red-400)",
                                    letterSpacing: "0.1em",
                                    marginBottom: "0.5rem",
                                }}
                            >
                                {feedback.is_correct ? "✓ CORRECT! +2 POINTS" : "✗ INCORRECT —2 POINTS"}
                            </div>
                            {!feedback.is_correct && feedback.explanation && (
                                <p className="font-body" style={{ fontSize: "0.85rem", color: "var(--grey-300)", lineHeight: 1.6, marginBottom: "0.75rem" }}>
                                    {feedback.explanation}
                                </p>
                            )}
                            <button
                                className="btn-primary"
                                onClick={handleNext}
                                style={{
                                    padding: "10px 24px",
                                    fontSize: "0.75rem",
                                    display: "inline-flex",
                                    width: "auto",
                                }}
                            >
                                {question.order === 15 ? "FINISH LEVEL ▸" : "NEXT QUESTION ▸"}
                            </button>
                        </div>
                    </motion.div>
                )}
            </motion.div>
        </AnimatePresence>
    );
};

export default QuestionPanel;