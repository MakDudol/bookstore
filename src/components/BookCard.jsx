import { Link } from "react-router-dom";
import "./BookCard.css";
import { formatGenres } from "../utils/books";

const priceFormatter = new Intl.NumberFormat("uk-UA", {
  style: "currency",
  currency: "CAD",
  minimumFractionDigits: 2,
});

function BookCard({ book, onAddToCart }) {
  const genresText = formatGenres(book.genre);

  const handleAddClick = () => {
    onAddToCart(book.id);
  };

  return (
    <article className="book-card">
      <Link to={`/book/${book.id}`} className="book-card__link">
        <div className="book-card__image">
          <img src={book.coverUrl} alt={book.title} loading="lazy" />
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
        <span className="book-card__price">{priceFormatter.format(book.priceCad)}</span>
        <button type="button" onClick={handleAddClick}>
          Додати до кошика
        </button>
      </div>
    </article>
  );
}

export default BookCard;


