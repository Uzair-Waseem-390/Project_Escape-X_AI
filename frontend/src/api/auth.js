import api from "./axios";

export const authAPI = {
    /**
     * Register a new user.
     * POST /api/users/register/
     * Django response: { success, data: { user, tokens: { access, refresh } }, message }
     */
    register: async (userData) => {
        const { data } = await api.post("/users/register/", userData);
        // Return the inner 'data' object which contains user + tokens
        return data.data; // { user, tokens: { access, refresh } }
    },

    /**
     * Login with email + password.
     * POST /api/auth/token/
     * SimpleJWT response: { access, refresh }
     */
    login: async (email, password) => {
        const { data } = await api.post("/auth/token/", { email, password });
        return data; // { access, refresh }
    },

    /**
     * Fetch authenticated user's profile.
     * GET /api/users/profile/
     * Django response: { success, data: { ...user } }
     */
    getProfile: async () => {
        const { data } = await api.get("/users/profile/");
        return data.data; // { id, email, first_name, ... }
    },

    /**
     * Update user profile fields.
     * PATCH /api/users/profile/
     */
    updateProfile: async (profileData) => {
        const { data } = await api.patch("/users/profile/", profileData);
        return data; // { success, data: { ...user }, message }
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