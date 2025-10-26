import BookCard from './BookCard'
import './Catalog.css'

function Catalog({ books, onAddToCart, highlightBook, formatPrice }) {
  if (!books.length) {
    return (
      <section className="catalog">
        <p className="catalog__empty">Не знайдено книжок за вашим запитом.</p>
      </section>
    )
  }

  const baseItems = highlightBook
    ? books.filter((book) => book.id !== highlightBook.id)
    : [...books]

  const items = [...baseItems]
  if (highlightBook) {
    const insertionIndex = Math.min(3, baseItems.length)
    items.splice(insertionIndex, 0, { type: 'highlight', data: highlightBook })
  }

  return (
    <section className="catalog">
      <div className="catalog__grid">
        {items.map((item) => {
          if (item?.type === 'highlight') {
            const book = item.data
            return (
              <article key={`${book.id}-highlight`} className="catalog__highlight">
                <p className="catalog__highlight-label">Рекомендація дня</p>
                <h3>{book.title}</h3>
                <p className="catalog__highlight-author">{book.author}</p>
                <p className="catalog__highlight-price">{formatPrice(book.priceCad)}</p>
                <button type="button" onClick={() => onAddToCart(book.id)}>
                  Додати в кошик
                </button>
              </article>
            )
          }

          return <BookCard key={item.id} book={item} onAddToCart={onAddToCart} />
        })}
      </div>
    </section>
  )
}

export default Catalog
