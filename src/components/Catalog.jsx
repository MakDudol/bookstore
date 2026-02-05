import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { fetchBooks } from "../services/booksApi";
import BookCard from "./BookCard";
import "./Catalog.css";

const EMPTY_TEXT = "Книжок за вашим запитом поки немає.";
const LOADING_TEXT = "Завантаження каталогу…";
const ERROR_TEXT = "Не вдалося завантажити каталог.";
const HIGHLIGHT_LABEL = "Рекомендована книжка";
const PAGINATION_ARIA = "Навігація сторінками каталогу";
const PREV_LABEL = "Попередня";
const NEXT_LABEL = "Наступна";
const CTA_LABEL = "Додати до кошика";

function Catalog({
  books,
  onAddToCart,
  highlightBook,
  formatPrice,
  page: pageProp,
  onPageChange,
  isLoading,
  error,
}) {
  const [pageState, setPageState] = useState(1);
  const [localBooks, setLocalBooks] = useState([]);
  const [localLoading, setLocalLoading] = useState(false);
  const [localError, setLocalError] = useState("");
  const topRef = useRef(null);
  const ITEMS_PER_PAGE = 12;
  const isControlled = Number.isFinite(pageProp) && typeof onPageChange === "function";
  const page = isControlled ? pageProp : pageState;
  const setPage = isControlled ? onPageChange : setPageState;

  useEffect(() => {
    let isActive = true;

    if (Array.isArray(books)) {
      setLocalBooks(books);
      setLocalLoading(false);
      setLocalError("");
      return () => {
        isActive = false;
      };
    }

    setLocalLoading(true);
    setLocalError("");

    fetchBooks()
      .then((data) => {
        if (!isActive) return;
        setLocalBooks(data);
      })
      .catch((err) => {
        if (!isActive) return;
        setLocalError(err?.message || ERROR_TEXT);
      })
      .finally(() => {
        if (!isActive) return;
        setLocalLoading(false);
      });

    return () => {
      isActive = false;
    };
  }, [books]);

  const resolvedBooks = Array.isArray(books) ? books : localBooks;
  const resolvedLoading = typeof isLoading === "boolean" ? isLoading : localLoading;
  const resolvedError = error || localError;

  useEffect(() => {
    setPage(1);
  }, [resolvedBooks, setPage]);

  useEffect(() => {
    if (!topRef.current) {
      return;
    }

    if (typeof window === "undefined") {
      topRef.current.scrollIntoView({ behavior: "auto", block: "start" });
      return;
    }

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const frame = window.requestAnimationFrame(() => {
      topRef.current.scrollIntoView({
        behavior: prefersReducedMotion ? "auto" : "smooth",
        block: "start",
      });
    });

    return () => window.cancelAnimationFrame(frame);
  }, [page]);

  const baseItems = useMemo(() => [...resolvedBooks], [resolvedBooks]);

  const items = useMemo(() => {
    const list = [...baseItems];
    if (highlightBook && page === 1) {
      const insertionIndex = Math.min(3, baseItems.length);
      list.splice(insertionIndex, 0, { type: "highlight", data: highlightBook });
    }
    return list;
  }, [baseItems, highlightBook, page]);

  const totalPages = Math.max(1, Math.ceil(items.length / ITEMS_PER_PAGE));
  const currentPage = Math.min(page, totalPages);
  const start = (currentPage - 1) * ITEMS_PER_PAGE;
  const end = start + ITEMS_PER_PAGE;
  const pageItems = items.slice(start, end);

  const goTo = (p) => {
    const nextPage = Math.min(Math.max(1, p), totalPages);
    setPage(nextPage);
  };

  if (resolvedLoading) {
    return (
      <section className="catalog" ref={topRef}>
        <p className="catalog__empty">{LOADING_TEXT}</p>
      </section>
    );
  }

  if (resolvedError) {
    return (
      <section className="catalog" ref={topRef}>
        <p className="catalog__empty">{resolvedError || ERROR_TEXT}</p>
      </section>
    );
  }

  if (baseItems.length === 0) {
    return (
      <section className="catalog" ref={topRef}>
        <p className="catalog__empty">{EMPTY_TEXT}</p>
      </section>
    );
  }

  return (
    <section className="catalog" ref={topRef}>
      <div className="catalog__grid">
        {pageItems.map((item) => {
          if (item?.type === "highlight") {
            const book = item.data;
            return (
              <article key={`${book.id}-highlight`} className="catalog__highlight">
                <Link to={`/book/${book.id}`} className="catalog__highlight-link">
                  <p className="catalog__highlight-label">{HIGHLIGHT_LABEL}</p>
                  <h3>{book.title}</h3>
                  <p className="catalog__highlight-author">{book.author}</p>
                  <p className="catalog__highlight-price">{formatPrice(book.priceCad)}</p>
                </Link>
                <button
                  type="button"
                  className="cart-button catalog__highlight-cta"
                  onClick={() => onAddToCart(book.id)}
                >
                  {CTA_LABEL}
                </button>
              </article>
            );
          }

          return <BookCard key={item.id} book={item} onAddToCart={onAddToCart} />;
        })}
      </div>

      {totalPages > 1 && (
        <nav className="catalog__pagination" aria-label={PAGINATION_ARIA}>
          <button
            type="button"
            className="catalog__page-btn"
            onClick={() => goTo(currentPage - 1)}
            disabled={currentPage === 1}
          >
            {PREV_LABEL}
          </button>

          <div className="catalog__page-list">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                type="button"
                className={p === currentPage ? "catalog__page-num is-active" : "catalog__page-num"}
                onClick={() => goTo(p)}
              >
                {p}
              </button>
            ))}
          </div>

          <button
            type="button"
            className="catalog__page-btn"
            onClick={() => goTo(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            {NEXT_LABEL}
          </button>
        </nav>
      )}
    </section>
  );
}

export default Catalog;



