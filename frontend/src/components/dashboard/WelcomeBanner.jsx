import { HUDTag } from "../ui/UIKit";

/**
 * WelcomeBanner — greets the user by name with mission status.
 */
const WelcomeBanner = ({ user }) => (
    <div>
        <div style={{ marginBottom: "0.5rem" }}>
            <HUDTag>MISSION CONTROL</HUDTag>
        </div>
        <h1
            className="font-display"
            style={{
                fontSize: "clamp(1.5rem, 3vw, 2rem)",
                fontWeight: 800,
                textTransform: "uppercase",
                letterSpacing: "0.03em",
                color: "var(--white)",
                lineHeight: 1.2,
            }}
        >
            WELCOME BACK,{" "}
            <span className="gradient-text-red">
                {user?.first_name?.toUpperCase() || "CADET"}
            </span>
        </h1>
        <p
            className="font-body"
            style={{ fontSize: "0.88rem", color: "var(--grey-400)", marginTop: "0.4rem" }}
        >
            {user?.email || ""}
        </p>
    </div>
);

export default WelcomeBanner;