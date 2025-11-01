import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import "./BookDetail.css";
import { formatGenres } from "../utils/books";

function BookDetail({ books, onAddToCart, formatPrice }) {
  const { bookId } = useParams();

  const book = useMemo(() => books.find((item) => item.id === bookId), [books, bookId]);
  const gallery = useMemo(() => {
    if (!book) return [];
    return book.gallery && book.gallery.length > 0 ? book.gallery : [book.coverUrl];
  }, [book]);

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    setCurrentIndex(0);
  }, [bookId]);

  if (!book) {
    return (
      <section className="book-detail book-detail--missing">
        <div className="book-detail__container">
          <p>На жаль, нам не вдалося знайти цю книжку.</p>
          <Link to="/" className="book-detail__back">
            ← Повернутися до каталогу
          </Link>
        </div>
      </section>
    );
  }

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? gallery.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === gallery.length - 1 ? 0 : prev + 1));
  };

  const genreText = formatGenres(book.genre);

  const detailRows = [
    { label: "Автор", value: book.author },
    { label: "Видавництво", value: book.publisher },
    { label: "Жанр", value: genreText },
    { label: "Мова", value: book.language },
    { label: "Рік видання", value: book.publicationYear },
    { label: "Сторінок", value: book.pages },
    { label: "Обкладинка", value: book.coverType },
  ].filter((item) => item.value);

  const extraFacts = [
    { label: "Категорія", value: book.category },
    { label: "Вага", value: book.weight },
    { label: "Розміри", value: book.dimensions },
    { label: "ISBN", value: book.isbn },
  ].filter((item) => item.value && item.value !== "—" && item.value !== "-");

  return (
    <section className="book-detail">
      <div className="book-detail__container">
        <Link to="/" className="book-detail__back">
          ← Назад до каталогу
        </Link>

        <div className="book-detail__grid">
          <div className="book-detail__gallery">
            <div className="book-detail__cover">
              <img src={gallery[currentIndex]} alt={`${book.title} — обкладинка`} />
              {gallery.length > 1 && (
                <>
                  <button
                    type="button"
                    className="book-detail__nav book-detail__nav--prev"
                    onClick={handlePrev}
                    aria-label="Попереднє фото"
                  >
                    <span aria-hidden="true">‹</span>
                  </button>
                  <button
                    type="button"
                    className="book-detail__nav book-detail__nav--next"
                    onClick={handleNext}
                    aria-label="Наступне фото"
                  >
                    <span aria-hidden="true">›</span>
                  </button>
                </>
              )}
            </div>

            {gallery.length > 1 && (
              <div className="book-detail__thumbs">
                {gallery.map((image, index) => (
                  <button
                    key={`${image}-${index}`}
                    type="button"
                    className={`book-detail__thumb${index === currentIndex ? " is-active" : ""}`}
                    onClick={() => setCurrentIndex(index)}
                    aria-label={`Переглянути фото ${index + 1}`}
                  >
                    <img src={image} alt={`${book.title} — фото ${index + 1}`} />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="book-detail__info">
            <h1>{book.title}</h1>

            <div className="book-detail__price-block">
              <span className="book-detail__price">{formatPrice(book.priceCad)}</span>
              <button
                type="button"
                className="book-detail__cta"
                onClick={() => onAddToCart(book.id)}
              >
                Додати до кошика
              </button>
            </div>

            <dl className="book-detail__meta">
              {detailRows.map((row) => (
                <div key={row.label} className="book-detail__meta-row">
                  <dt>{row.label}</dt>
                  <dd>{row.value}</dd>
                </div>
              ))}
            </dl>

            {book.tags && book.tags.length > 0 && (
              <div className="book-detail__tags">
                {book.tags.map((tag) => (
                  <span key={tag}>{tag}</span>
                ))}
              </div>
            )}
          </div>
        </div>

        <article className="book-detail__description">
          <h2>Про книжку</h2>
          <p>{book.longDescription}</p>

          {extraFacts.length > 0 && (
            <ul className="book-detail__facts">
              {extraFacts.map((item) => (
                <li key={item.label}>
                  <strong>{item.label}:</strong> {item.value}
                </li>
              ))}
            </ul>
          )}
        </article>
      </div>
    </section>
  );
}

export default BookDetail;

