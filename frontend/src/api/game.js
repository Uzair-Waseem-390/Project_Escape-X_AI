import api from "./axios";

/**
 * Game API service — all game-related network calls.
 */
export const gameAPI = {
    /**
     * Start a new game session for a level.
     * POST /api/game/sessions/start/
     * Body: { level: 1 }
     * Returns: { success, data: { id, level, score, status, session_questions, subject_times }, message }
     */
    startSession: async (level) => {
        const { data } = await api.post("/game/sessions/start/", { level });
        return data.data;
    },

    /**
     * Get full session detail.
     * GET /api/game/sessions/{sessionId}/
     */
    getSession: async (sessionId) => {
        const { data } = await api.get(`/game/sessions/${sessionId}/`);
        return data.data;
    },

    /**
     * Submit an answer for a question.
     * POST /api/game/sessions/{sessionId}/answer/
     * Body: { question_order: 1, answer: "A" }
     * Returns: { success, data: { is_correct, score, points_delta, correct_option, explanation }, message }
     */
    submitAnswer: async (sessionId, questionOrder, answer) => {
        const { data } = await api.post(`/game/sessions/${sessionId}/answer/`, {
            question_order: questionOrder,
            answer,
        });
        return data.data;
    },

    /**
     * Start or stop subject timer.
     * POST /api/game/sessions/{sessionId}/timer/
     * Body: { subject: "math", action: "start" | "stop" }
     */
    updateTimer: async (sessionId, subject, action) => {
        const { data } = await api.post(`/game/sessions/${sessionId}/timer/`, {
            subject,
            action,
        });
        return data;
    },

    /**
     * Complete the level.
     * POST /api/game/sessions/{sessionId}/complete/
     * Returns: { success, data: { passed, score, level, next_level }, message }
     */
    completeLevel: async (sessionId) => {
        const { data } = await api.post(`/game/sessions/${sessionId}/complete/`);
        return data.data;
    },

    /**
     * Get user progress (highest unlocked level).
     * GET /api/game/progress/
     */
    getProgress: async () => {
        const { data } = await api.get("/game/progress/");
        return data.data;
    },

    /**
     * Get subject analytics.
     * GET /api/game/analytics/
     */
    getAnalytics: async () => {
        const { data } = await api.get("/game/analytics/");
        return data.data;
    },

    /**
     * Get session history.
     * GET /api/game/sessions/
     */
    getSessionHistory: async () => {
        const { data } = await api.get("/game/sessions/");
        return data.data;
    },
};