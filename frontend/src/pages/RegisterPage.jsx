import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { Button, HUDTag, CornerBrackets } from "../components/ui/UIKit";

const GENDER_OPTIONS = [
    { value: "male", label: "Male" },
    { value: "female", label: "Female" },
    { value: "other", label: "Other" },
    { value: "prefer_not", label: "Prefer not to say" },
];

const RegisterPage = () => {
    const navigate = useNavigate();
    const { register, isAuthenticated } = useAuth();

    const [form, setForm] = useState({
        email: "",
        password: "",
        confirmPassword: "",
        first_name: "",
        last_name: "",
        age: "",
        gender: "",
        gemini_api_key: "",
    });
    const [errors, setErrors] = useState({});
    const [serverError, setServerError] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const t = setTimeout(() => setVisible(true), 100);
        return () => clearTimeout(t);
    }, []);

    // Redirect if already logged in
    useEffect(() => {
        if (isAuthenticated) navigate("/dashboard", { replace: true });
    }, [isAuthenticated, navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
        // Clear field error on change
        if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
    };

    const validate = () => {
        const newErrors = {};
        if (!form.email.trim()) newErrors.email = "Email is required.";
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) newErrors.email = "Invalid email address.";
        if (!form.password) newErrors.password = "Password is required.";
        else if (form.password.length < 8) newErrors.password = "Password must be at least 8 characters.";
        if (form.password !== form.confirmPassword) newErrors.confirmPassword = "Passwords do not match.";
        if (!form.first_name.trim()) newErrors.first_name = "First name is required.";
        if (!form.last_name.trim()) newErrors.last_name = "Last name is required.";
        if (!form.age || form.age < 10 || form.age > 16) newErrors.age = "Age must be between 10 and 16.";
        if (!form.gender) newErrors.gender = "Please select a gender.";
        if (!form.gemini_api_key.trim()) newErrors.gemini_api_key = "Gemini API key is required.";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setServerError("");
        if (!validate()) return;

        setSubmitting(true);
        try {
            await register({
                email: form.email,
                password: form.password,
                first_name: form.first_name,
                last_name: form.last_name,
                age: parseInt(form.age),
                gender: form.gender,
                gemini_api_key: form.gemini_api_key,
            });
            navigate("/dashboard", { replace: true });
        } catch (err) {
            const data = err.response?.data;
            if (data && typeof data === "object") {
                // Collect field-level errors from Django
                const fieldErrors = {};
                Object.entries(data).forEach(([key, value]) => {
                    fieldErrors[key] = Array.isArray(value) ? value[0] : value;
                });
                setErrors((prev) => ({ ...prev, ...fieldErrors }));
                setServerError("Please fix the errors below.");
            } else {
                setServerError(data?.message || data?.detail || "Registration failed. Please try again.");
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
            {/* Background glow */}
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
                    maxWidth: 520,
                    opacity: visible ? 1 : 0,
                    transform: visible ? "translateY(0)" : "translateY(20px)",
                    transition: "opacity 0.6s ease, transform 0.6s ease",
                }}
            >
                {/* Header */}
                <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
                    <div style={{ marginBottom: "0.8rem", display: "flex", justifyContent: "center" }}>
                        <HUDTag>NEW CADET REGISTRATION</HUDTag>
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
                        JOIN THE <span className="gradient-text-red">MISSION</span>
                    </h1>
                    <p
                        className="font-body"
                        style={{ fontSize: "0.9rem", color: "var(--grey-400)", maxWidth: 380, margin: "0 auto", lineHeight: 1.6 }}
                    >
                        Register to begin your journey. Fix your spacecraft and return home using STEM knowledge.
                    </p>
                </div>

                {/* Form card */}
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

                        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                            {/* Name row */}
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
                                <div>
                                    <label className="font-mono" style={{ fontSize: "0.65rem", color: "var(--grey-300)", letterSpacing: "0.1em", textTransform: "uppercase", display: "block", marginBottom: 5 }}>
                                        First Name *
                                    </label>
                                    <input type="text" name="first_name" value={form.first_name} onChange={handleChange} placeholder="Cadet first name" style={inputStyle("first_name")} />
                                    {errors.first_name && <span className="font-mono" style={{ fontSize: "0.62rem", color: "var(--red-400)", marginTop: 4, display: "block" }}>{errors.first_name}</span>}
                                </div>
                                <div>
                                    <label className="font-mono" style={{ fontSize: "0.65rem", color: "var(--grey-300)", letterSpacing: "0.1em", textTransform: "uppercase", display: "block", marginBottom: 5 }}>
                                        Last Name *
                                    </label>
                                    <input type="text" name="last_name" value={form.last_name} onChange={handleChange} placeholder="Cadet last name" style={inputStyle("last_name")} />
                                    {errors.last_name && <span className="font-mono" style={{ fontSize: "0.62rem", color: "var(--red-400)", marginTop: 4, display: "block" }}>{errors.last_name}</span>}
                                </div>
                            </div>

                            {/* Email */}
                            <div>
                                <label className="font-mono" style={{ fontSize: "0.65rem", color: "var(--grey-300)", letterSpacing: "0.1em", textTransform: "uppercase", display: "block", marginBottom: 5 }}>
                                    Email Address *
                                </label>
                                <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="cadet@mission.space" style={inputStyle("email")} />
                                {errors.email && <span className="font-mono" style={{ fontSize: "0.62rem", color: "var(--red-400)", marginTop: 4, display: "block" }}>{errors.email}</span>}
                            </div>

                            {/* Password row */}
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
                                <div>
                                    <label className="font-mono" style={{ fontSize: "0.65rem", color: "var(--grey-300)", letterSpacing: "0.1em", textTransform: "uppercase", display: "block", marginBottom: 5 }}>
                                        Password *
                                    </label>
                                    <input type="password" name="password" value={form.password} onChange={handleChange} placeholder="Min 8 characters" style={inputStyle("password")} />
                                    {errors.password && <span className="font-mono" style={{ fontSize: "0.62rem", color: "var(--red-400)", marginTop: 4, display: "block" }}>{errors.password}</span>}
                                </div>
                                <div>
                                    <label className="font-mono" style={{ fontSize: "0.65rem", color: "var(--grey-300)", letterSpacing: "0.1em", textTransform: "uppercase", display: "block", marginBottom: 5 }}>
                                        Confirm Password *
                                    </label>
                                    <input type="password" name="confirmPassword" value={form.confirmPassword} onChange={handleChange} placeholder="Re-enter password" style={inputStyle("confirmPassword")} />
                                    {errors.confirmPassword && <span className="font-mono" style={{ fontSize: "0.62rem", color: "var(--red-400)", marginTop: 4, display: "block" }}>{errors.confirmPassword}</span>}
                                </div>
                            </div>

                            {/* Age + Gender row */}
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
                                <div>
                                    <label className="font-mono" style={{ fontSize: "0.65rem", color: "var(--grey-300)", letterSpacing: "0.1em", textTransform: "uppercase", display: "block", marginBottom: 5 }}>
                                        Age *
                                    </label>
                                    <input type="number" name="age" value={form.age} onChange={handleChange} placeholder="10-16" min="10" max="16" style={inputStyle("age")} />
                                    {errors.age && <span className="font-mono" style={{ fontSize: "0.62rem", color: "var(--red-400)", marginTop: 4, display: "block" }}>{errors.age}</span>}
                                </div>
                                <div>
                                    <label className="font-mono" style={{ fontSize: "0.65rem", color: "var(--grey-300)", letterSpacing: "0.1em", textTransform: "uppercase", display: "block", marginBottom: 5 }}>
                                        Gender *
                                    </label>
                                    <select name="gender" value={form.gender} onChange={handleChange} style={{ ...inputStyle("gender"), cursor: "pointer", appearance: "none", backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath d='M6 8L1 3h10z' fill='%235a636e'/%3E%3C/svg%3E\")", backgroundRepeat: "no-repeat", backgroundPosition: "right 12px center" }}>
                                        <option value="">Select...</option>
                                        {GENDER_OPTIONS.map((opt) => (
                                            <option key={opt.value} value={opt.value} style={{ background: "#0f1114", color: "#f0f4f8" }}>
                                                {opt.label}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.gender && <span className="font-mono" style={{ fontSize: "0.62rem", color: "var(--red-400)", marginTop: 4, display: "block" }}>{errors.gender}</span>}
                                </div>
                            </div>

                            {/* Gemini API Key */}
                            <div>
                                <label className="font-mono" style={{ fontSize: "0.65rem", color: "var(--grey-300)", letterSpacing: "0.1em", textTransform: "uppercase", display: "block", marginBottom: 5 }}>
                                    Gemini API Key *
                                </label>
                                <input
                                    type="password"
                                    name="gemini_api_key"
                                    value={form.gemini_api_key}
                                    onChange={handleChange}
                                    placeholder="AI-xxxxxxxxxxxx"
                                    style={inputStyle("gemini_api_key")}
                                />
                                {errors.gemini_api_key && <span className="font-mono" style={{ fontSize: "0.62rem", color: "var(--red-400)", marginTop: 4, display: "block" }}>{errors.gemini_api_key}</span>}
                                <p className="font-mono" style={{ fontSize: "0.6rem", color: "var(--grey-400)", marginTop: 5, letterSpacing: "0.04em" }}>
                                    Get your key at{" "}
                                    <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" style={{ color: "var(--cyan-400)", textDecoration: "none" }}>
                                        aistudio.google.com
                                    </a>
                                    . Encrypted before storage.
                                </p>
                            </div>

                            {/* Submit */}
                            <div style={{ marginTop: "0.5rem" }}>
                                <Button type="submit" variant="primary" disabled={submitting} style={{ width: "100%", padding: "14px 24px", fontSize: "0.85rem" }}>
                                    {submitting ? "CREATING ACCOUNT..." : "🚀 REGISTER FOR MISSION"}
                                </Button>
                            </div>
                        </form>

                        {/* Divider */}
                        <div style={{ display: "flex", alignItems: "center", gap: "1rem", margin: "1.5rem 0" }}>
                            <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.08)" }} />
                            <span className="font-mono" style={{ fontSize: "0.65rem", color: "var(--grey-400)" }}>ALREADY A CADET?</span>
                            <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.08)" }} />
                        </div>

                        <Link
                            to="/login"
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
                            → Sign in to Mission Control
                        </Link>
                    </div>
                </CornerBrackets>
            </div>
        </div>
    );
};

export default RegisterPage;