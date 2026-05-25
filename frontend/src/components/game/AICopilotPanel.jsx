import { useState, useEffect } from "react";
import { useAIPolling } from "../../hooks/useAIPolling";
import { aiAPI } from "../../api/ai";

/**
 * AICopilotPanel — AI assistant sidebar for hints, explanations, and videos.
 */
const AICopilotPanel = ({ sessionId, questionOrder, subject }) => {
    const [chatHistory, setChatHistory] = useState([]);
    const [userMessage, setUserMessage] = useState("");
    const { aiLoading, aiResult, aiError, requestAI, clearAI } = useAIPolling();

    // Load chat history on mount
    useEffect(() => {
        if (!sessionId) return;
        const loadHistory = async () => {
            try {
                const history = await aiAPI.getChatHistory(sessionId);
                setChatHistory(history || []);
            } catch { }
        };
        loadHistory();
    }, [sessionId]);

    // Add new AI result to chat
    useEffect(() => {
        if (aiResult) {
            setChatHistory((prev) => [...prev, { ...aiResult, _local: true }]);
        }
    }, [aiResult]);

    const handleHint = () => {
        clearAI();
        requestAI(sessionId, questionOrder, "hint", "I need a hint.");
    };

    const handleExplain = () => {
        clearAI();
        requestAI(sessionId, questionOrder, "explanation", "Please explain this.");
    };

    const handleSendMessage = () => {
        if (!userMessage.trim()) return;
        clearAI();
        requestAI(sessionId, questionOrder, "explanation", userMessage);
        setUserMessage("");
    };

    const lastResult = chatHistory.filter((h) => h._local).pop();

    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                height: "100%",
                background: "var(--bg-card)",
                border: "1px solid rgba(38,198,218,0.15)",
                borderRadius: 8,
                overflow: "hidden",
            }}
        >
            {/* Header */}
            <div
                style={{
                    padding: "0.75rem 1rem",
                    borderBottom: "1px solid rgba(255,255,255,0.06)",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.6rem",
                }}
            >
                <span style={{ fontSize: "1.2rem" }}>🤖</span>
                <span className="font-mono" style={{ fontSize: "0.62rem", color: "var(--cyan-400)", letterSpacing: "0.1em" }}>
                    AI COPILOT
                </span>
                {aiLoading && (
                    <span className="font-mono" style={{ fontSize: "0.55rem", color: "var(--grey-400)", marginLeft: "auto", animation: "pulse-red 1.5s infinite" }}>
                        THINKING...
                    </span>
                )}
            </div>

            {/* Action buttons */}
            <div style={{ display: "flex", gap: "0.4rem", padding: "0.6rem 0.75rem", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                <button
                    onClick={handleHint}
                    disabled={aiLoading}
                    className="btn-secondary"
                    style={{ flex: 1, padding: "7px 10px", fontSize: "0.62rem", letterSpacing: "0.06em" }}
                >
                    💡 HINT
                </button>
                <button
                    onClick={handleExplain}
                    disabled={aiLoading}
                    className="btn-secondary"
                    style={{ flex: 1, padding: "7px 10px", fontSize: "0.62rem", letterSpacing: "0.06em" }}
                >
                    📖 EXPLAIN
                </button>
            </div>

            {/* Response area */}
            <div style={{ flex: 1, overflowY: "auto", padding: "0.75rem", minHeight: 0 }}>
                {aiError && (
                    <div style={{ padding: "0.5rem", background: "var(--red-subtle)", border: "1px solid rgba(229,57,53,0.2)", borderRadius: 4, marginBottom: "0.5rem" }}>
                        <span className="font-mono" style={{ fontSize: "0.6rem", color: "var(--red-400)" }}>{aiError}</span>
                    </div>
                )}

                {lastResult && (
                    <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
                        {/* Hint */}
                        {lastResult.hint_text && (
                            <div style={{ background: "rgba(38,198,218,0.05)", border: "1px solid rgba(38,198,218,0.15)", borderRadius: 4, padding: "0.7rem" }}>
                                <div className="font-mono" style={{ fontSize: "0.5rem", color: "var(--cyan-400)", letterSpacing: "0.1em", marginBottom: "0.3rem" }}>💡 HINT</div>
                                <p className="font-body" style={{ fontSize: "0.78rem", color: "var(--grey-200)", lineHeight: 1.6 }}>{lastResult.hint_text}</p>
                            </div>
                        )}

                        {/* Explanation */}
                        {lastResult.explanation_text && (
                            <div style={{ background: "rgba(229,57,53,0.04)", border: "1px solid rgba(229,57,53,0.12)", borderRadius: 4, padding: "0.7rem" }}>
                                <div className="font-mono" style={{ fontSize: "0.5rem", color: "var(--red-400)", letterSpacing: "0.1em", marginBottom: "0.3rem" }}>📖 EXPLANATION</div>
                                <p className="font-body" style={{ fontSize: "0.78rem", color: "var(--grey-200)", lineHeight: 1.6, whiteSpace: "pre-line" }}>{lastResult.explanation_text}</p>
                            </div>
                        )}

                        {/* YouTube link */}
                        {lastResult.youtube_url && (
                            <a
                                href={lastResult.youtube_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{
                                    display: "block",
                                    padding: "0.7rem",
                                    background: "rgba(255,0,0,0.04)",
                                    border: "1px solid rgba(229,57,53,0.15)",
                                    borderRadius: 4,
                                    textDecoration: "none",
                                }}
                            >
                                <div className="font-mono" style={{ fontSize: "0.5rem", color: "var(--red-400)", letterSpacing: "0.1em", marginBottom: "0.3rem" }}>🎥 RECOMMENDED VIDEO</div>
                                <span className="font-body" style={{ fontSize: "0.75rem", color: "var(--cyan-400)" }}>
                                    {lastResult.youtube_title}
                                </span>
                            </a>
                        )}
                    </div>
                )}

                {!lastResult && !aiLoading && (
                    <div style={{ textAlign: "center", padding: "2rem 0" }}>
                        <span className="font-mono" style={{ fontSize: "0.6rem", color: "var(--grey-400)", letterSpacing: "0.08em" }}>
                            Click HINT or EXPLAIN for AI assistance
                        </span>
                    </div>
                )}
            </div>

            {/* Chat input */}
            <div style={{ padding: "0.6rem 0.75rem", borderTop: "1px solid rgba(255,255,255,0.04)", display: "flex", gap: "0.4rem" }}>
                <input
                    type="text"
                    value={userMessage}
                    onChange={(e) => setUserMessage(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                    placeholder="Ask a question..."
                    disabled={aiLoading}
                    style={{
                        flex: 1,
                        padding: "7px 10px",
                        background: "rgba(255,255,255,0.04)",
                        border: "1px solid rgba(255,255,255,0.08)",
                        borderRadius: 4,
                        color: "var(--white)",
                        fontFamily: "var(--font-body)",
                        fontSize: "0.72rem",
                        outline: "none",
                    }}
                />
                <button
                    onClick={handleSendMessage}
                    disabled={aiLoading || !userMessage.trim()}
                    className="btn-primary"
                    style={{ padding: "7px 12px", fontSize: "0.65rem", flexShrink: 0 }}
                >
                    ➤
                </button>
            </div>
        </div>
    );
};

export default AICopilotPanel;