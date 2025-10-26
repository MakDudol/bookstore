import './BookCard.css'

const priceFormatter = new Intl.NumberFormat('uk-UA', {
  style: 'currency',
  currency: 'CAD',
  minimumFractionDigits: 2,
})

function BookCard({ book, onAddToCart }) {
  const handleAddClick = () => {
    onAddToCart(book.id)
  }

  return (
    <article className="book-card">
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
        <p className="book-card__genre">{book.genre}</p>
        <p className="book-card__description">{book.description}</p>
      </div>
      <div className="book-card__footer">
        <span className="book-card__price">{priceFormatter.format(book.priceCad)}</span>
        <button type="button" onClick={handleAddClick}>
          Додати в кошик
        </button>
      </div>
    </article>
  )
}

export default BookCard
