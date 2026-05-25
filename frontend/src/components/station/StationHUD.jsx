import { useNavigate } from "react-router-dom";
import { Button, HUDTag } from "../ui/UIKit";

/**
 * StationHUD — Overlay HUD on the space station page.
 * Shows mission status + dashboard button.
 */
const StationHUD = ({ highestUnlocked, completedLevels }) => {
    const navigate = useNavigate();

    return (
        <div
            style={{
                position: "fixed",
                top: 0,
                left: 0,
                right: 0,
                zIndex: 50,
                padding: "1.25rem",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                pointerEvents: "none",
            }}
        >
            {/* Left: Status */}
            <div style={{ pointerEvents: "auto" }}>
                <HUDTag>SPACE STATION — DAMAGE REPORT</HUDTag>
                <div
                    className="font-mono"
                    style={{
                        fontSize: "0.55rem",
                        color: "var(--grey-400)",
                        letterSpacing: "0.1em",
                        marginTop: "0.4rem",
                        padding: "0 0 0 4px",
                    }}
                >
                    {completedLevels}/5 SYSTEMS REPAIRED · ROTATE TO INSPECT
                </div>
            </div>

            {/* Right: Dashboard button */}
            <div style={{ pointerEvents: "auto" }}>
                <Button
                    variant="secondary"
                    onClick={() => navigate("/dashboard")}
                    style={{ padding: "8px 18px", fontSize: "0.65rem", letterSpacing: "0.1em" }}
                >
                    ← DASHBOARD
                </Button>
            </div>
        </div>
    );
};

export default StationHUD;