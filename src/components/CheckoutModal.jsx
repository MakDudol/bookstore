import { useState } from 'react'
import './CheckoutModal.css'

function CheckoutModal({ isOpen, onClose, onSubmit, summary, formatPrice, contacts }) {
  const [formData, setFormData] = useState({
    name: '',
    contact: '',
    comment: '',
  })

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    onSubmit(formData)
  }

  const handleClose = () => {
    setFormData({ name: '', contact: '', comment: '' })
    onClose()
  }

  if (!isOpen) {
    return null
  }

  const orderText = summary
    ? `Привіт! Мене звати ${summary.name}. Хочу замовити: ${summary.items
        .map((item) => `${item.quantity} × ${item.title}`)
        .join(', ')}. Разом: ${formatPrice(summary.total)}.`
    : ''

  return (
    <div className="checkout" role="dialog" aria-modal="true">
      <div className="checkout__overlay" onClick={handleClose} role="presentation" />
      <div className="checkout__content">
        <button className="checkout__close" type="button" onClick={handleClose} aria-label="Закрити форму">
          ×
        </button>
        {!summary ? (
          <>
            <h2>Оформлення замовлення</h2>
            <p className="checkout__subtitle">
              Залиши контакт, і ми продовжимо у листуванні або дзвінку.
            </p>
            <form className="checkout__form" onSubmit={handleSubmit}>
              <label>
                Ім’я
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </label>
              <label>
                Email або телефон
                <input
                  type="text"
                  name="contact"
                  value={formData.contact}
                  onChange={handleChange}
                  placeholder="example@email.com / +1 234 567 890"
                  required
                />
              </label>
              <label>
                Коментар
                <textarea
                  name="comment"
                  value={formData.comment}
                  onChange={handleChange}
                  rows="4"
                  placeholder="Коли зручно зв’язатися або побажання до замовлення"
                />
              </label>
              <button type="submit" className="checkout__submit">
                Відправити запит
              </button>
            </form>
          </>
        ) : (
          <div className="checkout__summary">
            <h2>Дякуємо! Запит відправлено</h2>
            <p>Ми зв’яжемося найближчим часом. А поки — підсумок замовлення:</p>
            <ul>
              {summary.items.map((item) => (
                <li key={item.id}>
                  {item.quantity} × {item.title} — {formatPrice(item.priceCad)}
                </li>
              ))}
            </ul>
            <p className="checkout__total">Разом: {formatPrice(summary.total)}</p>
            <div className="checkout__contact">
              <p>
                Скопіюй і надішли цей текст на <strong>{contacts.email}</strong> або в Instagram{' '}
                <strong>{contacts.instagram}</strong>:
              </p>
              <textarea readOnly value={orderText} />
            </div>
            <button type="button" className="checkout__submit" onClick={handleClose}>
              Закрити
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default CheckoutModal
