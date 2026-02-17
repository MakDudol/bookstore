import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import heroLogo from "../assets/logo.png";
import heroLogoFallback from "../assets/Solovyina_logo_icon_bird_white.png";
import Search from "./Search";
import "./Header.css";

const CONTACT_LINK_TEXT = "Контакти";
const NAV_ARIA_LABEL = "Основна навігація";
const BOOKS_LABEL = "Категорії";
const GENRES_LABEL = "Жанри";
const CART_BUTTON_ARIA = "Відкрити кошик";
const LOGO_ALT = "Солов'їна — логотип";
const SEARCH_TOGGLE_ARIA = "Показати пошук";
const SEARCH_TOGGLE_CLOSE_ARIA = "Сховати пошук";
const MOBILE_SEARCH_LABEL = "Пошук по каталогу";
const MOBILE_SEARCH_CLOSE_LABEL = "Закрити пошук";
const MOBILE_SEARCH_ID = "mobile-search";
const MOBILE_SEARCH_TITLE_ID = "mobile-search-label";
const SEARCH_NOTE_LINE_1 = "Доставка по Канаді та США";
const SEARCH_NOTE_LINE_2 = "При замовленні від 150$ безкоштовна відправка по Канаді";

const BOOK_CATEGORIES = [
  { label: "Новинки", slug: "novynky" },
  { label: "Дитяча література", slug: "dytiacha-literatura" },
  { label: "Зарубіжна література", slug: "zarubizhna-literatura" },
  { label: "Українська література", slug: "ukrainska-literatura" },
  { label: "Посібники", slug: "posibnyky" },
];

const GENRE_LIST = [
  { label: "Детективи", slug: "detektyvy" },
  { label: "Трилери", slug: "trylery" },
  { label: "Жахи", slug: "zhakhy" },
  { label: "Фантастика", slug: "fantastyka" },
  { label: "Фентезі", slug: "fentezi" },
  { label: "Науково-популярна література", slug: "naukovo-populiarna-literatura" },
  { label: "Біографії", slug: "biohrafii" },
  { label: "Любовний роман", slug: "liubovnyi-roman" },
  { label: "Соціальний роман", slug: "sotsialnyi-roman" },
  { label: "Історичний роман", slug: "istorychnyi-roman" },
  { label: "Пригодницький роман", slug: "pryhodnytskyi-roman" },
  { label: "Класика", slug: "klasyka" },
  { label: "Казки", slug: "kazky" },
  { label: "Навчальна література", slug: "navchalna-literatura" },
  { label: "Пізнавальна література", slug: "piznavalna-literatura" },
  { label: "Мотиваційна література", slug: "motyvatsiina-literatura" },
  { label: "Психологія", slug: "psykholohiia" },
];

function Header({
  searchTerm,
  onSearchChange,
  onCartToggle,
  cartCount,
  contactPhone,
  selectedCategory = null,
  onCategorySelect,
  selectedGenre = null,
  onGenreSelect,
  onLogoClick,
}) {
  const sanitizedPhone = (contactPhone ?? "").replace(/[^+\d]/g, "");

  const [openMenu, setOpenMenu] = useState(null);
  const [alignGenresEnd, setAlignGenresEnd] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const menuRef = useRef(null);
  const genresBtnRef = useRef(null);
  const searchToggleRef = useRef(null);
  const searchPanelRef = useRef(null);
  const searchInputRef = useRef(null);
  const wasSearchOpenRef = useRef(false);

  const closeMobileSearch = useCallback(() => {
    setIsMobileSearchOpen(false);
  }, []);

  const toggleMenu = (name) => {
    setOpenMenu((prev) => {
      const next = prev === name ? null : name;
      if (next) {
        closeMobileSearch();
      }
      return next;
    });
  };

  const toggleMobileSearch = () => {
    setIsMobileSearchOpen((prev) => {
      const next = !prev;
      if (!prev) {
        setOpenMenu(null);
      }
      return next;
    });
  };

  useEffect(() => {
    function handlePointer(event) {
      if (!menuRef.current) return;
      if (menuRef.current.contains(event.target)) return;
      setOpenMenu(null);
    }

    document.addEventListener("mousedown", handlePointer);
    document.addEventListener("touchstart", handlePointer);

    return () => {
      document.removeEventListener("mousedown", handlePointer);
      document.removeEventListener("touchstart", handlePointer);
    };
  }, []);

  useEffect(() => {
    function onKey(event) {
      if (event.key === "Escape") {
        setOpenMenu(null);
        closeMobileSearch();
      }
    }

    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [closeMobileSearch]);

  useEffect(() => {
    function updateAlign() {
      if (!genresBtnRef.current) return;
      const rect = genresBtnRef.current.getBoundingClientRect();
      const estimatedMenuWidth = 240;
      const safetyGap = 12;
      const spaceRight = window.innerWidth - rect.right;
      setAlignGenresEnd(spaceRight < estimatedMenuWidth + safetyGap);
    }

    updateAlign();
    window.addEventListener("resize", updateAlign);
    return () => window.removeEventListener("resize", updateAlign);
  }, []);

  useEffect(() => {
    if (!isMobileSearchOpen) {
      return;
    }

    function handleOutside(event) {
      if (searchPanelRef.current && searchPanelRef.current.contains(event.target)) {
        return;
      }
      if (searchToggleRef.current && searchToggleRef.current.contains(event.target)) {
        return;
      }
      closeMobileSearch();
    }

    document.addEventListener("mousedown", handleOutside);
    document.addEventListener("touchstart", handleOutside);
    return () => {
      document.removeEventListener("mousedown", handleOutside);
      document.removeEventListener("touchstart", handleOutside);
    };
  }, [isMobileSearchOpen, closeMobileSearch]);

  useEffect(() => {
    if (!isMobileSearchOpen) {
      return undefined;
    }

    if (typeof document === "undefined") {
      return undefined;
    }

    const html = document.documentElement;
    const body = document.body;
    const previousHtmlOverflow = html.style.overflow;
    const previousBodyOverflow = body.style.overflow;

    html.style.overflow = "hidden";
    body.style.overflow = "hidden";

    const frame = window.requestAnimationFrame(() => {
      if (searchInputRef.current) {
        searchInputRef.current.focus({ preventScroll: true });
        searchInputRef.current.select();
      }
    });

    return () => {
      html.style.overflow = previousHtmlOverflow;
      body.style.overflow = previousBodyOverflow;
      window.cancelAnimationFrame(frame);
    };
  }, [isMobileSearchOpen]);

  useEffect(() => {
    if (!wasSearchOpenRef.current || isMobileSearchOpen) {
      wasSearchOpenRef.current = isMobileSearchOpen;
      return;
    }

    wasSearchOpenRef.current = isMobileSearchOpen;
    if (searchToggleRef.current) {
      searchToggleRef.current.focus();
    }
  }, [isMobileSearchOpen]);

  useEffect(() => {
    function handleResize() {
      if (window.innerWidth > 768) {
        closeMobileSearch();
      }
    }

    handleResize();
    window.addEventListener("resize", handleResize);
    window.addEventListener("orientationchange", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("orientationchange", handleResize);
    };
  }, [closeMobileSearch]);

  const handleCategorySelect = (category) => {
    const nextCategory = selectedCategory === category ? null : category;
    if (onCategorySelect) onCategorySelect(nextCategory);
    setOpenMenu(null);
  };

  const handleGenreSelect = (genre) => {
    const nextGenre = selectedGenre === genre ? null : genre;
    if (onGenreSelect) onGenreSelect(nextGenre);
    setOpenMenu(null);
  };

  const handleMobileSearchKeyDown = (event) => {
    if (event.key === "Escape") {
      event.stopPropagation();
      closeMobileSearch();
    }
  };

  const handleLogoClick = () => {
    setOpenMenu(null);
    closeMobileSearch();
    if (onLogoClick) {
      onLogoClick();
    }
  };

  return (
    <header className="header">
      <div className="header-inner">
        <div className="header__left">
          <Link className="header__brand" to="/" onClick={handleLogoClick} aria-label={LOGO_ALT}>
            <img
              src={heroLogo}
              alt={LOGO_ALT}
              loading="eager"
              onError={(event) => {
                event.currentTarget.onerror = null;
                event.currentTarget.src = heroLogoFallback;
              }}
            />
          </Link>
          <div className="header__contacts">
            <div className="social social--sm" aria-label="Social links">
              <a
                className="social-link"
                href="https://instagram.com/ukrbook_montreal"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
              >
                <span className="social-icon">
                  <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                    <rect
                      x="3"
                      y="3"
                      width="18"
                      height="18"
                      rx="5"
                      ry="5"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.6"
                    />
                    <circle
                      cx="12"
                      cy="12"
                      r="4.5"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.6"
                    />
                    <circle cx="17.35" cy="6.65" r="1.1" fill="currentColor" stroke="none" />
                  </svg>
                </span>
              </a>
              <a
                className="social-link"
                href="https://www.facebook.com/share/1JH1fYgNFn/?mibextid=wwXIfr"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
              >
                <span className="social-icon">
                  <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                    <path
                      d="M15.5 3h-3a4 4 0 0 0-4 4v3H6v3h2.5v8h3.4v-8h2.7l0.5-3H11.9V7.4c0-0.74 0.46-1.4 1.3-1.4h2.3V3Z"
                      fill="currentColor"
                    />
                  </svg>
                </span>
              </a>
            </div>
            <div className="header__contact">
              <a href="#contact" className="header__contact-link">
                {CONTACT_LINK_TEXT}
              </a>
              {contactPhone && (
                <a href={`tel:${sanitizedPhone}`} className="header__contact-phone">
                  {contactPhone}
                </a>
              )}
            </div>
          </div>
        </div>

        <div className="header__center header__search search-wrap">
          <Search variant="full" value={searchTerm} onChange={onSearchChange} />
          <p className="header__search-note">
            <span>{SEARCH_NOTE_LINE_1}</span>
            <span>{SEARCH_NOTE_LINE_2}</span>
          </p>
        </div>

        <div className="header__right" ref={menuRef}>
          <button
            type="button"
            className={`header__search-toggle${isMobileSearchOpen ? " is-active" : ""}`}
            aria-label={isMobileSearchOpen ? SEARCH_TOGGLE_CLOSE_ARIA : SEARCH_TOGGLE_ARIA}
            aria-expanded={isMobileSearchOpen}
            aria-controls={MOBILE_SEARCH_ID}
            onClick={toggleMobileSearch}
            ref={searchToggleRef}
          >
            <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
              <path
                d="M15.5 15.5 20 20"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.8"
              />
              <circle
                cx="11"
                cy="11"
                r="5.5"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
              />
            </svg>
          </button>

          <div className="header__navRow">
            <nav className="header__menu header__nav" aria-label={NAV_ARIA_LABEL}>
              <div className="menu-item">
                <button
                  type="button"
                  className={`menu-button${selectedCategory ? " menu-button--active" : ""}`}
                  aria-haspopup="true"
                  aria-expanded={openMenu === "books"}
                  onClick={() => toggleMenu("books")}
                >
                  {BOOKS_LABEL}
                </button>
                {openMenu === "books" && (
                  <div className="dropdown" role="menu">
                    {BOOK_CATEGORIES.map((category) => {
                      const isActive = selectedCategory === category.label;
                      return (
                        <button
                          key={category.slug}
                          type="button"
                          role="menuitemradio"
                          aria-checked={isActive}
                          onClick={() => handleCategorySelect(category.label)}
                          className={isActive ? "is-active" : ""}
                        >
                          {category.label}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
              <div className={`menu-item ${alignGenresEnd ? "menu-item--align-end" : ""}`}>
                <button
                  type="button"
                  className={`menu-button${selectedGenre ? " menu-button--active" : ""}`}
                  aria-haspopup="true"
                  aria-expanded={openMenu === "genres"}
                  onClick={() => toggleMenu("genres")}
                  ref={genresBtnRef}
                >
                  {GENRES_LABEL}
                </button>
                {openMenu === "genres" && (
                  <div className="dropdown" role="menu">
                    {GENRE_LIST.map((genre) => {
                      const isActive = selectedGenre === genre.label;
                      return (
                        <button
                          key={genre.slug}
                          type="button"
                          role="menuitemradio"
                          aria-checked={isActive}
                          onClick={() => handleGenreSelect(genre.label)}
                          className={isActive ? "is-active" : ""}
                        >
                          {genre.label}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </nav>
          </div>

          <button
            className="header__cart"
            type="button"
            onClick={onCartToggle}
            aria-label={CART_BUTTON_ARIA}
          >
            <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
              <path
                d="M6.5 5.5h-2l2 9h11l2-7h-12"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <circle cx="10" cy="19" r="1.5" />
              <circle cx="17" cy="19" r="1.5" />
            </svg>
            <span className="header__cart-count">{cartCount}</span>
          </button>
        </div>
      </div>

      <div
        className={`header__search-popover${isMobileSearchOpen ? " header__search-popover--visible" : ""}`}
        id={MOBILE_SEARCH_ID}
        role="dialog"
        aria-modal="true"
        aria-labelledby={MOBILE_SEARCH_TITLE_ID}
        aria-hidden={isMobileSearchOpen ? "false" : "true"}
        onClick={closeMobileSearch}
      >
        <div
          className="header__search-popover-panel"
          ref={searchPanelRef}
          role="document"
          onClick={(event) => event.stopPropagation()}
        >
          <div className="header__search-popover-header">
            <p id={MOBILE_SEARCH_TITLE_ID} className="header__search-label">
              {MOBILE_SEARCH_LABEL}
            </p>
            <button
              type="button"
              className="header__search-close"
              aria-label={MOBILE_SEARCH_CLOSE_LABEL}
              onClick={closeMobileSearch}
            >
              <span>{MOBILE_SEARCH_CLOSE_LABEL}</span>
              <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                <path
                  d="M6 6 18 18M18 6 6 18"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="none"
                />
              </svg>
            </button>
          </div>
          <Search
            variant="sheet"
            ref={searchInputRef}
            value={searchTerm}
            onChange={onSearchChange}
            autoFocus={isMobileSearchOpen}
            onKeyDown={handleMobileSearchKeyDown}
          />
        </div>
      </div>
    </header>
  );
}

export default Header;



