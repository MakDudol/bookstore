import BookCard from './BookCard'
import './Catalog.css'

function Catalog({ books, onAddToCart }) {
  if (!books.length) {
    return (
      <section className="catalog">
        <p className="catalog__empty">Не знайдено книжок за вашим запитом.</p>
      </section>
    )
  }

  return (
    <section className="catalog">
      <div className="catalog__grid">
        {books.map((book) => (
          <BookCard key={book.id} book={book} onAddToCart={onAddToCart} />
        ))}
      </div>
    </section>
  )
}

export default Catalog
