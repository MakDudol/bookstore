export const effectivePriceCad = (book) =>
  typeof book?.discountPriceCad === "number" && book.discountPriceCad < book.priceCad
    ? book.discountPriceCad
    : book.priceCad;

export default effectivePriceCad;
