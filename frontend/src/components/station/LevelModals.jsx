import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Button } from "../ui/UIKit";

/**
 * LockedLevelModal — Shown when user clicks a locked level marker.
 */
export const LockedLevelModal = ({ level, system, onClose }) => (
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

/**
 * StartLevelModal — Shown when user clicks an unlocked level marker.
 * Two buttons: "Start Level" → cutscene, "Back" → return to ship.
 */
export const StartLevelModal = ({ level, system, completed, onClose }) => {
    const navigate = useNavigate();

    const statusColor = completed ? "#26c6da" : "var(--red-400)";
    const statusBg = completed ? "rgba(38,198,218,0.06)" : "var(--red-subtle)";
    const statusText = completed ? "SYSTEM REPAIRED ✓" : "DAMAGE DETECTED ⚠";

    return (
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
                    border: `1px solid ${statusColor}33`,
                    borderRadius: 8,
                    padding: "2rem",
                    maxWidth: 440,
                    width: "100%",
                    textAlign: "center",
                }}
            >
                <div style={{ marginBottom: "1rem", display: "flex", justifyContent: "center" }}>
                    <span
                        className="font-mono"
                        style={{
                            fontSize: "0.6rem",
                            color: statusColor,
                            letterSpacing: "0.12em",
                            padding: "4px 12px",
                            background: statusBg,
                            border: `1px solid ${statusColor}33`,
                            borderRadius: 2,
                        }}
                    >
                        {statusText}
                    </span>
                </div>

                <h3
                    className="font-display"
                    style={{
                        fontSize: "1.2rem",
                        fontWeight: 800,
                        color: "var(--white)",
                        textTransform: "uppercase",
                        letterSpacing: "0.04em",
                        marginBottom: "0.4rem",
                    }}
                >
                    LEVEL {level}
                </h3>
                <p
                    className="font-heading"
                    style={{
                        fontSize: "0.9rem",
                        color: statusColor,
                        textTransform: "uppercase",
                        letterSpacing: "0.08em",
                        marginBottom: "1.25rem",
                    }}
                >
                    {system}
                </p>

                <div style={{ display: "flex", gap: "0.75rem" }}>
                    <Button variant="secondary" onClick={onClose} style={{ flex: 1, padding: "12px 20px", fontSize: "0.78rem" }}>
                        ← BACK
                    </Button>
                    <Button variant="primary" onClick={() => navigate(`/level/${level}/intro`)} style={{ flex: 1, padding: "12px 20px", fontSize: "0.78rem" }}>
                        {completed ? "REPLAY ▸" : "START LEVEL ▸"}
                    </Button>
                </div>
            </motion.div>
        </motion.div>
    );
};