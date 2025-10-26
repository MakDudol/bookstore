import logo from '../assets/logo.svg'
import Search from './Search'
import './Header.css'

function Header({ searchTerm, onSearchChange, onCartToggle, cartCount }) {
  return (
    <header className="header">
      <div className="header__logo">
        <img src={logo} alt="Vinobook" />
        <span>Vinobook</span>
      </div>
      <Search value={searchTerm} onChange={onSearchChange} />
      <button className="header__cart" type="button" onClick={onCartToggle} aria-label="Відкрити кошик">
        <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
          <path d="M6.5 5.5h-2l2 9h11l2-7h-12" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="10" cy="19" r="1.5" />
          <circle cx="17" cy="19" r="1.5" />
        </svg>
        <span className="header__cart-count">{cartCount}</span>
      </button>
    </header>
  )
}

export default Header
