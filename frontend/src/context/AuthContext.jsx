import { createContext, useState, useEffect, useCallback } from "react";
import { authAPI } from "../api/auth";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const initAuth = async () => {
            const accessToken = localStorage.getItem("access_token");
            if (!accessToken) {
                setLoading(false);
                return;
            }

            try {
                const userData = await authAPI.getProfile();
                if (userData) {
                    setUser(userData);
                    setIsAuthenticated(true);
                }
            } catch {
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
        const tokens = await authAPI.login(email, password);

        localStorage.setItem("access_token", tokens.access);
        localStorage.setItem("refresh_token", tokens.refresh);

        const userData = await authAPI.getProfile();

        setUser(userData);
        setIsAuthenticated(true);
        localStorage.setItem("user", JSON.stringify(userData));

        return userData;
    }, []);

    // ── Register ──────────────────────────────────────────────────────
    const register = useCallback(async (userData) => {
        // authAPI.register now returns { user, tokens: { access, refresh } }
        const data = await authAPI.register(userData);

        localStorage.setItem("access_token", data.tokens.access);
        localStorage.setItem("refresh_token", data.tokens.refresh);

        const newUser = data.user;
        setUser(newUser);
        setIsAuthenticated(true);
        localStorage.setItem("user", JSON.stringify(newUser));

        return newUser;
    }, []);

    // ── Logout ────────────────────────────────────────────────────────
    const logout = useCallback(async () => {
        const refreshToken = localStorage.getItem("refresh_token");
        if (refreshToken) {
            try {
                await authAPI.logout(refreshToken);
            } catch {
                // Silent fail
            }
        }

        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        localStorage.removeItem("user");
        setUser(null);
        setIsAuthenticated(false);
    }, []);

    // ── Update user in context ────────────────────────────────────────
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