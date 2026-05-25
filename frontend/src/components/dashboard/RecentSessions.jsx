import { useNavigate } from "react-router-dom";

/**
 * RecentSessions — table of last 10 sessions.
 */
const RecentSessions = ({ sessions }) => {
    const navigate = useNavigate();

    if (sessions.length === 0) return null;

    return (
        <div
            style={{
                background: "var(--bg-card)",
                border: "1px solid rgba(255,255,255,0.06)",
                borderRadius: 8,
                padding: "1.25rem 1.5rem",
            }}
        >
            <div
                className="font-mono"
                style={{
                    fontSize: "0.6rem",
                    color: "var(--red-400)",
                    letterSpacing: "0.15em",
                    textTransform: "uppercase",
                    marginBottom: "1rem",
                }}
            >
                ◈ RECENT MISSIONS
            </div>

            <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                        <tr>
                            {["LEVEL", "SCORE", "STATUS", "DATE"].map((h) => (
                                <th
                                    key={h}
                                    className="font-mono"
                                    style={{
                                        fontSize: "0.58rem",
                                        color: "var(--grey-400)",
                                        letterSpacing: "0.1em",
                                        textTransform: "uppercase",
                                        textAlign: "left",
                                        padding: "0.4rem 0.75rem",
                                        borderBottom: "1px solid rgba(255,255,255,0.06)",
                                    }}
                                >
                                    {h}
                                </th>
                            ))}
                            <th style={{ borderBottom: "1px solid rgba(255,255,255,0.06)", padding: "0.4rem 0.75rem" }} />
                        </tr>
                    </thead>
                    <tbody>
                        {sessions.map((session) => (
                            <tr
                                key={session.id}
                                style={{ borderBottom: "1px solid rgba(255,255,255,0.03)" }}
                            >
                                <td style={{ padding: "0.55rem 0.75rem" }}>
                                    <span className="font-mono" style={{ fontSize: "0.75rem", color: "var(--white)", fontWeight: 600 }}>
                                        L{session.level}
                                    </span>
                                </td>
                                <td style={{ padding: "0.55rem 0.75rem" }}>
                                    <span
                                        className="font-mono"
                                        style={{
                                            fontSize: "0.72rem",
                                            color: session.score >= 26 ? "#4caf50" : "var(--red-400)",
                                            fontWeight: 600,
                                        }}
                                    >
                                        {session.score}/30
                                    </span>
                                </td>
                                <td style={{ padding: "0.55rem 0.75rem" }}>
                                    <span
                                        className="font-mono"
                                        style={{
                                            fontSize: "0.6rem",
                                            padding: "2px 7px",
                                            borderRadius: 2,
                                            color:
                                                session.status === "passed"
                                                    ? "#4caf50"
                                                    : session.status === "failed"
                                                        ? "var(--red-400)"
                                                        : session.status === "timed_out"
                                                            ? "var(--amber-400, #ffb300)"
                                                            : "var(--cyan-400)",
                                            background:
                                                session.status === "passed"
                                                    ? "rgba(76,175,80,0.1)"
                                                    : session.status === "failed"
                                                        ? "var(--red-subtle)"
                                                        : session.status === "timed_out"
                                                            ? "rgba(255,179,0,0.08)"
                                                            : "rgba(38,198,218,0.06)",
                                            border: "1px solid rgba(255,255,255,0.06)",
                                            letterSpacing: "0.08em",
                                            textTransform: "uppercase",
                                        }}
                                    >
                                        {session.status.replace("_", " ")}
                                    </span>
                                </td>
                                <td style={{ padding: "0.55rem 0.75rem" }}>
                                    <span className="font-mono" style={{ fontSize: "0.65rem", color: "var(--grey-400)" }}>
                                        {new Date(session.started_at).toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                                    </span>
                                </td>
                                <td style={{ padding: "0.55rem 0.75rem", textAlign: "right" }}>
                                    <button
                                        onClick={() => navigate(`/level/${session.level}/intro`)}
                                        className="font-mono"
                                        style={{
                                            fontSize: "0.6rem",
                                            color: "var(--cyan-400)",
                                            background: "none",
                                            border: "none",
                                            cursor: "pointer",
                                            letterSpacing: "0.06em",
                                            textDecoration: "underline",
                                        }}
                                    >
                                        REPLAY
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default RecentSessions;