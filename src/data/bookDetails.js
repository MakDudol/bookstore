import baseBooks from "./books";

const BASE_DEFAULTS = {
  publisher: "Невідоме видавництво",
  language: "Українська",
  publicationYear: null,
  pages: null,
  coverType: "Тверда",
  category: "—",
  longDescription: "",
  gallery: [],
};

const metadataById = {
  "King-horror": {
    publisher: "Видавництво Старого Лева",
    genre: "Жахи, темне фентезі",
    publicationYear: 2023,
    pages: 496,
    coverType: "Тверда",
    weight: "0.55 кг",
    dimensions: "15.5 × 23.2 см",
    isbn: "978-966-448-344-2",
    category: "Книжки для дорослих",
    longDescription:
      "Епічна історія протистояння зі стародавнім злом. Роман написаний у найкращих традиціях моторошних саг і подарує безліч мурах по шкірі на кожній сторінці.",
    gallery: [
      "https://bookchef.ua/upload/resize_cache/iblock/2ec/390_390_1/2ecf7a0e502b3076c52caa5539fcbb5f.jpg",
      "https://i.imgur.com/0joQnQp.jpeg",
      "https://i.imgur.com/ni5oDLf.jpeg",
      "https://i.imgur.com/psX2vqw.jpeg",
    ],
  },
};

export const booksWithDetails = baseBooks.map((book) => {
  const meta = metadataById[book.id] ?? {};
  const merged = {
    ...BASE_DEFAULTS,
    ...book,
    ...meta,
  };

  const gallery = meta.gallery && meta.gallery.length ? meta.gallery : [book.coverUrl];

  return {
    ...merged,
    gallery: gallery.map((url) => url || book.coverUrl),
    longDescription: meta.longDescription && meta.longDescription.length > 0 ? meta.longDescription : book.description,
  };
});

export function getBookDetails(id) {
  return booksWithDetails.find((book) => book.id === id) ?? null;
}

export default booksWithDetails;
