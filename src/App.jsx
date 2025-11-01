import { useEffect, useMemo, useState } from "react";
import { Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Cart from "./components/Cart";
import CheckoutModal from "./components/CheckoutModal";
import books from "./data/bookDetails";
import { loadCart, saveCart } from "./utils/storage";
import { pickRandom, shuffle } from "./utils/recommendation";
import { normalizeGenreList } from "./utils/books";
import Home from "./pages/Home";
import BookDetail from "./pages/BookDetail";
import NotFound from "./pages/NotFound";
import "./App.css";

const STORE_NAME = "D�D_D�D_D�'�-D�D�";

const CONTACTS = {
  email: "solovyinaca@gmail.com",
  instagram: "@ukrbook_montreal",
  phone: "+1 438 535 0213",
};

const formatter = new Intl.NumberFormat("uk-UA", {
  style: "currency",
  currency: "CAD",
  minimumFractionDigits: 2,
});

function App() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedGenre, setSelectedGenre] = useState(null);
  const [cartItems, setCartItems] = useState(() => loadCart());
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [checkoutSummary, setCheckoutSummary] = useState(null);

  const allBooks = books;

  useEffect(() => {
    saveCart(cartItems);
  }, [cartItems]);

  const formatPrice = (value) => formatter.format(value);

  const [rec] = useState(() => pickRandom(allBooks));

  const sourceBooks = useMemo(() => shuffle(allBooks), [allBooks]);

  const filteredBooks = useMemo(() => {
    const normalized = searchTerm.trim().toLowerCase();

    return sourceBooks.filter((book) => {
      const haystack = `${book.title} ${book.author}`.toLowerCase();
      const matchesSearch = !normalized || haystack.includes(normalized);
      const matchesCategory = !selectedCategory || book.category === selectedCategory;
      const bookGenres = normalizeGenreList(book.genre);
      const matchesGenre = !selectedGenre || bookGenres.includes(selectedGenre);
      return matchesSearch && matchesCategory && matchesGenre;
    });
  }, [searchTerm, sourceBooks, selectedCategory, selectedGenre]);

  const highlightBook = useMemo(() => {
    if (searchTerm.trim() || selectedCategory || selectedGenre) {
      return null;
    }
    return rec;
  }, [searchTerm, selectedCategory, selectedGenre, rec]);

  const cartWithDetails = useMemo(
    () =>
      cartItems
        .map((item) => {
          const book = allBooks.find((b) => b.id === item.id);
          if (!book) {
            return null;
          }

          return {
            ...item,
            book,
          };
        })
        .filter(Boolean),
    [cartItems, allBooks],
  );

  const cartTotal = cartWithDetails.reduce(
    (total, item) => total + item.book.priceCad * item.quantity,
    0,
  );

  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  const handleAddToCart = (bookId) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.id === bookId);
      if (existing) {
        return prev.map((item) =>
          item.id === bookId ? { ...item, quantity: item.quantity + 1 } : item,
        );
      }

      return [...prev, { id: bookId, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const handleUpdateQuantity = (bookId, delta) => {
    setCartItems((prev) =>
      prev
        .map((item) =>
          item.id === bookId
            ? { ...item, quantity: Math.max(0, item.quantity + delta) }
            : item,
        )
        .filter((item) => item.quantity > 0),
    );
  };

  const handleRemove = (bookId) => {
    setCartItems((prev) => prev.filter((item) => item.id !== bookId));
  };

  const handleCheckout = () => {
    setIsCheckoutOpen(true);
    setIsCartOpen(false);
  };

  const handleCheckoutSubmit = (data) => {
    const itemsForSummary = cartWithDetails.map((item) => ({
      id: item.id,
      title: item.book.title,
      priceCad: item.book.priceCad,
      quantity: item.quantity,
    }));

    setCheckoutSummary({
      ...data,
      items: itemsForSummary,
      total: cartTotal,
    });
  };

  const handleCloseCheckout = () => {
    setIsCheckoutOpen(false);
    setCheckoutSummary(null);
  };

  return (
    <div className="app" id="top">
      <Header
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onCartToggle={() => setIsCartOpen((prev) => !prev)}
        cartCount={cartCount}
        contactPhone={CONTACTS.phone}
        selectedCategory={selectedCategory}
        onCategorySelect={setSelectedCategory}
        selectedGenre={selectedGenre}
        onGenreSelect={setSelectedGenre}
      />

      <main>
        <Routes>
          <Route
            path="/"
            element={
              <Home
                storeName={STORE_NAME}
                contacts={CONTACTS}
                highlightBook={highlightBook}
                books={filteredBooks}
                onAddToCart={handleAddToCart}
                formatPrice={formatPrice}
              />
            }
          />
          <Route
            path="/book/:bookId"
            element={
              <BookDetail
                books={allBooks}
                onAddToCart={handleAddToCart}
                formatPrice={formatPrice}
              />
            }
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      <footer className="footer">
        <p>Ac {new Date().getFullYear()} {STORE_NAME}. D��?�- D��?D�D�D� D�D��.D,�%D�D�D_.</p>
      </footer>

      <Cart
        isOpen={isCartOpen}
        items={cartWithDetails}
        onUpdateQuantity={handleUpdateQuantity}
        onRemove={handleRemove}
        onClose={() => setIsCartOpen(false)}
        onCheckout={handleCheckout}
        total={cartTotal}
        formatPrice={formatPrice}
      />

      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={handleCloseCheckout}
        onSubmit={handleCheckoutSubmit}
        summary={checkoutSummary}
        formatPrice={formatPrice}
        contacts={CONTACTS}
      />
    </div>
  );
}

export default App;
