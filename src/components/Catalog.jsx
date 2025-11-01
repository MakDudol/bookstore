import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import BookCard from "./BookCard";
import "./Catalog.css";

function Catalog({ books, onAddToCart, highlightBook, formatPrice }) {
  const [page, setPage] = useState(1);
  const ITEMS_PER_PAGE = 12;

  useEffect(() => {
    setPage(1);
  }, [books]);

  const baseItems = useMemo(() => [...books], [books]);

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

  const goTo = (p) => setPage(() => Math.min(Math.max(1, p), totalPages));

  if (baseItems.length === 0) {
    return (
      <section className="catalog">
        <p className="catalog__empty">Нічого не знайдено за цим запитом.</p>
      </section>
    );
  }

  return (
    <section className="catalog">
      <div className="catalog__grid">
        {pageItems.map((item) => {
          if (item?.type === "highlight") {
            const book = item.data;
            return (
              <article key={String(book.id) + "-highlight"} className="catalog__highlight">
                <Link to={`/book/${book.id}`} className="catalog__highlight-link">
                  <p className="catalog__highlight-label">Рекомендована книжка</p>
                  <h3>{book.title}</h3>
                  <p className="catalog__highlight-author">{book.author}</p>
                  <p className="catalog__highlight-price">{formatPrice(book.priceCad)}</p>
                </Link>
                <button type="button" onClick={() => onAddToCart(book.id)}>
                  Додати до кошика
                </button>
              </article>
            );
          }

          return <BookCard key={item.id} book={item} onAddToCart={onAddToCart} />;
        })}
      </div>

      {totalPages > 1 && (
        <nav className="catalog__pagination" aria-label="Пагінація каталогу">
          <button
            type="button"
            className="catalog__page-btn"
            onClick={() => goTo(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Попередня
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
            Наступна
          </button>
        </nav>
      )}
    </section>
  );
}

export default Catalog;
