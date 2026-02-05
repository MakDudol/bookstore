import "./Footer.css";

const SOCIAL_LINKS = [
  {
    id: "instagram",
    href: "https://instagram.com/ukrbook_montreal",
    label: "Instagram",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <rect x="3" y="3" width="18" height="18" rx="5" ry="5" fill="none" stroke="currentColor" strokeWidth="1.6" />
        <circle cx="12" cy="12" r="4.5" fill="none" stroke="currentColor" strokeWidth="1.6" />
        <circle cx="17.35" cy="6.65" r="1.1" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    id: "facebook",
    href: "https://www.facebook.com/share/1JH1fYgNFn/?mibextid=wwXIfr",
    label: "Facebook",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path
          d="M15.5 3h-3a4 4 0 0 0-4 4v3H6v3h2.5v8h3.4v-8h2.7l0.5-3H11.9V7.4c0-0.74 0.46-1.4 1.3-1.4h2.3V3Z"
          fill="currentColor"
        />
      </svg>
    ),
  },
];

const FOOTER_COPY = "© 2025 Солов'їна. Усі права захищено.";

function Footer() {
  return (
    <footer className="footer">
      <p className="footer__copy">{FOOTER_COPY}</p>
      <div className="footer__social" role="navigation" aria-label="Соціальні мережі">
        {SOCIAL_LINKS.map((item) => (
          <a
            key={item.id}
            className="social-link"
            href={item.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={item.label}
          >
            <span className="social-icon">{item.icon}</span>
          </a>
        ))}
      </div>
    </footer>
  );
}

export default Footer;
