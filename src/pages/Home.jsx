import Catalog from "../components/Catalog";

function Home({ storeName, contacts, highlightBook, books, onAddToCart, formatPrice }) {
  return (
    <>
      <section className="hero">
        <div className="hero__inner">
          <p className="hero__eyebrow">Українські книжки поруч із вами</p>
          <h1>{storeName} — місце, де живуть історії</h1>
          <p className="hero__text">
            Добираємо натхненні українські видання, які хочеться подарувати друзям, читати в дорозі й зберігати на
            полиці роками. Вибирайте, замовляйте, а ми подбаємо про решту.
          </p>
          <div className="hero__badges">
            <span>Підтримка українських авторів</span>
            <span>Кураторські добірки та рекомендації</span>
            <span>Швидка доставка по Монреалю</span>
          </div>
        </div>
      </section>

      <Catalog
        books={books}
        onAddToCart={onAddToCart}
        highlightBook={highlightBook}
        formatPrice={formatPrice}
      />

      <section className="contact" id="contact">
        <div className="contact__card">
          <h2>Зв’яжіться з нами</h2>
          <ul>
            <li>
              <span>Email</span>
              <a href={`mailto:${contacts.email}`}>{contacts.email}</a>
            </li>
            <li>
              <span>Instagram</span>
              <a href="https://instagram.com/solovyina_books" target="_blank" rel="noreferrer">
                {contacts.instagram}
              </a>
            </li>
            <li>
              <span>Телефон</span>
              <a href={`tel:${contacts.phone.replace(/[^+\d]/g, "")}`}>{contacts.phone}</a>
            </li>
          </ul>
        </div>
        <div className="contact__note">
          <p>
            Залюбки допоможемо підібрати книжку для подарунка, зібрати тематичну добірку або відповісти на будь-які
            питання щодо доставки й наявності.
          </p>
        </div>
      </section>
    </>
  );
}

export default Home;
