import { useState, useEffect } from "react";
import { Button } from "../ui/UIKit";

/**
 * Navbar — sticky HUD-style top navigation
 * Highlights active section on scroll.
 */
const NAV_LINKS = [
  { label: "Mission", href: "#" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "AI Copilot", href: "#ai-section" },
  { label: "Subjects", href: "#subjects" },
  { label: "Features", href: "#features" },
];

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 40);

      // Active section detection
      const sections = NAV_LINKS.map((l) => l.href.slice(1)).filter(Boolean);
      // "Mission" is # (top of page) — always consider active when at top
      if (window.scrollY < 100) {
        setActiveSection("");
        return;
      }
      for (let i = sections.length - 1; i >= 0; i--) {
        const el = document.getElementById(sections[i]);
        if (el && el.getBoundingClientRect().top <= 100) {
          setActiveSection(sections[i]);
          break;
        }
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        transition: "all 0.3s ease",
        background: scrolled
          ? "rgba(10,11,13,0.95)"
          : "transparent",
        borderBottom: scrolled
          ? "1px solid rgba(229,57,53,0.15)"
          : "1px solid transparent",
        backdropFilter: scrolled ? "blur(16px)" : "none",
      }}
    >
      {/* Top alert strip */}
      <div
        style={{
          height: 2,
          background: "linear-gradient(90deg, transparent, var(--red-500) 30%, var(--red-500) 70%, transparent)",
        }}
      />

      <div
        style={{
          maxWidth: 1280,
          margin: "0 auto",
          padding: "0 1.5rem",
          height: 68,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "1rem",
        }}
      >
        {/* Logo */}
        <a
          href="#"
          style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: "0.75rem" }}
        >
          {/* Mission patch icon */}
          <div
            style={{
              width: 36,
              height: 36,
              position: "relative",
              flexShrink: 0,
            }}
          >
            <svg viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
              <polygon
                points="18,2 34,10 34,26 18,34 2,26 2,10"
                stroke="#e53935"
                strokeWidth="1.5"
                fill="rgba(229,57,53,0.08)"
              />
              <polygon
                points="18,7 29,13 29,23 18,29 7,23 7,13"
                stroke="rgba(229,57,53,0.4)"
                strokeWidth="0.5"
                fill="none"
              />
              <text x="18" y="22" textAnchor="middle" fill="#e53935" fontSize="11" fontFamily="Orbitron" fontWeight="700">X</text>
            </svg>
          </div>
          <div>
            <div
              className="font-display"
              style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--white)", letterSpacing: "0.08em", lineHeight: 1 }}
            >
              ESCAPE-X
            </div>
            <div
              className="font-mono"
              style={{ fontSize: "0.55rem", color: "var(--red-400)", letterSpacing: "0.2em", lineHeight: 1.4 }}
            >
              AI · MISSION CONTROL
            </div>
          </div>
        </a>

        {/* Desktop Nav Links */}
        <ul
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.25rem",
            listStyle: "none",
            margin: 0,
            padding: 0,
          }}
          className="hidden-mobile"
        >
          {NAV_LINKS.map((link) => {
            const sectionId = link.href.slice(1);
            // Mission (#) is active when no section is highlighted (at top of page)
            const isActive = sectionId === ""
              ? activeSection === ""
              : activeSection === sectionId;
            return (
              <li key={link.href + link.label}>
                <a
                  href={link.href}
                  className="font-heading"
                  style={{
                    display: "block",
                    padding: "6px 14px",
                    fontSize: "0.88rem",
                    fontWeight: 600,
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                    textDecoration: "none",
                    color: isActive ? "var(--red-400)" : "var(--grey-300)",
                    borderBottom: `2px solid ${isActive ? "var(--red-500)" : "transparent"}`,
                    transition: "all 0.2s ease",
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) e.target.style.color = "var(--white)";
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) e.target.style.color = "var(--grey-300)";
                  }}
                >
                  {link.label}
                </a>
              </li>
            );
          })}
        </ul>

        {/* CTA */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <Button href="#" variant="primary" className="hidden-mobile" style={{ padding: "10px 20px", fontSize: "0.75rem" }}>
            Launch Mission
          </Button>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            style={{
              display: "none",
              background: "none",
              border: "1px solid rgba(229,57,53,0.3)",
              borderRadius: 4,
              padding: "6px 10px",
              cursor: "pointer",
              color: "var(--red-400)",
              fontSize: "1.1rem",
            }}
            className="show-mobile"
            aria-label="Toggle menu"
          >
            {menuOpen ? "✕" : "☰"}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div
          style={{
            background: "rgba(10,11,13,0.98)",
            borderTop: "1px solid rgba(229,57,53,0.15)",
            padding: "1rem 1.5rem 1.5rem",
          }}
        >
          <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
            {NAV_LINKS.map((link) => (
              <li key={link.href + link.label}>
                <a
                  href={link.href}
                  className="font-heading"
                  onClick={() => setMenuOpen(false)}
                  style={{
                    display: "block",
                    padding: "12px 0",
                    fontSize: "1rem",
                    fontWeight: 600,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    textDecoration: "none",
                    color: "var(--grey-200)",
                    borderBottom: "1px solid rgba(255,255,255,0.04)",
                  }}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
          <Button href="#" variant="primary" style={{ width: "100%", marginTop: "1rem" }}>
            Launch Mission
          </Button>
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .hidden-mobile { display: none !important; }
          .show-mobile { display: flex !important; }
        }
        @media (min-width: 769px) {
          .show-mobile { display: none !important; }
        }
      `}</style>
    </nav>
  );
};

export default Navbar;