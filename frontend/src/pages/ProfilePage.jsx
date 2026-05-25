import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { authAPI } from "../api/auth";
import { Button, HUDTag, CornerBrackets } from "../components/ui/UIKit";

const GENDER_OPTIONS = [
    { value: "male", label: "Male" },
    { value: "female", label: "Female" },
    { value: "other", label: "Other" },
    { value: "prefer_not", label: "Prefer not to say" },
];

const ProfilePage = () => {
    const navigate = useNavigate();
    const { user, isAuthenticated, loading, updateUser, logout } = useAuth();

    const [editing, setEditing] = useState(false);
    const [form, setForm] = useState({ first_name: "", last_name: "", age: "", gender: "" });
    const [errors, setErrors] = useState({});
    const [serverError, setServerError] = useState("");
    const [successMsg, setSuccessMsg] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const t = setTimeout(() => setVisible(true), 100);
        return () => clearTimeout(t);
    }, []);

    // Redirect if not authenticated
    useEffect(() => {
        if (!loading && !isAuthenticated) {
            navigate("/login", { replace: true });
        }
    }, [loading, isAuthenticated, navigate]);

    // Populate form when user data loads
    useEffect(() => {
        if (user) {
            setForm({
                first_name: user.first_name || "",
                last_name: user.last_name || "",
                age: user.age?.toString() || "",
                gender: user.gender || "",
            });
        }
    }, [user]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
        if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
    };

    const validate = () => {
        const newErrors = {};
        if (!form.first_name.trim()) newErrors.first_name = "First name is required.";
        if (!form.last_name.trim()) newErrors.last_name = "Last name is required.";
        if (!form.age || form.age < 10 || form.age > 16) newErrors.age = "Age must be between 10 and 16.";
        if (!form.gender) newErrors.gender = "Please select a gender.";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setServerError("");
        setSuccessMsg("");
        if (!validate()) return;

        setSubmitting(true);
        try {
            const response = await authAPI.updateProfile({
                first_name: form.first_name,
                last_name: form.last_name,
                age: parseInt(form.age),
                gender: form.gender,
            });
            updateUser(response.data);
            setSuccessMsg("Profile updated successfully, Cadet.");
            setEditing(false);
        } catch (err) {
            const data = err.response?.data;
            if (data && typeof data === "object") {
                const fieldErrors = {};
                Object.entries(data).forEach(([key, value]) => {
                    fieldErrors[key] = Array.isArray(value) ? value[0] : value;
                });
                setErrors((prev) => ({ ...prev, ...fieldErrors }));
            }
            setServerError(data?.message || "Failed to update profile.");
        } finally {
            setSubmitting(false);
        }
    };

    const handleLogout = async () => {
        await logout();
        navigate("/", { replace: true });
    };

    if (loading || !user) {
        return (
            <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span className="font-mono" style={{ color: "var(--red-400)", letterSpacing: "0.15em", animation: "pulse-red 1.5s infinite" }}>
                    LOADING PROFILE...
                </span>
            </div>
        );
    }

    const inputStyle = (fieldName) => ({
        width: "100%",
        padding: "10px 12px",
        background: editing ? "rgba(255,255,255,0.04)" : "rgba(255,255,255,0.02)",
        border: `1px solid ${errors[fieldName] ? "var(--red-500)" : editing ? "rgba(255,255,255,0.1)" : "rgba(255,255,255,0.05)"}`,
        borderRadius: 4,
        color: editing ? "var(--white)" : "var(--grey-300)",
        fontFamily: "var(--font-body)",
        fontSize: "0.9rem",
        outline: "none",
        cursor: editing ? "text" : "default",
        transition: "border-color 0.2s",
    });

    return (
        <div style={{ minHeight: "100vh", padding: "6rem 1.5rem 3rem", position: "relative", zIndex: 10 }}>
            <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 60% 50% at 50% 30%, rgba(229,57,53,0.05), transparent 70%)", pointerEvents: "none" }} />

            <div style={{ maxWidth: 700, margin: "0 auto", opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(20px)", transition: "opacity 0.6s ease, transform 0.6s ease" }}>
                {/* Header */}
                <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
                    <div style={{ marginBottom: "0.8rem", display: "flex", justifyContent: "center" }}>
                        <HUDTag>CADET DOSSIER</HUDTag>
                    </div>
                    <h1 className="font-display" style={{ fontSize: "clamp(1.5rem, 3vw, 2rem)", fontWeight: 800, textTransform: "uppercase", color: "var(--white)" }}>
                        MISSION <span className="gradient-text-red">PROFILE</span>
                    </h1>
                </div>

                {/* Profile Card */}
                <CornerBrackets>
                    <div style={{ background: "rgba(15,17,20,0.95)", border: "1px solid rgba(229,57,53,0.15)", borderRadius: 6, padding: "2rem", backdropFilter: "blur(16px)" }}>
                        {serverError && (
                            <div style={{ background: "var(--red-subtle)", border: "1px solid rgba(229,57,53,0.3)", borderRadius: 4, padding: "0.8rem 1rem", marginBottom: "1.5rem" }}>
                                <span className="font-mono" style={{ fontSize: "0.75rem", color: "var(--red-400)" }}>⚠ {serverError}</span>
                            </div>
                        )}
                        {successMsg && (
                            <div style={{ background: "rgba(76,175,80,0.08)", border: "1px solid rgba(76,175,80,0.25)", borderRadius: 4, padding: "0.8rem 1rem", marginBottom: "1.5rem" }}>
                                <span className="font-mono" style={{ fontSize: "0.75rem", color: "#4caf50" }}>✓ {successMsg}</span>
                            </div>
                        )}

                        <form onSubmit={handleSave} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                            {/* Read-only: Email */}
                            <div>
                                <label className="font-mono" style={{ fontSize: "0.65rem", color: "var(--grey-300)", letterSpacing: "0.1em", textTransform: "uppercase", display: "block", marginBottom: 5 }}>Email</label>
                                <input type="email" value={user.email} disabled style={{ ...inputStyle(), cursor: "not-allowed", opacity: 0.6 }} />
                            </div>

                            {/* Name row */}
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
                                <div>
                                    <label className="font-mono" style={{ fontSize: "0.65rem", color: "var(--grey-300)", letterSpacing: "0.1em", textTransform: "uppercase", display: "block", marginBottom: 5 }}>First Name</label>
                                    <input type="text" name="first_name" value={form.first_name} onChange={handleChange} disabled={!editing} style={inputStyle("first_name")} />
                                    {errors.first_name && <span className="font-mono" style={{ fontSize: "0.62rem", color: "var(--red-400)", marginTop: 4, display: "block" }}>{errors.first_name}</span>}
                                </div>
                                <div>
                                    <label className="font-mono" style={{ fontSize: "0.65rem", color: "var(--grey-300)", letterSpacing: "0.1em", textTransform: "uppercase", display: "block", marginBottom: 5 }}>Last Name</label>
                                    <input type="text" name="last_name" value={form.last_name} onChange={handleChange} disabled={!editing} style={inputStyle("last_name")} />
                                    {errors.last_name && <span className="font-mono" style={{ fontSize: "0.62rem", color: "var(--red-400)", marginTop: 4, display: "block" }}>{errors.last_name}</span>}
                                </div>
                            </div>

                            {/* Age + Gender */}
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
                                <div>
                                    <label className="font-mono" style={{ fontSize: "0.65rem", color: "var(--grey-300)", letterSpacing: "0.1em", textTransform: "uppercase", display: "block", marginBottom: 5 }}>Age</label>
                                    <input type="number" name="age" value={form.age} onChange={handleChange} disabled={!editing} min="10" max="16" style={inputStyle("age")} />
                                    {errors.age && <span className="font-mono" style={{ fontSize: "0.62rem", color: "var(--red-400)", marginTop: 4, display: "block" }}>{errors.age}</span>}
                                </div>
                                <div>
                                    <label className="font-mono" style={{ fontSize: "0.65rem", color: "var(--grey-300)", letterSpacing: "0.1em", textTransform: "uppercase", display: "block", marginBottom: 5 }}>Gender</label>
                                    {editing ? (
                                        <select name="gender" value={form.gender} onChange={handleChange} style={{ ...inputStyle("gender"), cursor: "pointer", appearance: "none", backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath d='M6 8L1 3h10z' fill='%235a636e'/%3E%3C/svg%3E\")", backgroundRepeat: "no-repeat", backgroundPosition: "right 12px center" }}>
                                            <option value="">Select...</option>
                                            {GENDER_OPTIONS.map((opt) => (
                                                <option key={opt.value} value={opt.value} style={{ background: "#0f1114", color: "#f0f4f8" }}>{opt.label}</option>
                                            ))}
                                        </select>
                                    ) : (
                                        <input type="text" value={user.gender_display || form.gender} disabled style={inputStyle()} />
                                    )}
                                    {errors.gender && <span className="font-mono" style={{ fontSize: "0.62rem", color: "var(--red-400)", marginTop: 4, display: "block" }}>{errors.gender}</span>}
                                </div>
                            </div>

                            {/* Read-only: Date Joined */}
                            <div>
                                <label className="font-mono" style={{ fontSize: "0.65rem", color: "var(--grey-300)", letterSpacing: "0.1em", textTransform: "uppercase", display: "block", marginBottom: 5 }}>Mission Joined</label>
                                <input type="text" value={user.date_joined ? new Date(user.date_joined).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }) : "—"} disabled style={{ ...inputStyle(), cursor: "not-allowed", opacity: 0.6 }} />
                            </div>

                            {/* Actions */}
                            <div style={{ display: "flex", gap: "0.75rem", marginTop: "0.5rem" }}>
                                {editing ? (
                                    <>
                                        <Button type="submit" variant="primary" disabled={submitting} style={{ flex: 1, padding: "12px 20px", fontSize: "0.8rem" }}>
                                            {submitting ? "SAVING..." : "✓ SAVE CHANGES"}
                                        </Button>
                                        <Button type="button" variant="secondary" onClick={() => { setEditing(false); setErrors({}); setServerError(""); }} style={{ flex: 1, padding: "12px 20px", fontSize: "0.8rem" }}>
                                            CANCEL
                                        </Button>
                                    </>
                                ) : (
                                    <Button type="button" variant="primary" onClick={() => setEditing(true)} style={{ flex: 1, padding: "12px 20px", fontSize: "0.8rem" }}>
                                        ✏️ EDIT PROFILE
                                    </Button>
                                )}
                            </div>
                        </form>

                        {/* Divider */}
                        <div style={{ display: "flex", alignItems: "center", gap: "1rem", margin: "1.5rem 0" }}>
                            <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.08)" }} />
                            <span className="font-mono" style={{ fontSize: "0.65rem", color: "var(--grey-400)" }}>ACTIONS</span>
                            <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.08)" }} />
                        </div>

                        <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
                            <Link to="/gemini-key" style={{ flex: 1, textDecoration: "none" }}>
                                <Button type="button" variant="secondary" style={{ width: "100%", padding: "12px 16px", fontSize: "0.78rem" }}>
                                    🔑 UPDATE GEMINI KEY
                                </Button>
                            </Link>
                            <Link to="/" style={{ flex: 1, textDecoration: "none" }}>
                                <Button type="button" variant="secondary" style={{ width: "100%", padding: "12px 16px", fontSize: "0.78rem" }}>
                                    🚀 MISSION CONTROL
                                </Button>
                            </Link>
                            <Button type="button" variant="secondary" onClick={handleLogout} style={{ flex: 1, padding: "12px 16px", fontSize: "0.78rem", borderColor: "rgba(229,57,53,0.4)", color: "var(--red-400)" }}>
                                ⏻ LOGOUT
                            </Button>
                        </div>
                    </div>
                </CornerBrackets>
            </div>
        </div>
    );
};

export default ProfilePage;