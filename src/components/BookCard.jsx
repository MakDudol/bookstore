import { Link } from "react-router-dom";
import "./BookCard.css";
import { formatGenres } from "../utils/books";

const priceFormatter = new Intl.NumberFormat("uk-UA", {
  style: "currency",
  currency: "CAD",
  minimumFractionDigits: 2,
});
const CTA_SHORT_LABEL = "Додати";

function BookCard({ book, onAddToCart }) {
  const genresText = formatGenres(book.genre);
  const hasDiscount =
    typeof book.discountPriceCad === "number" && book.discountPriceCad < book.priceCad;
  const formattedPrice = priceFormatter.format(book.priceCad);
  const formattedDiscount = hasDiscount ? priceFormatter.format(book.discountPriceCad) : null;
  const discountPercent = hasDiscount
    ? Math.max(0, Math.round((1 - book.discountPriceCad / book.priceCad) * 100))
    : 0;
  const showDiscountBadge = hasDiscount && discountPercent > 0;

  const handleAddClick = () => {
    onAddToCart(book.id);
  };

  return (
    <article className="book-card">
      <Link to={`/book/${book.id}`} className="book-card__link">
        <div className="book-card__image">
          <img
            src={book.coverUrl}
            alt={book.title}
            loading="lazy"
            srcSet={`${book.coverUrl} 1x`}
            sizes="(max-width: 540px) 45vw, (max-width: 1024px) 220px, 260px"
          />
        </div>
        <div className="book-card__body">
          <div className="book-card__tags">
            {book.tags.map((tag) => (
              <span key={tag}>{tag}</span>
            ))}
          </div>
          <h3>{book.title}</h3>
          <p className="book-card__author">{book.author}</p>
          {genresText && <p className="book-card__genre">{genresText}</p>}
          <p className="book-card__description">{book.description}</p>
        </div>
      </Link>
        <div className="book-card__footer">
        <div className="book-card__price">
          {hasDiscount ? (
            <>
              <span className="price price--old">{formattedPrice}</span>
              <span className="price price--new">{formattedDiscount}</span>
              {showDiscountBadge && <span className="price-badge">-{discountPercent}%</span>}
            </>
          ) : (
            <span className="price price--new">{formattedPrice}</span>
          )}
        </div>
        <button type="button" className="book-card__cta cart-button" onClick={handleAddClick}>
          <span className="book-card__cta-full">Додати до кошика</span>
          <span className="book-card__cta-short">{CTA_SHORT_LABEL}</span>
        </button>
      </div>
    </article>
  );
}

export default BookCard;




