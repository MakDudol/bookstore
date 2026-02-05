import { useState } from "react";
import "./CheckoutModal.css";

const FORM_TITLE = "Оформлення замовлення";
const FORM_SUBTITLE = "Ми зв'яжемося протягом дня та уточнимо деталі доставки.";
const NAME_LABEL = "Ім'я";
const CONTACT_LABEL = "Email або телефон";
const COMMENT_LABEL = "Коментар";
const COMMENT_PLACEHOLDER = "Напишіть, як зручно отримати чи доставити замовлення";
const FORM_SUBMIT = "Підтвердити";
const SUMMARY_TITLE = "Дякуємо! Замовлення оформлено";
const SUMMARY_TEXT = "Ми вже обробляємо заявку. Підсумок замовлення:";
const SUMMARY_TOTAL = "Разом";
const SUMMARY_CLOSE = "Закрити";

function CheckoutModal({ isOpen, onClose, onSubmit, summary, formatPrice }) {
  const [formData, setFormData] = useState({
    name: "",
    contact: "",
    comment: "",
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit(formData);
  };

  const handleClose = () => {
    setFormData({ name: "", contact: "", comment: "" });
    onClose();
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="checkout" role="dialog" aria-modal="true">
      <div className="checkout__overlay" onClick={handleClose} role="presentation" />
      <div className="checkout__content">
        <button className="checkout__close" type="button" onClick={handleClose} aria-label={SUMMARY_CLOSE}>
          ×
        </button>
        {!summary ? (
          <>
            <h2>{FORM_TITLE}</h2>
            <p className="checkout__subtitle">{FORM_SUBTITLE}</p>
            <form className="checkout__form" onSubmit={handleSubmit}>
              <label>
                {NAME_LABEL}
                <input type="text" name="name" value={formData.name} onChange={handleChange} required />
              </label>
              <label>
                {CONTACT_LABEL}
                <input
                  type="text"
                  name="contact"
                  value={formData.contact}
                  onChange={handleChange}
                  placeholder="solovyinaca@gmail.com"
                  required
                />
              </label>
              <label>
                {COMMENT_LABEL}
                <textarea
                  name="comment"
                  value={formData.comment}
                  onChange={handleChange}
                  rows="4"
                  placeholder={COMMENT_PLACEHOLDER}
                />
              </label>
              <button type="submit" className="checkout__submit">
                {FORM_SUBMIT}
              </button>
            </form>
          </>
        ) : (
          <div className="checkout__summary">
            <h2>{SUMMARY_TITLE}</h2>
            <p>{SUMMARY_TEXT}</p>
            <ul className="checkout__summary-list">
              {summary.items.map((item) => {
                const unitPrice = item.unitPrice ?? item.priceCad;
                const lineTotal = item.lineTotal ?? unitPrice * item.quantity;
                return (
                  <li key={item.id} className="checkout__summary-item">
                    <span className="checkout__summary-title">
                      {item.quantity} × {item.title}
                    </span>
                    <span className="checkout__summary-line">
                      {formatPrice(lineTotal)}
                      <span className="checkout__summary-note">
                        ({item.quantity} × {formatPrice(unitPrice)})
                      </span>
                    </span>
                  </li>
                );
              })}
            </ul>
            <p className="checkout__total">
              {SUMMARY_TOTAL}: {formatPrice(summary.total)}
            </p>

            <button type="button" className="checkout__submit" onClick={handleClose}>
              {SUMMARY_CLOSE}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default CheckoutModal;
