import { useEffect, useMemo, useState } from 'react'
import Header from './components/Header'
import Catalog from './components/Catalog'
import Cart from './components/Cart'
import CheckoutModal from './components/CheckoutModal'
import books from './data/books'
import { loadCart, saveCart } from './utils/storage'
import './App.css'

const CONTACTS = {
  email: 'hello@example.com',
  instagram: '@vinobook_demo',
  phone: '+1 (555) 123-4567',
}

const formatter = new Intl.NumberFormat('uk-UA', {
  style: 'currency',
  currency: 'CAD',
  minimumFractionDigits: 2,
})

function App() {
  const [searchTerm, setSearchTerm] = useState('')
  const [cartItems, setCartItems] = useState(() => loadCart())
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false)
  const [checkoutSummary, setCheckoutSummary] = useState(null)

  useEffect(() => {
    saveCart(cartItems)
  }, [cartItems])

  const formatPrice = (value) => formatter.format(value)

  const filteredBooks = useMemo(() => {
    const normalized = searchTerm.trim().toLowerCase()
    if (!normalized) {
      return books
    }

    return books.filter((book) => {
      const haystack = `${book.title} ${book.author}`.toLowerCase()
      return haystack.includes(normalized)
    })
  }, [searchTerm])

  const cartWithDetails = useMemo(
    () =>
      cartItems
        .map((item) => {
          const book = books.find((b) => b.id === item.id)
          if (!book) {
            return null
          }

          return {
            ...item,
            book,
          }
        })
        .filter(Boolean),
    [cartItems],
  )

  const cartTotal = cartWithDetails.reduce(
    (total, item) => total + item.book.priceCad * item.quantity,
    0,
  )

  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0)

  const handleAddToCart = (bookId) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.id === bookId)
      if (existing) {
        return prev.map((item) =>
          item.id === bookId ? { ...item, quantity: item.quantity + 1 } : item,
        )
      }

      return [...prev, { id: bookId, quantity: 1 }]
    })
    setIsCartOpen(true)
  }

  const handleUpdateQuantity = (bookId, delta) => {
    setCartItems((prev) =>
      prev
        .map((item) =>
          item.id === bookId
            ? { ...item, quantity: Math.max(0, item.quantity + delta) }
            : item,
        )
        .filter((item) => item.quantity > 0),
    )
  }

  const handleRemove = (bookId) => {
    setCartItems((prev) => prev.filter((item) => item.id !== bookId))
  }

  const handleCheckout = () => {
    setIsCheckoutOpen(true)
    setIsCartOpen(false)
  }

  const handleCheckoutSubmit = (data) => {
    const itemsForSummary = cartWithDetails.map((item) => ({
      id: item.id,
      title: item.book.title,
      priceCad: item.book.priceCad,
      quantity: item.quantity,
    }))

    setCheckoutSummary({
      ...data,
      items: itemsForSummary,
      total: cartTotal,
    })
  }

  const handleCloseCheckout = () => {
    setIsCheckoutOpen(false)
    setCheckoutSummary(null)
  }

  return (
    <div className="app">
      <Header
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onCartToggle={() => setIsCartOpen((prev) => !prev)}
        cartCount={cartCount}
      />

      <main>
        <section className="hero">
          <div className="hero__content">
            <p className="hero__eyebrow">Бутік української книжки</p>
            <h1>Vinobook — сучасна класика у винних тонах</h1>
            <p className="hero__text">
              Курований вибір видань «Кобзаря» для стильних подарунків та власної колекції.
              Обирай і залишай запит — ми зв’яжемося, щоб завершити замовлення.
            </p>
            <div className="hero__badges">
              <span>Авторський відбір</span>
              <span>Доставка по Канаді</span>
              <span>Без передоплати</span>
            </div>
          </div>
          <div className="hero__card">
            <div className="hero__card-inner">
              <p>Натхнення дня</p>
              <h2>«Кобзар»</h2>
              <p>Тарас Шевченко</p>
              <span>{formatPrice(40)}</span>
            </div>
          </div>
        </section>

        <Catalog books={filteredBooks} onAddToCart={handleAddToCart} />

        <section className="contact" id="contact">
          <div className="contact__card">
            <h2>Зв’яжіться з нами</h2>
            <p>
              Напишіть або зателефонуйте, якщо хочете уточнити наявність, варіанти доставки чи
              створити персональний набір.
            </p>
            <ul>
              <li>
                <span>Email</span>
                <a href={`mailto:${CONTACTS.email}`}>{CONTACTS.email}</a>
              </li>
              <li>
                <span>Instagram</span>
                <a href="https://instagram.com/vinobook_demo" target="_blank" rel="noreferrer">
                  {CONTACTS.instagram}
                </a>
              </li>
              <li>
                <span>Телефон</span>
                <a href={`tel:${CONTACTS.phone.replace(/[^+\d]/g, '')}`}>{CONTACTS.phone}</a>
              </li>
            </ul>
          </div>
          <div className="contact__note">
            <p>
              Після оформлення запиту ми надішлемо готовий текст для листа чи повідомлення.
              Просто вставте його в улюблений месенджер — і замовлення зрушить з місця.
            </p>
          </div>
        </section>
      </main>

      <footer className="footer">
        <p>© {new Date().getFullYear()} Vinobook. Усі права захищено.</p>
      </footer>

      <Cart
        isOpen={isCartOpen}
        items={cartWithDetails}
        onUpdateQuantity={handleUpdateQuantity}
        onRemove={handleRemove}
        onClose={() => setIsCartOpen(false)}
        onCheckout={handleCheckout}
        total={cartTotal}
        formatPrice={formatPrice}
      />

      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={handleCloseCheckout}
        onSubmit={handleCheckoutSubmit}
        summary={checkoutSummary}
        formatPrice={formatPrice}
      />
    </div>
  )
}

export default App
