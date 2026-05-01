import { useCallback, useEffect, useMemo, useState } from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import Header from "./components/Header";
import Cart from "./components/Cart";
import Footer from "./components/Footer";
import InfoModal from "./components/InfoModal";
import ScrollToTop from "./components/ScrollToTop";
import { loadCart, saveCart } from "./utils/storage";
import { pickRandom, shuffle } from "./utils/recommendation";
import { normalizeGenreList } from "./utils/books";
import { effectivePriceCad } from "./utils/pricing";
import { fetchBooks } from "./services/booksApi";
import Home from "./pages/Home";
import BookDetail from "./pages/BookDetail";
import Checkout from "./pages/Checkout";
import NotFound from "./pages/NotFound";
import "./App.css";
import "./styles/global.css";
const STORE_NAME = "Солов'їна";
const FOOTER_NOTE = "Усі права захищено.";
const PROMOTION_MODAL_TITLE = "Акції";
const PROMOTION_MODAL_BODY = `🎁 АКЦІЯ: БЕЗКОШТОВНА ДОСТАВКА!
Лише до 8 травня при замовленні книг на суму від $150 доставка у будь-який куточок Канади — безкоштовна!`;
const PROMOTION_MODAL_STORAGE_KEY = "promotion-modal-shown-2026-05-08";

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
  const navigate = useNavigate();
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedGenre, setSelectedGenre] = useState(null);
  const [cartItems, setCartItems] = useState(() => loadCart());
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [catalogPage, setCatalogPage] = useState(1);
  const [allBooks, setAllBooks] = useState([]);
  const [booksLoading, setBooksLoading] = useState(true);
  const [booksError, setBooksError] = useState("");
  const [isPromotionModalOpen, setIsPromotionModalOpen] = useState(false);

  useEffect(() => {
    saveCart(cartItems);
  }, [cartItems]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const hasSeenPromotionModal = window.sessionStorage.getItem(PROMOTION_MODAL_STORAGE_KEY);
    if (hasSeenPromotionModal) return;
    setIsPromotionModalOpen(true);
    window.sessionStorage.setItem(PROMOTION_MODAL_STORAGE_KEY, "1");
  }, []);

  useEffect(() => {
    let isActive = true;
    setBooksLoading(true);
    setBooksError("");

    fetchBooks()
      .then((data) => {
        if (!isActive) return;
        setAllBooks(data);
      })
      .catch((err) => {
        if (!isActive) return;
        setBooksError(err?.message || "Не вдалося завантажити каталог.");
      })
      .finally(() => {
        if (!isActive) return;
        setBooksLoading(false);
      });

    return () => {
      isActive = false;
    };
  }, []);

  const formatPrice = (value) => formatter.format(value);

  const resetFiltersToDefault = useCallback(() => {
    setSearchTerm("");
    setSelectedCategory(null);
    setSelectedGenre(null);
    setCatalogPage(1);
    navigate("/", { replace: false });
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
    }
  }, [navigate]);

  const rec = useMemo(() => pickRandom(allBooks), [allBooks]);

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

  const hasSearch = searchTerm.trim().length > 0;
  const hasFilters = Boolean(selectedCategory || selectedGenre || hasSearch);
  const isHomeRoute = location.pathname === "/";
  const shouldShowMasthead = isHomeRoute && !hasFilters && catalogPage === 1;

  const cartWithDetails = useMemo(
    () =>
      cartItems
        .map((item) => {
          const book = allBooks.find((b) => b.id === item.id);
          if (!book) {
            return null;
          }

          const unitPrice = effectivePriceCad(book);
          return {
            ...item,
            book,
            unitPrice,
            lineTotal: unitPrice * item.quantity,
          };
        })
        .filter(Boolean),
    [cartItems, allBooks],
  );

  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  const cartSubtotal = cartWithDetails.reduce((sum, item) => sum + item.lineTotal, 0);
  const cartTotal = cartSubtotal;

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
            ? { ...item, quantity: Math.max(0, item.quantity + delta) } : item,
        )
        .filter((item) => item.quantity > 0),
    );
  };

  const handleRemove = (bookId) => {
    setCartItems((prev) => prev.filter((item) => item.id !== bookId));
  };

  const handleCheckout = () => {
    setIsCartOpen(false);
    navigate("/checkout");
  };

  const handleClearCart = () => {
    setCartItems([]);
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
        onLogoClick={resetFiltersToDefault}
      />

      <main>
        <ScrollToTop />
        <Routes>
          <Route
          path="/"
          element={
            <Home
              contacts={CONTACTS}
              highlightBook={highlightBook}
              books={filteredBooks}
              onAddToCart={handleAddToCart}
              formatPrice={formatPrice}
              onLogoClick={resetFiltersToDefault}
              showMasthead={shouldShowMasthead}
              catalogPage={catalogPage}
              onCatalogPageChange={setCatalogPage}
              isLoading={booksLoading}
              error={booksError}
            />
          }
          />
          <Route
            path="/book/:bookId"
            element={
              <BookDetail
                onAddToCart={handleAddToCart}
                formatPrice={formatPrice}
                onSearchChange={setSearchTerm}
                onGenreSelect={setSelectedGenre}
              />
            }
          />
          <Route
            path="/checkout"
            element={
              <Checkout
                items={cartWithDetails}
                total={cartTotal}
                formatPrice={formatPrice}
                onUpdateQuantity={handleUpdateQuantity}
                onRemove={handleRemove}
                onClearCart={handleClearCart}
                contactEmail={CONTACTS.email}
              />
            }
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      <Footer storeName={STORE_NAME} note={FOOTER_NOTE} />

      {isPromotionModalOpen && (
        <InfoModal
          title={PROMOTION_MODAL_TITLE}
          body={PROMOTION_MODAL_BODY}
          onClose={() => setIsPromotionModalOpen(false)}
        />
      )}

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
    </div>
  );
}

export default App;




