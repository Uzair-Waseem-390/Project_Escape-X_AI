import { createContext, useState, useEffect, useCallback } from "react";
import { authAPI } from "../api/auth";

export const AuthContext = createContext(null);

/**
 * AuthProvider — wraps the app and provides:
 * - user object
 * - isAuthenticated flag
 * - login / register / logout functions
 * - loading state during initial token check
 */
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);

    // ── On mount: check for stored tokens and fetch user profile ──────
    useEffect(() => {
        const initAuth = async () => {
            const accessToken = localStorage.getItem("access_token");
            if (!accessToken) {
                setLoading(false);
                return;
            }

            try {
                const response = await authAPI.getProfile();
                if (response?.data) {
                    setUser(response.data);
                    setIsAuthenticated(true);
                }
            } catch {
                // Token invalid/expired — clear storage
                localStorage.removeItem("access_token");
                localStorage.removeItem("refresh_token");
                localStorage.removeItem("user");
            } finally {
                setLoading(false);
            }
        };

        initAuth();
    }, []);

    // ── Login ─────────────────────────────────────────────────────────
    const login = useCallback(async (email, password) => {
        const data = await authAPI.login(email, password);

        // Store tokens
        localStorage.setItem("access_token", data.access);
        localStorage.setItem("refresh_token", data.refresh);

        // Fetch user profile
        const profileResponse = await authAPI.getProfile();
        const userData = profileResponse.data;

        setUser(userData);
        setIsAuthenticated(true);
        localStorage.setItem("user", JSON.stringify(userData));

        return userData;
    }, []);

    // ── Register ──────────────────────────────────────────────────────
    const register = useCallback(async (userData) => {
        const data = await authAPI.register(userData);

        // Tokens returned immediately after registration
        localStorage.setItem("access_token", data.tokens.access);
        localStorage.setItem("refresh_token", data.tokens.refresh);

        const userData2 = data.user;
        setUser(userData2);
        setIsAuthenticated(true);
        localStorage.setItem("user", JSON.stringify(userData2));

        return userData2;
    }, []);

    // ── Logout ────────────────────────────────────────────────────────
    const logout = useCallback(async () => {
        const refreshToken = localStorage.getItem("refresh_token");
        if (refreshToken) {
            try {
                await authAPI.logout(refreshToken);
            } catch {
                // Silent fail — token may already be invalid
            }
        }

        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        localStorage.removeItem("user");
        setUser(null);
        setIsAuthenticated(false);
    }, []);

    // ── Update user in context (after profile edit) ───────────────────
    const updateUser = useCallback((userData) => {
        setUser(userData);
        localStorage.setItem("user", JSON.stringify(userData));
    }, []);

    const value = {
        user,
        isAuthenticated,
        loading,
        login,
        register,
        logout,
        updateUser,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};