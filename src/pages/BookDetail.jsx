import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import "./BookDetail.css";
import { normalizeGenreList } from "../utils/books";
import { fetchBookById } from "../services/booksApi";

const NOT_FOUND_TEXT = "На жаль, ми не знайшли таку книжку.";
const LOADING_TEXT = "Завантаження книжки…";
const ERROR_TEXT = "Не вдалося завантажити книжку.";
const BACK_TO_CATALOG = "← Повернутися до каталогу";
const CTA_LABEL = "Додати до кошика";
const DESCRIPTION_HEADING = "Про книжку";
const PREV_IMAGE = "Попереднє зображення";
const NEXT_IMAGE = "Наступне зображення";

function BookDetail({ onAddToCart, formatPrice, onSearchChange, onGenreSelect }) {
  const { bookId } = useParams();
  const navigate = useNavigate();

  const [book, setBook] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isActive = true;
    setIsLoading(true);
    setError("");

    fetchBookById(bookId)
      .then((data) => {
        if (!isActive) return;
        setBook(data);
      })
      .catch((err) => {
        if (!isActive) return;
        setError(err?.message || ERROR_TEXT);
      })
      .finally(() => {
        if (!isActive) return;
        setIsLoading(false);
      });

    return () => {
      isActive = false;
    };
  }, [bookId]);

  const gallery = useMemo(() => {
    if (!book) return [];
    if (book.gallery && book.gallery.length > 0) return book.gallery;
    return book.coverUrl ? [book.coverUrl] : [];
  }, [book]);

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    setCurrentIndex(0);
  }, [bookId]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    }
  }, [bookId]);

  if (isLoading) {
    return (
      <section className="book-detail book-detail--missing">
        <div className="book-detail__container">
          <p>{LOADING_TEXT}</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="book-detail book-detail--missing">
        <div className="book-detail__container">
          <p>{error || ERROR_TEXT}</p>
          <Link to="/" className="book-detail__back">
            {BACK_TO_CATALOG}
          </Link>
        </div>
      </section>
    );
  }

  if (!book) {
    return (
      <section className="book-detail book-detail--missing">
        <div className="book-detail__container">
          <p>{NOT_FOUND_TEXT}</p>
          <Link to="/" className="book-detail__back">
            {BACK_TO_CATALOG}
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

  const handleAuthorFilter = () => {
    if (!book.author) {
      return;
    }

    if (onSearchChange) {
      onSearchChange(book.author);
    }

    navigate("/");
  };

  const handleGenreFilter = (genre) => {
    if (!genre) {
      return;
    }

    if (onGenreSelect) {
      onGenreSelect(genre);
    }

    navigate("/");
  };

  const normalizedGenres = normalizeGenreList(book.genre);

  const detailRows = [
    { label: "Автор", value: book.author, type: "author" },
    { label: "Жанри", value: normalizedGenres, type: "genres" },
  ].filter((item) => {
    if (item.type === "genres") {
      return item.value.length > 0;
    }

    return item.value !== undefined && item.value !== null && item.value !== "";
  });

  const extraFacts = [{ label: "Категорія", value: book.category }].filter(
    (item) => item.value && item.value !== "-",
  );

  return (
    <section className="book-detail">
      <div className="book-detail__container">
        <Link to="/" className="book-detail__back">
          {BACK_TO_CATALOG}
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
                    aria-label={PREV_IMAGE}
                  >
                    <span aria-hidden="true">&lt;</span>
                  </button>
                  <button
                    type="button"
                    className="book-detail__nav book-detail__nav--next"
                    onClick={handleNext}
                    aria-label={NEXT_IMAGE}
                  >
                    <span aria-hidden="true">&gt;</span>
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
                    aria-label={`Переглянути зображення ${index + 1}`}
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
                className="book-detail__cta cart-button"
                onClick={() => onAddToCart(book.id)}
              >
                {CTA_LABEL}
              </button>
            </div>

            <dl className="book-detail__meta">
              {detailRows.map((row) => (
                <div key={row.label} className="book-detail__meta-row">
                  <dt>{row.label}</dt>
                  <dd>
                    {row.type === "author" ? (
                      <div className="book-detail__chips">
                        <button
                          type="button"
                          className="meta-chip meta-chip--author"
                          onClick={handleAuthorFilter}
                        >
                          {row.value}
                        </button>
                      </div>
                    ) : row.type === "genres" ? (
                      <div className="book-detail__chips">
                        {row.value.map((genre, index) => (
                          <button
                            key={`${genre}-${index}`}
                            type="button"
                            className="meta-chip meta-chip--genre"
                            onClick={() => handleGenreFilter(genre)}
                          >
                            {genre}
                          </button>
                        ))}
                      </div>
                    ) : (
                      row.value
                    )}
                  </dd>
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
          <h2>{DESCRIPTION_HEADING}</h2>
          <p>{book.description || book.longDescription}</p>

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
