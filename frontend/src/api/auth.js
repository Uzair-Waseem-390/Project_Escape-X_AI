import api from "./axios";

/**
 * Auth API service — all auth-related network calls.
 */

export const authAPI = {
    /**
     * Register a new user.
     * POST /api/users/register/
     */
    register: async (userData) => {
        const { data } = await api.post("/users/register/", userData);
        return data; // { user, tokens: { access, refresh }, message }
    },

    /**
     * Login with email + password.
     * POST /api/auth/token/
     */
    login: async (email, password) => {
        const { data } = await api.post("/auth/token/", { email, password });
        return data; // { access, refresh }
    },

    /**
     * Fetch authenticated user's profile.
     * GET /api/users/profile/
     */
    getProfile: async () => {
        const { data } = await api.get("/users/profile/");
        return data; // { success: true, data: { ...user } }
    },

    /**
     * Update user profile fields.
     * PATCH /api/users/profile/
     */
    updateProfile: async (profileData) => {
        const { data } = await api.patch("/users/profile/", profileData);
        return data;
    },

    /**
     * Update Gemini API key.
     * PATCH /api/users/gemini-key/
     */
    updateGeminiKey: async (geminiApiKey) => {
        const { data } = await api.patch("/users/gemini-key/", { gemini_api_key: geminiApiKey });
        return data;
    },

    /**
     * Refresh access token.
     * POST /api/auth/token/refresh/
     */
    refreshToken: async (refreshToken) => {
        const { data } = await api.post("/auth/token/refresh/", { refresh: refreshToken });
        return data; // { access }
    },

    /**
     * Blacklist refresh token (logout).
     * POST /api/auth/token/blacklist/
     */
    logout: async (refreshToken) => {
        const { data } = await api.post("/auth/token/blacklist/", { refresh: refreshToken });
        return data;
    },
};