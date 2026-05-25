import { HUDTag } from "../ui/UIKit";

/**
 * Footer — mission debrief / developer credits
 */
const SOCIAL_LINKS = [
  {
    label: "GitHub",
    href: "https://github.com/Uzair-Waseem-390",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
      </svg>
    ),
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/uzair-waseem-digital/",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
  },
  {
    label: "Gmail",
    href: "mailto:uzairwaseem390@gmail.com",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-2.023 2.309-3.178 3.927-1.964L5.455 4.64 12 9.548l6.545-4.91 1.528-1.145C21.69 2.28 24 3.434 24 5.457z" />
      </svg>
    ),
  },
  {
    label: "WhatsApp",
    href: "https://wa.me/923281525502",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
      </svg>
    ),
  },
];

const NAV_COLS = [
  {
    title: "Mission",
    links: [
      { label: "About Project", href: "#" },
      { label: "How It Works", href: "#how-it-works" },
      { label: "Features", href: "#features" },
    ],
  },
  {
    title: "Operations",
    links: [
      { label: "Start Mission", href: "/register" },
      { label: "Student Login", href: "/login" },
    ],
  },
];

const Footer = () => (
  <footer
    style={{
      position: "relative",
      zIndex: 10,
      marginTop: "6rem",
      borderTop: "1px solid rgba(229,57,53,0.15)",
    }}
  >
    {/* Glow line */}
    <div
      style={{
        height: 2,
        background: "linear-gradient(90deg, transparent, var(--red-500) 40%, var(--red-500) 60%, transparent)",
        marginBottom: 0,
      }}
    />

    <div
      style={{
        background: "rgba(10,11,13,0.98)",
        backdropFilter: "blur(16px)",
      }}
    >
      {/* Main footer content */}
      <div
        style={{
          maxWidth: 1280,
          margin: "0 auto",
          padding: "4rem 1.5rem 2rem",
          display: "grid",
          gridTemplateColumns: "2fr 1fr 1fr",
          gap: "3rem",
        }}
        className="footer-grid"
      >
        {/* Brand column */}
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.25rem" }}>
            <svg viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" width="40" height="40">
              <polygon points="18,2 34,10 34,26 18,34 2,26 2,10" stroke="#e53935" strokeWidth="1.5" fill="rgba(229,57,53,0.08)" />
              <text x="18" y="22" textAnchor="middle" fill="#e53935" fontSize="11" fontFamily="Orbitron" fontWeight="700">X</text>
            </svg>
            <div>
              <div className="font-display" style={{ fontSize: "1rem", fontWeight: 700, color: "var(--white)", letterSpacing: "0.1em" }}>
                ESCAPE-X AI
              </div>
              <div className="font-mono" style={{ fontSize: "0.6rem", color: "var(--red-400)", letterSpacing: "0.15em" }}>
                STEM MISSION PLATFORM
              </div>
            </div>
          </div>
          <p
            className="font-body"
            style={{ fontSize: "0.9rem", color: "var(--grey-400)", lineHeight: 1.7, maxWidth: 300, marginBottom: "1.5rem" }}
          >
            An AI-powered STEM learning platform where students fix their spacecraft by solving challenges. Learn. Adapt. Escape.
          </p>
          <HUDTag>MISSION STATUS: ACTIVE</HUDTag>
        </div>

        {/* Nav columns */}
        {NAV_COLS.map((col) => (
          <div key={col.title}>
            <h4
              className="font-display"
              style={{ fontSize: "0.7rem", fontWeight: 700, color: "var(--red-400)", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "1.25rem" }}
            >
              {col.title}
            </h4>
            <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: "0.6rem" }}>
              {col.links.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="font-body"
                    style={{ fontSize: "0.88rem", color: "var(--grey-400)", textDecoration: "none", transition: "color 0.2s" }}
                    onMouseEnter={(e) => (e.target.style.color = "var(--white)")}
                    onMouseLeave={(e) => (e.target.style.color = "var(--grey-400)")}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Divider */}
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 1.5rem" }}>
        <div style={{ height: 1, background: "rgba(255,255,255,0.06)" }} />
      </div>

      {/* Bottom bar */}
      <div
        style={{
          maxWidth: 1280,
          margin: "0 auto",
          padding: "1.5rem 1.5rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "1rem",
        }}
      >
        <div>
          <p className="font-mono" style={{ fontSize: "0.7rem", color: "var(--grey-400)", letterSpacing: "0.08em" }}>
            DEVELOPED BY{" "}
            <a
              href="https://www.linkedin.com/in/uzair-waseem-digital/"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "var(--red-400)", textDecoration: "none" }}
            >
              UZAIR WASEEM
            </a>{" "}
            · FULL STACK ENGINEER
          </p>
          <p className="font-mono" style={{ fontSize: "0.65rem", color: "var(--grey-400)", marginTop: 4, letterSpacing: "0.06em" }}>
            © {new Date().getFullYear()} PROJECT ESCAPE-X AI · ALL SYSTEMS OPERATIONAL
          </p>
        </div>

        {/* Social icons */}
        <div style={{ display: "flex", gap: "0.5rem" }}>
          {SOCIAL_LINKS.map((s) => (
            <a
              key={s.label}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={s.label}
              style={{
                width: 38,
                height: 38,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.07)",
                borderRadius: 4,
                color: "var(--grey-400)",
                textDecoration: "none",
                transition: "all 0.25s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(229,57,53,0.1)";
                e.currentTarget.style.borderColor = "rgba(229,57,53,0.4)";
                e.currentTarget.style.color = "var(--red-400)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(255,255,255,0.04)";
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)";
                e.currentTarget.style.color = "var(--grey-400)";
              }}
            >
              {s.icon}
            </a>
          ))}
        </div>
      </div>
    </div>

    <style>{`
      @media (max-width: 900px) {
        .footer-grid {
          grid-template-columns: 1fr 1fr !important;
        }
      }
      @media (max-width: 540px) {
        .footer-grid {
          grid-template-columns: 1fr !important;
        }
      }
    `}</style>
  </footer>
);

export default Footer;