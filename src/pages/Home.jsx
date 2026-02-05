import Catalog from "../components/Catalog";
import Masthead from "../components/Masthead";

const CONTACT_TITLE = "Зв'яжіться з нами";
const NOTE_TEXT = "Обирайте книжки, а ми проконсультуємо вас і подбаємо про швидку доставку.";

function Home({
  contacts,
  highlightBook,
  books,
  onAddToCart,
  formatPrice,
  onLogoClick,
  showMasthead = true,
  catalogPage,
  onCatalogPageChange,
  isLoading,
  error,
}) {
  return (
    <>
      {showMasthead && <Masthead onLogoClick={onLogoClick} />}
      <Catalog
        books={books}
        onAddToCart={onAddToCart}
        highlightBook={highlightBook}
        formatPrice={formatPrice}
        page={catalogPage}
        onPageChange={onCatalogPageChange}
        isLoading={isLoading}
        error={error}
      />

      <section className="contact" id="contact">
        <div className="contact__card">
          <h2>{CONTACT_TITLE}</h2>
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
          <p>{NOTE_TEXT}</p>
        </div>
      </section>
    </>
  );
}

export default Home;
