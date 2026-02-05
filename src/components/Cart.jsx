import { effectivePriceCad } from "../utils/pricing";
import "./Cart.css";

const TITLE = "Ваш кошик";
const EMPTY_TEXT = "Ваш кошик поки порожній. Додайте книжку, щоб продовжити.";
const CLOSE_ARIA = "Закрити кошик";
const DECREASE_ARIA = "Зменшити кількість";
const INCREASE_ARIA = "Збільшити кількість";
const REMOVE_LABEL = "Видалити";
const TOTAL_LABEL = "Разом";
const CHECKOUT_LABEL = "Оформити замовлення";

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
    onUpdateQuantity(id, delta);
  };

  const renderPriceBlock = (item) => {
    const unitPrice = item.unitPrice ?? effectivePriceCad(item.book);
    const lineTotal = item.lineTotal ?? unitPrice * item.quantity;
    const hasDiscount =
      typeof item.book.discountPriceCad === "number" &&
      item.book.discountPriceCad < item.book.priceCad;

    return (
      <div className="cart__item-pricing">
        <div className="cart__item-price">
          {hasDiscount ? (
            <>
              <span className="cart__price-old">{formatPrice(item.book.priceCad)}</span>
              <span className="cart__price-new">{formatPrice(unitPrice)}</span>
            </>
          ) : (
            <span className="cart__price-new">{formatPrice(unitPrice)}</span>
          )}
        </div>
        <p className="cart__item-line">
          {item.quantity} × {formatPrice(unitPrice)}
          <span>= {formatPrice(lineTotal)}</span>
        </p>
      </div>
    );
  };

  return (
    <div className={`cart${isOpen ? " cart--open" : ""}`}>
      <div className="cart__overlay" role="presentation" onClick={onClose} />
      <aside className="cart__panel" aria-hidden={!isOpen}>
        <div className="cart__header">
          <h2>{TITLE}</h2>
          <button type="button" onClick={onClose} aria-label={CLOSE_ARIA}>
            ×
          </button>
        </div>
        <div className="cart__content">
          {items.length === 0 ? (
            <p className="cart__empty">{EMPTY_TEXT}</p>
          ) : (
            <ul className="cart__list">
              {items.map((item) => (
                <li key={item.id} className="cart__item">
                  <div className="cart__item-info">
                    <p className="cart__item-title">{item.book.title}</p>
                    <p className="cart__item-author">{item.book.author}</p>
                    {renderPriceBlock(item)}
                  </div>
                  <div className="cart__item-actions">
                    <div className="cart__quantity">
                      <button
                        type="button"
                        onClick={() => handleQuantityChange(item.id, -1)}
                        aria-label={DECREASE_ARIA}
                      >
                        –
                      </button>
                      <span>{item.quantity}</span>
                      <button
                        type="button"
                        onClick={() => handleQuantityChange(item.id, 1)}
                        aria-label={INCREASE_ARIA}
                      >
                        +
                      </button>
                    </div>
                    <button className="cart__remove" type="button" onClick={() => onRemove(item.id)}>
                      {REMOVE_LABEL}
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="cart__footer">
          <div className="cart__total">
            <span>{TOTAL_LABEL}</span>
            <strong>{formatPrice(total)}</strong>
          </div>
          <button
            type="button"
            className="cart__checkout"
            onClick={onCheckout}
            disabled={items.length === 0}
          >
            {CHECKOUT_LABEL}
          </button>
        </div>
      </aside>
    </div>
  );
}

export default Cart;
