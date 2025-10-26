import logo from '../assets/logo.svg'
import Search from './Search'
import './Header.css'

function Header({ searchTerm, onSearchChange, onCartToggle, cartCount, contactPhone }) {
  const sanitizedPhone = contactPhone.replace(/[^+\d]/g, '')

  return (
    <header className="header">
      <div className="header__left">
        <a className="header__brand" href="#top">
          <img src={logo} alt="Солов'їна" />
        </a>
        <div className="header__contact">
          <a href="#contact" className="header__contact-link">
            Зв’яжіться з нами
          </a>
          <a href={`tel:${sanitizedPhone}`} className="header__contact-phone">
            {contactPhone}
          </a>
        </div>
      </div>

      <div className="header__center">
        <Search value={searchTerm} onChange={onSearchChange} />
      </div>

      <div className="header__right">
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
