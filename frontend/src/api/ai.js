import api from "./axios";

/**
 * AI API service — LangGraph agent interactions.
 */
export const aiAPI = {
    /**
     * Request AI assistance (hint, explanation, wrong answer analysis).
     * POST /api/ai/assist/
     * Body: { session_id, question_order, request_type, user_message }
     * Returns: { success, data: { interaction_id, task_id, status }, message }
     */
    requestAssistance: async (sessionId, questionOrder, requestType, userMessage = "") => {
        const { data } = await api.post("/ai/assist/", {
            session_id: sessionId,
            question_order: questionOrder,
            request_type: requestType,
            user_message: userMessage,
        });
        return data.data;
    },

    /**
     * Poll for AI interaction result.
     * GET /api/ai/interact/{interactionId}/
     * Returns: { success, data: { ..., ready: true/false } }
     */
    getInteraction: async (interactionId) => {
        const { data } = await api.get(`/ai/interact/${interactionId}/`);
        return data.data;
    },

    /**
     * Get chat history for a session.
     * GET /api/ai/sessions/{sessionId}/history/
     */
    getChatHistory: async (sessionId) => {
        const { data } = await api.get(`/ai/sessions/${sessionId}/history/`);
        return data.data;
    },

    /**
     * Trigger AI report generation.
     * POST /api/ai/sessions/{sessionId}/report/generate/
     */
    generateReport: async (sessionId) => {
        const { data } = await api.post(`/ai/sessions/${sessionId}/report/generate/`);
        return data;
    },

    /**
     * Get AI performance report.
     * GET /api/ai/sessions/{sessionId}/report/
     */
    getReport: async (sessionId) => {
        const { data } = await api.get(`/ai/sessions/${sessionId}/report/`);
        return data.data;
    },
};