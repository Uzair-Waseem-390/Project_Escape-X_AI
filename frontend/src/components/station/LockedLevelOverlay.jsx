import { motion } from "framer-motion";
import { Button } from "../ui/UIKit";

/**
 * LockedLevelModal — Shown when user clicks a locked level marker.
 */
const LockedLevelModal = ({ level, system, onClose }) => (
    <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        style={{
            position: "fixed",
            inset: 0,
            zIndex: 100,
            background: "rgba(0,0,0,0.75)",
            backdropFilter: "blur(6px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "1.5rem",
        }}
        onClick={onClose}
    >
        <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: "spring", damping: 20, stiffness: 200 }}
            onClick={(e) => e.stopPropagation()}
            style={{
                background: "var(--bg-card)",
                border: "1px solid rgba(229,57,53,0.25)",
                borderRadius: 8,
                padding: "2rem",
                maxWidth: 420,
                width: "100%",
                textAlign: "center",
            }}
        >
            <div style={{ fontSize: "2.5rem", marginBottom: "0.75rem" }}>🔒</div>
            <h3
                className="font-display"
                style={{
                    fontSize: "1.1rem",
                    fontWeight: 700,
                    color: "var(--white)",
                    textTransform: "uppercase",
                    letterSpacing: "0.04em",
                    marginBottom: "0.5rem",
                }}
            >
                LEVEL {level} LOCKED
            </h3>
            <p
                className="font-body"
                style={{ fontSize: "0.85rem", color: "var(--grey-400)", lineHeight: 1.6, marginBottom: "0.5rem" }}
            >
                <strong style={{ color: "var(--grey-200)" }}>{system}</strong> is not yet accessible.
            </p>
            <p
                className="font-mono"
                style={{
                    fontSize: "0.7rem",
                    color: "var(--red-400)",
                    letterSpacing: "0.06em",
                    marginBottom: "1.5rem",
                    padding: "0.6rem 1rem",
                    background: "var(--red-subtle)",
                    border: "1px solid rgba(229,57,53,0.15)",
                    borderRadius: 4,
                }}
            >
                Complete previous levels to unlock this system repair.
            </p>
            <Button variant="primary" onClick={onClose} style={{ width: "100%", padding: "12px 20px", fontSize: "0.8rem" }}>
                ← BACK TO SPACECRAFT
            </Button>
        </motion.div>
    </motion.div>
);

export default LockedLevelModal;