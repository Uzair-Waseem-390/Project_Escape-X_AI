import { useState, useCallback, useRef } from "react";
import { aiAPI } from "../api/ai";

const MAX_POLLS = 60; // 60 attempts × 2 seconds = 2 minutes max
const POLL_INTERVAL = 2000; // 2 seconds between polls

/**
 * useAIPolling — polls for AI interaction results.
 */
export const useAIPolling = () => {
    const [aiLoading, setAiLoading] = useState(false);
    const [aiResult, setAiResult] = useState(null);
    const [aiError, setAiError] = useState("");
    const pollRef = useRef(null);

    const requestAI = useCallback(async (sessionId, questionOrder, requestType, userMessage = "") => {
        setAiLoading(true);
        setAiResult(null);
        setAiError("");

        try {
            // Step 1: Request AI assistance
            const { interaction_id } = await aiAPI.requestAssistance(
                sessionId,
                questionOrder,
                requestType,
                userMessage
            );

            // Step 2: Poll for result
            let attempts = 0;
            const poll = () => {
                pollRef.current = setTimeout(async () => {
                    try {
                        const result = await aiAPI.getInteraction(interaction_id);
                        if (result.ready) {
                            setAiResult(result);
                            setAiLoading(false);
                            return;
                        }
                        attempts++;
                        if (attempts >= MAX_POLLS) {
                            setAiError("AI is taking too long. Try again.");
                            setAiLoading(false);
                            return;
                        }
                        poll();
                    } catch (err) {
                        setAiError("Failed to get AI response.");
                        setAiLoading(false);
                    }
                }, POLL_INTERVAL);
            };
            poll();
        } catch (err) {
            setAiError("Failed to contact AI. Please try again.");
            setAiLoading(false);
        }
    }, []);

    const clearAI = useCallback(() => {
        clearTimeout(pollRef.current);
        setAiLoading(false);
        setAiResult(null);
        setAiError("");
    }, []);

    return { aiLoading, aiResult, aiError, requestAI, clearAI };
};