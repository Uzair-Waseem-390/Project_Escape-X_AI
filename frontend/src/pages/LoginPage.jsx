import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { Button, HUDTag, CornerBrackets } from "../components/ui/UIKit";

const LoginPage = () => {
    const navigate = useNavigate();
    const { login, isAuthenticated } = useAuth();

    const [form, setForm] = useState({ email: "", password: "" });
    const [errors, setErrors] = useState({});
    const [serverError, setServerError] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const t = setTimeout(() => setVisible(true), 100);
        return () => clearTimeout(t);
    }, []);

    useEffect(() => {
        if (isAuthenticated) navigate("/dashboard", { replace: true });
    }, [isAuthenticated, navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
        if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
    };

    const validate = () => {
        const newErrors = {};
        if (!form.email.trim()) newErrors.email = "Email is required.";
        if (!form.password) newErrors.password = "Password is required.";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setServerError("");
        if (!validate()) return;

        setSubmitting(true);
        try {
            await login(form.email, form.password);
            navigate("/dashboard", { replace: true });
        } catch (err) {
            const status = err.response?.status;
            if (status === 401) {
                setServerError("Invalid email or password. Please try again.");
            } else if (status === 400) {
                setServerError("Please check your email and password.");
            } else {
                setServerError("Connection lost with Mission Control. Retrying...");
            }
        } finally {
            setSubmitting(false);
        }
    };

    const inputStyle = (fieldName) => ({
        width: "100%",
        padding: "12px 14px",
        background: "rgba(255,255,255,0.04)",
        border: `1px solid ${errors[fieldName] ? "var(--red-500)" : "rgba(255,255,255,0.1)"}`,
        borderRadius: 4,
        color: "var(--white)",
        fontFamily: "var(--font-body)",
        fontSize: "0.9rem",
        outline: "none",
        transition: "border-color 0.2s",
    });

    return (
        <div
            style={{
                minHeight: "100vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "6rem 1.5rem 3rem",
                position: "relative",
                zIndex: 10,
            }}
        >
            <div
                style={{
                    position: "absolute",
                    inset: 0,
                    background: "radial-gradient(ellipse 60% 50% at 50% 50%, rgba(229,57,53,0.06), transparent 70%)",
                    pointerEvents: "none",
                }}
            />

            <div
                style={{
                    width: "100%",
                    maxWidth: 440,
                    opacity: visible ? 1 : 0,
                    transform: visible ? "translateY(0)" : "translateY(20px)",
                    transition: "opacity 0.6s ease, transform 0.6s ease",
                }}
            >
                <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
                    <div style={{ marginBottom: "0.8rem", display: "flex", justifyContent: "center" }}>
                        <HUDTag>MISSION CONTROL ACCESS</HUDTag>
                    </div>
                    <h1
                        className="font-display"
                        style={{
                            fontSize: "clamp(1.6rem, 3vw, 2.2rem)",
                            fontWeight: 800,
                            textTransform: "uppercase",
                            letterSpacing: "0.03em",
                            color: "var(--white)",
                            marginBottom: "0.5rem",
                        }}
                    >
                        CADET <span className="gradient-text-red">LOGIN</span>
                    </h1>
                    <p
                        className="font-body"
                        style={{ fontSize: "0.9rem", color: "var(--grey-400)", maxWidth: 360, margin: "0 auto", lineHeight: 1.6 }}
                    >
                        Your spacecraft is waiting. Log in to continue your repair mission.
                    </p>
                </div>

                <CornerBrackets>
                    <div
                        style={{
                            background: "rgba(15,17,20,0.95)",
                            border: "1px solid rgba(229,57,53,0.15)",
                            borderRadius: 6,
                            padding: "2rem",
                            backdropFilter: "blur(16px)",
                        }}
                    >
                        {serverError && (
                            <div
                                style={{
                                    background: "var(--red-subtle)",
                                    border: "1px solid rgba(229,57,53,0.3)",
                                    borderRadius: 4,
                                    padding: "0.8rem 1rem",
                                    marginBottom: "1.5rem",
                                }}
                            >
                                <span className="font-mono" style={{ fontSize: "0.75rem", color: "var(--red-400)" }}>
                                    ⚠ {serverError}
                                </span>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                            <div>
                                <label className="font-mono" style={{ fontSize: "0.65rem", color: "var(--grey-300)", letterSpacing: "0.1em", textTransform: "uppercase", display: "block", marginBottom: 5 }}>
                                    Email Address
                                </label>
                                <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="cadet@mission.space" style={inputStyle("email")} />
                                {errors.email && <span className="font-mono" style={{ fontSize: "0.62rem", color: "var(--red-400)", marginTop: 4, display: "block" }}>{errors.email}</span>}
                            </div>

                            <div>
                                <label className="font-mono" style={{ fontSize: "0.65rem", color: "var(--grey-300)", letterSpacing: "0.1em", textTransform: "uppercase", display: "block", marginBottom: 5 }}>
                                    Password
                                </label>
                                <input type="password" name="password" value={form.password} onChange={handleChange} placeholder="••••••••" style={inputStyle("password")} />
                                {errors.password && <span className="font-mono" style={{ fontSize: "0.62rem", color: "var(--red-400)", marginTop: 4, display: "block" }}>{errors.password}</span>}
                            </div>

                            <div style={{ marginTop: "0.25rem" }}>
                                <Button type="submit" variant="primary" disabled={submitting} style={{ width: "100%", padding: "14px 24px", fontSize: "0.85rem" }}>
                                    {submitting ? "AUTHENTICATING..." : "🔓 ACCESS MISSION CONTROL"}
                                </Button>
                            </div>
                        </form>

                        <div style={{ display: "flex", alignItems: "center", gap: "1rem", margin: "1.5rem 0" }}>
                            <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.08)" }} />
                            <span className="font-mono" style={{ fontSize: "0.65rem", color: "var(--grey-400)" }}>NEW CADET?</span>
                            <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.08)" }} />
                        </div>

                        <Link
                            to="/register"
                            style={{
                                display: "block",
                                textAlign: "center",
                                fontFamily: "var(--font-body)",
                                fontSize: "0.88rem",
                                color: "var(--cyan-400)",
                                textDecoration: "none",
                                transition: "color 0.2s",
                            }}
                            onMouseEnter={(e) => (e.target.style.color = "var(--white)")}
                            onMouseLeave={(e) => (e.target.style.color = "var(--cyan-400)")}
                        >
                            → Register as a new Cadet
                        </Link>
                    </div>
                </CornerBrackets>

                {/* Back to landing */}
                <div style={{ textAlign: "center", marginTop: "2rem" }}>
                    <a
                        href="/"
                        className="font-mono"
                        style={{ fontSize: "0.72rem", color: "var(--grey-400)", textDecoration: "none", letterSpacing: "0.08em", transition: "color 0.2s" }}
                        onMouseEnter={(e) => (e.target.style.color = "var(--white)")}
                        onMouseLeave={(e) => (e.target.style.color = "var(--grey-400)")}
                    >
                        ← BACK TO MISSION BRIEFING
                    </a>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;