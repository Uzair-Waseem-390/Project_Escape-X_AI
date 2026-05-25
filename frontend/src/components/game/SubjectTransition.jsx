import { motion } from "framer-motion";

const SUBJECT_ICONS = {
    math: "∑",
    computer: "</>",
    physics: "⚡",
    chemistry: "⚗️",
    gk: "🌐",
};

/**
 * SubjectTransition — shown between subject blocks.
 */
const SubjectTransition = ({ subject, subjectLabel }) => (
    <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 1.05 }}
        transition={{ duration: 0.4 }}
        style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "1.5rem",
            padding: "3rem",
            height: "100%",
        }}
    >
        <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            style={{
                width: 80,
                height: 80,
                borderRadius: "50%",
                background: "var(--red-subtle)",
                border: "2px solid rgba(229,57,53,0.3)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "2rem",
            }}
        >
            {SUBJECT_ICONS[subject] || "📚"}
        </motion.div>

        <div style={{ textAlign: "center" }}>
            <div className="font-mono" style={{ fontSize: "0.6rem", color: "var(--red-400)", letterSpacing: "0.2em", marginBottom: "0.5rem" }}>
                NEXT SYSTEM
            </div>
            <h2 className="font-display" style={{ fontSize: "1.3rem", fontWeight: 700, color: "var(--white)", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                {subjectLabel}
            </h2>
        </div>

        {/* Progress dots */}
        <div style={{ display: "flex", gap: "0.5rem" }}>
            {[0, 1, 2].map((i) => (
                <motion.div
                    key={i}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: i * 0.3, duration: 0.3 }}
                    style={{
                        width: 8,
                        height: 8,
                        borderRadius: "50%",
                        background: "var(--red-400)",
                        boxShadow: "0 0 8px var(--red-glow)",
                    }}
                />
            ))}
        </div>

        <span className="font-mono" style={{ fontSize: "0.6rem", color: "var(--grey-400)", letterSpacing: "0.1em" }}>
            3 QUESTIONS AHEAD
        </span>
    </motion.div>
);

export default SubjectTransition;