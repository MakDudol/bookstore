import './Cart.css'

function Cart({
  isOpen,
  items,
  onUpdateQuantity,
  onRemove,
  onClose,
  onCheckout,
  total,
  formatPrice,
}) {
  const handleQuantityChange = (id, delta) => {
    onUpdateQuantity(id, delta)
  }

  return (
    <div className={`cart${isOpen ? ' cart--open' : ''}`}>
      <div className="cart__overlay" role="presentation" onClick={onClose} />
      <aside className="cart__panel" aria-hidden={!isOpen}>
        <div className="cart__header">
          <h2>Ваш кошик</h2>
          <button type="button" onClick={onClose} aria-label="Закрити кошик">
            ×
          </button>
        </div>
        <div className="cart__content">
          {items.length === 0 ? (
            <p className="cart__empty">У кошику поки порожньо. Додайте першу книжку!</p>
          ) : (
            <ul className="cart__list">
              {items.map((item) => (
                <li key={item.id} className="cart__item">
                  <div>
                    <p className="cart__item-title">{item.book.title}</p>
                    <p className="cart__item-author">{item.book.author}</p>
                    <p className="cart__item-price">{formatPrice(item.book.priceCad)}</p>
                  </div>
                  <div className="cart__item-actions">
                    <div className="cart__quantity">
                      <button type="button" onClick={() => handleQuantityChange(item.id, -1)} aria-label="Зменшити кількість">
                        –
                      </button>
                      <span>{item.quantity}</span>
                      <button type="button" onClick={() => handleQuantityChange(item.id, 1)} aria-label="Збільшити кількість">
                        +
                      </button>
                    </div>
                    <button className="cart__remove" type="button" onClick={() => onRemove(item.id)}>
                      Видалити
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="cart__footer">
          <div className="cart__total">
            <span>Разом</span>
            <strong>{formatPrice(total)}</strong>
          </div>
          <button
            type="button"
            className="cart__checkout"
            onClick={onCheckout}
            disabled={items.length === 0}
          >
            Оформити замовлення
          </button>
        </div>
      </aside>
    </div>
  )
}

export default Cart
