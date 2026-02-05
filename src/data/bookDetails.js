import baseBooks from "./books";

const BASE_DEFAULTS = {
  publisher: "Незалежні видавці",
  language: "Українська",
  publicationYear: null,
  pages: null,
  coverType: "М'яка",
  category: "-",
  longDescription: "",
  gallery: [],
};

const metadataById = {
  "King-horror-book": {
    publisher: "Клуб Сімейного Дозвілля",
    genre: "Горор, психологічний трилер",
    publicationYear: 2023,
    pages: 448,
    coverType: "Тверда",
    weight: "0.65 кг",
    dimensions: "15.5 × 23.0 см",
    isbn: "978-966-948-560-1",
    category: "Світові бестселери",
    longDescription:
      "Луїс Крід переїжджає до маленького містечка й дізнається про стародавнє кладовище. Коли трагедія торкається його родини, він робить вибір, який змінює все.",
    gallery: [
      'https://bookchef.ua/upload/resize_cache/iblock/2ec/390_390_1/2ecf7a0e502b3076c52caa5539fcbb5f.jpg',
      'https://placehold.co/600x900?text=King+2',
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
    longDescription:
      meta.longDescription && meta.longDescription.length > 0 ? meta.longDescription : book.description,
  };
});

export function getBookDetails(id) {
  return booksWithDetails.find((book) => book.id === id) ?? null;
}

export default booksWithDetails;
