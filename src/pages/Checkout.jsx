import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import "./Checkout.css";

const PAGE_TITLE = "Оформлення замовлення";
const PAGE_HELPER =
  "Ми зв’яжемося з вами для підтвердження та узгодження оплати/доставки.";
const EMPTY_TITLE = "Кошик порожній";
const EMPTY_HELPER = "Перейдіть до каталогу, щоб додати книги.";
const EMPTY_ACTION = "Повернутися до каталогу";
const SUCCESS_TITLE = "Дякуємо! Ми скоро з вами зв’яжемося.";
const SUCCESS_HELPER = "Ваше замовлення надіслано, ми підтвердимо його найближчим часом.";
const SUCCESS_ACTION = "Повернутися на головну";

const SECTION_CUSTOMER = "Особиста інформація (латиницею)";
const SECTION_DELIVERY = "Адреса (латиницею)";
const SECTION_PAYMENT = "Спосіб оплати";
const SECTION_ORDER = "Замовлення";
const SECTION_TOTALS = "Деталі вартості";

const NAME_LABEL = "Ім’я та Прізвище";
const EMAIL_LABEL = "Імейл";
const PHONE_LABEL = "Телефон";
const ADDRESS_LABEL = "Адреса";
const APARTMENT_LABEL = "Квартира";
const CITY_LABEL = "Місто";
const REGION_LABEL = "Штат/Провінція";
const POSTAL_LABEL = "Zip/Postal Code";
const COUNTRY_LABEL = "Країна";

const PAYMENT_CONFIRM = "Оплата після підтвердження";
const PAYMENT_CONFIRM_HELPER = "Ми зв’яжемося з вами та узгодимо спосіб оплати.";

const REMOVE_LABEL = "Видалити";
const SUBMIT_LABEL = "Відправити замовлення";

const TOTAL_SUBTOTAL = "Вартість без знижки";
const TOTAL_DISCOUNT = "Знижка";
const TOTAL_SUM = "Загальна сума";

const REQUIRED_MESSAGE = "Обов'язкове поле";
const EMAIL_MESSAGE = "Некоректний email";

const initialForm = {
  name: "",
  email: "",
  phone: "",
  address: "",
  apartment: "",
  city: "",
  region: "",
  postal: "",
  country: "",
};

function Checkout({
  items = [],
  total = 0,
  formatPrice,
  onUpdateQuantity = () => {},
  onRemove = () => {},
  onClearCart = () => {},
  contactEmail = "",
}) {
  const [formData, setFormData] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  const subtotal = useMemo(
    () =>
      items.reduce((sum, item) => {
        const basePrice = Number(item.book?.priceCad) || 0;
        return sum + basePrice * item.quantity;
      }, 0),
    [items],
  );

  const discount = Math.max(0, subtotal - total);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const validate = () => {
    const nextErrors = {};
    const requiredFields = ["name", "email", "phone", "address", "city", "region", "postal", "country"];

    requiredFields.forEach((field) => {
      if (!String(formData[field] ?? "").trim()) {
        nextErrors[field] = REQUIRED_MESSAGE;
      }
    });

    if (!nextErrors.email && formData.email) {
      const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email);
      if (!emailValid) {
        nextErrors.email = EMAIL_MESSAGE;
      }
    }

    return nextErrors;
  };

  const focusFirstError = (nextErrors) => {
    const orderedFields = [
      "name",
      "email",
      "phone",
      "address",
      "city",
      "region",
      "postal",
      "country",
    ];
    const firstField = orderedFields.find((field) => nextErrors[field]);
    if (!firstField || typeof document === "undefined") {
      return;
    }
    const el = document.getElementById(`checkout-${firstField}`);
    if (el) {
      el.focus();
      el.scrollIntoView({ block: "center", behavior: "smooth" });
    }
  };

  const buildMailto = () => {
    const lines = [
      "Нове замовлення",
      "",
      "Ваші дані:",
      `Ім’я: ${formData.name}`,
      `Імейл: ${formData.email}`,
      `Телефон: ${formData.phone}`,
      "",
      "Деталі доставки:",
      `Адреса: ${formData.address}`,
      `Квартира: ${formData.apartment || "-"}`,
      `Місто: ${formData.city}`,
      `Штат/Провінція: ${formData.region}`,
      `Zip/Postal Code: ${formData.postal}`,
      `Країна: ${formData.country}`,
      "",
      "Спосіб оплати:",
      PAYMENT_CONFIRM,
      "",
      "Замовлення:",
      ...items.map((item) => {
        const unit = item.unitPrice ?? item.book?.priceCad ?? 0;
        const line = item.lineTotal ?? unit * item.quantity;
        return `- ${item.book?.title} — ${item.quantity} x ${formatPrice(unit)} = ${formatPrice(line)}`;
      }),
      "",
      `${TOTAL_SUBTOTAL}: ${formatPrice(subtotal)}`,
      `${TOTAL_DISCOUNT}: ${formatPrice(discount)}`,
      `${TOTAL_SUM}: ${formatPrice(total)}`,
    ];

    const subject = "Нове замовлення — Солов'їна";
    const body = lines.join("\n");
    return `mailto:${contactEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const nextErrors = validate();
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      focusFirstError(nextErrors);
      return;
    }

    if (typeof window !== "undefined") {
      window.location.href = buildMailto();
    }

    setIsSubmitted(true);
    onClearCart();
  };

  const renderPrice = (item) => {
    const unit = item.unitPrice ?? item.book?.priceCad ?? 0;
    const hasDiscount =
      typeof item.book?.discountPriceCad === "number" &&
      item.book.discountPriceCad < item.book.priceCad;

    return (
      <div className="checkout__price">
        {hasDiscount && <span className="checkout__price-old">{formatPrice(item.book.priceCad)}</span>}
        <span className="checkout__price-new">{formatPrice(unit)}</span>
      </div>
    );
  };

  if (isSubmitted) {
    return (
      <section className="checkout-page">
        <div className="checkout-shell">
          <div className="checkout-card checkout-card--center">
            <h1>{SUCCESS_TITLE}</h1>
            <p>{SUCCESS_HELPER}</p>
            <Link to="/" className="cart-button checkout__submit">
              {SUCCESS_ACTION}
            </Link>
          </div>
        </div>
      </section>
    );
  }

  if (!items.length) {
    return (
      <section className="checkout-page">
        <div className="checkout-shell">
          <div className="checkout-card checkout-card--center">
            <h1>{EMPTY_TITLE}</h1>
            <p>{EMPTY_HELPER}</p>
            <Link to="/" className="cart-button checkout__submit">
              {EMPTY_ACTION}
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="checkout-page">
      <div className="checkout-shell">
        <header className="checkout__header">
          <h1>{PAGE_TITLE}</h1>
          <p>{PAGE_HELPER}</p>
        </header>

        <div className="checkout-grid">
          <div className="checkout-main">
            <form id="checkout-form" className="checkout-form" onSubmit={handleSubmit} noValidate>
              <div className="checkout-card">
                <div className="checkout-card__header">
                  <h2>{SECTION_CUSTOMER}</h2>
                </div>
                <div className="checkout-fields checkout-fields--three">
                  <label className="checkout-field">
                    <span>{NAME_LABEL}</span>
                    <input
                      id="checkout-name"
                      name="name"
                      type="text"
                      value={formData.name}
                      onChange={handleChange}
                    />
                    {errors.name && <em className="checkout__error">{errors.name}</em>}
                  </label>
                  <label className="checkout-field">
                    <span>{EMAIL_LABEL}</span>
                    <input
                      id="checkout-email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                    />
                    {errors.email && <em className="checkout__error">{errors.email}</em>}
                  </label>
                  <label className="checkout-field">
                    <span>{PHONE_LABEL}</span>
                    <input
                      id="checkout-phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleChange}
                    />
                    {errors.phone && <em className="checkout__error">{errors.phone}</em>}
                  </label>
                </div>
              </div>

              <div className="checkout-card">
                <div className="checkout-card__header">
                  <h2>{SECTION_DELIVERY}</h2>
                </div>
                <div className="checkout-fields checkout-fields--three">
                  <label className="checkout-field checkout-field--span-2">
                    <span>{ADDRESS_LABEL}</span>
                    <input
                      id="checkout-address"
                      name="address"
                      type="text"
                      value={formData.address}
                      onChange={handleChange}
                    />
                    {errors.address && <em className="checkout__error">{errors.address}</em>}
                  </label>
                  <label className="checkout-field">
                    <span>{APARTMENT_LABEL}</span>
                    <input
                      name="apartment"
                      type="text"
                      value={formData.apartment}
                      onChange={handleChange}
                    />
                  </label>
                  <label className="checkout-field">
                    <span>{CITY_LABEL}</span>
                    <input
                      id="checkout-city"
                      name="city"
                      type="text"
                      value={formData.city}
                      onChange={handleChange}
                    />
                    {errors.city && <em className="checkout__error">{errors.city}</em>}
                  </label>
                  <label className="checkout-field">
                    <span>{REGION_LABEL}</span>
                    <input
                      id="checkout-region"
                      name="region"
                      type="text"
                      value={formData.region}
                      onChange={handleChange}
                    />
                    {errors.region && <em className="checkout__error">{errors.region}</em>}
                  </label>
                  <label className="checkout-field">
                    <span>{POSTAL_LABEL}</span>
                    <input
                      id="checkout-postal"
                      name="postal"
                      type="text"
                      value={formData.postal}
                      onChange={handleChange}
                    />
                    {errors.postal && <em className="checkout__error">{errors.postal}</em>}
                  </label>
                  <label className="checkout-field">
                    <span>{COUNTRY_LABEL}</span>
                    <input
                      id="checkout-country"
                      name="country"
                      type="text"
                      value={formData.country}
                      onChange={handleChange}
                    />
                    {errors.country && <em className="checkout__error">{errors.country}</em>}
                  </label>
                </div>
              </div>

              <div className="checkout-card">
                <div className="checkout-card__header">
                  <h2>{SECTION_PAYMENT}</h2>
                </div>
                <div className="checkout-payment">
                  <label className="checkout-payment__option">
                    <input type="radio" checked readOnly aria-hidden="true" tabIndex={-1} />
                    <div>
                      <span>{PAYMENT_CONFIRM}</span>
                      <em>{PAYMENT_CONFIRM_HELPER}</em>
                    </div>
                  </label>
                </div>
              </div>

              <div className="checkout-card">
                <div className="checkout-card__header">
                  <h2>{SECTION_ORDER}</h2>
                  <span>{items.length} товарів</span>
                </div>
                <ul className="checkout-items">
                  {items.map((item) => (
                    <li key={item.id} className="checkout-item">
                      <img src={item.book.coverUrl} alt={item.book.title} loading="lazy" />
                      <div className="checkout-item__body">
                        <div className="checkout-item__top">
                          <div>
                            <p className="checkout-item__title">{item.book.title}</p>
                            <p className="checkout-item__author">{item.book.author}</p>
                          </div>
                          <button type="button" onClick={() => onRemove(item.id)}>
                            {REMOVE_LABEL}
                          </button>
                        </div>
                        <div className="checkout-item__meta">
                          {renderPrice(item)}
                          <div className="checkout-qty">
                            <button type="button" onClick={() => onUpdateQuantity(item.id, -1)}>
                              -
                            </button>
                            <span>{item.quantity}</span>
                            <button type="button" onClick={() => onUpdateQuantity(item.id, 1)}>
                              +
                            </button>
                          </div>
                          <strong>{formatPrice(item.lineTotal ?? item.unitPrice * item.quantity)}</strong>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </form>
          </div>

          <aside className="checkout-summary">
            <div className="checkout-card">
              <div className="checkout-card__header">
                <h2>{SECTION_TOTALS}</h2>
              </div>
              <div className="checkout-summary__rows">
                <div>
                  <span>{TOTAL_SUBTOTAL}</span>
                  <strong>{formatPrice(subtotal)}</strong>
                </div>
                <div>
                  <span>{TOTAL_DISCOUNT}</span>
                  <strong>{formatPrice(discount)}</strong>
                </div>
                <div className="checkout-summary__total">
                  <span>{TOTAL_SUM}</span>
                  <strong>{formatPrice(total)}</strong>
                </div>
              </div>
              <button type="submit" form="checkout-form" className="cart-button checkout__submit">
                {SUBMIT_LABEL}
              </button>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}

export default Checkout;
