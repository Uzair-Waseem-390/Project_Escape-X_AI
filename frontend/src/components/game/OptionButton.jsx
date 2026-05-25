import { motion } from "framer-motion";

/**
 * OptionButton — single answer option (A/B/C/D).
 */
const OptionButton = ({ letter, text, isSelected, isCorrect, isRevealed, onClick, disabled }) => {
    const getBorderColor = () => {
        if (!isRevealed) return "rgba(255,255,255,0.12)";
        if (isCorrect) return "rgba(76,175,80,0.5)";
        if (isSelected && !isCorrect) return "rgba(229,57,53,0.5)";
        return "rgba(255,255,255,0.12)";
    };

    const getBgColor = () => {
        if (!isRevealed) return "rgba(255,255,255,0.03)";
        if (isCorrect) return "rgba(76,175,80,0.08)";
        if (isSelected && !isCorrect) return "rgba(229,57,53,0.08)";
        return "rgba(255,255,255,0.03)";
    };

    return (
        <motion.button
            onClick={onClick}
            disabled={disabled}
            whileHover={!disabled ? { scale: 1.01, borderColor: "rgba(229,57,53,0.5)" } : {}}
            whileTap={!disabled ? { scale: 0.98 } : {}}
            style={{
                display: "flex",
                alignItems: "center",
                gap: "0.9rem",
                width: "100%",
                padding: "12px 16px",
                background: getBgColor(),
                border: `1px solid ${getBorderColor()}`,
                borderRadius: 6,
                cursor: disabled ? "default" : "pointer",
                textAlign: "left",
                transition: "border-color 0.2s, background 0.2s",
                opacity: disabled && !isRevealed ? 0.5 : 1,
            }}
        >
            {/* Letter badge */}
            <div
                style={{
                    width: 36,
                    height: 36,
                    borderRadius: 4,
                    background: isRevealed
                        ? isCorrect
                            ? "rgba(76,175,80,0.15)"
                            : isSelected
                                ? "rgba(229,57,53,0.15)"
                                : "rgba(255,255,255,0.05)"
                        : "rgba(255,255,255,0.05)",
                    border: `1px solid ${isRevealed
                            ? isCorrect
                                ? "rgba(76,175,80,0.4)"
                                : isSelected
                                    ? "rgba(229,57,53,0.4)"
                                    : "rgba(255,255,255,0.1)"
                            : "rgba(255,255,255,0.1)"
                        }`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                }}
            >
                <span
                    className="font-mono"
                    style={{
                        fontSize: "0.85rem",
                        fontWeight: 700,
                        color: isRevealed
                            ? isCorrect
                                ? "#4caf50"
                                : isSelected
                                    ? "var(--red-400)"
                                    : "var(--grey-400)"
                            : "var(--grey-300)",
                    }}
                >
                    {letter}
                </span>
            </div>

            {/* Option text */}
            <span
                className="font-body"
                style={{
                    fontSize: "0.9rem",
                    color: isRevealed
                        ? isCorrect
                            ? "#4caf50"
                            : isSelected
                                ? "var(--red-400)"
                                : "var(--grey-400)"
                        : "var(--grey-200)",
                    lineHeight: 1.5,
                }}
            >
                {text}
            </span>

            {/* Correct/wrong indicator */}
            {isRevealed && isCorrect && (
                <span style={{ marginLeft: "auto", fontSize: "1rem" }}>✓</span>
            )}
            {isRevealed && isSelected && !isCorrect && (
                <span style={{ marginLeft: "auto", fontSize: "1rem" }}>✗</span>
            )}
        </motion.button>
    );
};

export default OptionButton;