import logo from '../assets/solovyina_logo_ukr.jpg'

import Search from './Search'
import './Header.css'
import { useEffect, useRef, useState } from 'react'

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
}) {
  const sanitizedPhone = contactPhone.replace(/[^+\d]/g, '')

  // Dropdown state and refs
  const [openMenu, setOpenMenu] = useState(null) // 'books' | 'genres' | null
  const [alignGenresEnd, setAlignGenresEnd] = useState(false)
  const menuRef = useRef(null)
  const genresBtnRef = useRef(null)

  const toggleMenu = (name) => {
    setOpenMenu((prev) => (prev === name ? null : name))
  }

  // Close on click outside
  useEffect(() => {
    function handleDown(e) {
      if (!menuRef.current) return
      if (menuRef.current.contains(e.target)) return
      setOpenMenu(null)
    }
    document.addEventListener('mousedown', handleDown)
    return () => document.removeEventListener('mousedown', handleDown)
  }, [])

  // Close on Esc
  useEffect(() => {
    function onKey(e) {
      if (e.key === 'Escape') setOpenMenu(null)
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [])

  // Prevent dropdown overflow on the right for genres
  useEffect(() => {
    function updateAlign() {
      if (!genresBtnRef.current) return
      const rect = genresBtnRef.current.getBoundingClientRect()
      const estimatedMenuWidth = 240 // px, should match CSS min-width
      const safetyGap = 12
      const spaceRight = window.innerWidth - rect.right
      setAlignGenresEnd(spaceRight < estimatedMenuWidth + safetyGap)
    }

    updateAlign()
    window.addEventListener('resize', updateAlign)
    return () => window.removeEventListener('resize', updateAlign)
  }, [])

  const bookCategories = [
    'Новинки',
    'Дитяча література',
    'Зарубіжна література',
    'Українська література',
    'Посібники',
  ]

  const genreList = [
    'Детективи',
    'Трилери',
    'Жахи',
    'Фантастика',
    'Фентезі',
    'Науково-популярна література',
    'Біографії',
    'Любовний роман',
    'Соціальний роман',
    'Історичний роман',
    'Пригодницький роман',
    'Класика',
    'Казки',
    'Навчальна література',
    'Пізнавальна література',
    'Мотиваційна література',
    'Психологія',
  ]

  const handleCategorySelect = (category) => {
    const nextCategory = selectedCategory === category ? null : category
    if (onCategorySelect) {
      onCategorySelect(nextCategory)
    }
    setOpenMenu(null)
  }

  const handleGenreSelect = (genre) => {
    const nextGenre = selectedGenre === genre ? null : genre
    if (onGenreSelect) {
      onGenreSelect(nextGenre)
    }
    setOpenMenu(null)
  }

  return (
    <header className="header">
      <div className="header__left">
        <a className="header__brand" href="#top">
          <img src={logo} alt="Logo" />
        </a>
        <div className="header__contact">
          <a href="#contact" className="header__contact-link">
            Контакти та умови
          </a>
          <a href={`tel:${sanitizedPhone}`} className="header__contact-phone">
            {contactPhone}
          </a>
        </div>
      </div>

      <div className="header__center">
        <Search value={searchTerm} onChange={onSearchChange} />
      </div>

      <div className="header__right" ref={menuRef}>
        <nav className="header__menu" aria-label="Меню навігації">
          <div className="menu-item">
            <button
              type="button"
              className={`menu-button${selectedCategory ? ' menu-button--active' : ''}`}
              aria-haspopup="true"
              aria-expanded={openMenu === 'books'}
              onClick={() => toggleMenu('books')}
            >
              Книги
            </button>
            {openMenu === 'books' && (
              <div className="dropdown" role="menu">
                {bookCategories.map((category) => {
                  const isActive = selectedCategory === category
                  return (
                    <button
                      key={category}
                      type="button"
                      role="menuitemradio"
                      aria-checked={isActive}
                      onClick={() => handleCategorySelect(category)}
                      className={isActive ? 'is-active' : ''}
                    >
                      {category}
                    </button>
                  )
                })}
              </div>
            )}
          </div>
          <div className={`menu-item ${alignGenresEnd ? 'menu-item--align-end' : ''}`}>
            <button
              type="button"
              className={`menu-button${selectedGenre ? ' menu-button--active' : ''}`}
              aria-haspopup="true"
              aria-expanded={openMenu === 'genres'}
              onClick={() => toggleMenu('genres')}
              ref={genresBtnRef}
            >
              Жанри
            </button>
            {openMenu === 'genres' && (
              <div className="dropdown" role="menu">
                {genreList.map((genre) => {
                  const isActive = selectedGenre === genre
                  return (
                    <button
                      key={genre}
                      type="button"
                      role="menuitemradio"
                      aria-checked={isActive}
                      onClick={() => handleGenreSelect(genre)}
                      className={isActive ? 'is-active' : ''}
                    >
                      {genre}
                    </button>
                  )
                })}
              </div>
            )}
          </div>
        </nav>
        <button
          className="header__cart"
          type="button"
          onClick={onCartToggle}
          aria-label="Відкрити кошик"
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
    </header>
  )
}

export default Header
