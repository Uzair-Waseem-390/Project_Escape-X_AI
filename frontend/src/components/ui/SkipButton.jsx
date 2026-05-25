import { motion } from "framer-motion";

/**
 * SkipButton — fixed top-right skip button for cutscenes.
 * Props:
 *   onSkip: Function to call when clicked
 *   label: Optional text override
 */
const SkipButton = ({ onSkip, label = "SKIP" }) => (
    <motion.button
        onClick={onSkip}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.8, duration: 0.4 }}
        style={{
            position: "fixed",
            top: "1.25rem",
            right: "1.25rem",
            zIndex: 100,
            padding: "8px 16px",
            background: "rgba(10,11,13,0.85)",
            border: "1px solid rgba(229,57,53,0.25)",
            borderRadius: 4,
            color: "var(--grey-300)",
            fontFamily: "var(--font-mono)",
            fontSize: "0.65rem",
            letterSpacing: "0.15em",
            cursor: "pointer",
            backdropFilter: "blur(12px)",
            transition: "border-color 0.2s, color 0.2s",
        }}
        whileHover={{
            borderColor: "rgba(229,57,53,0.6)",
            color: "var(--red-400)",
        }}
        whileTap={{ scale: 0.95 }}
    >
        {label} ▸
    </motion.button>
);

export default SkipButton;