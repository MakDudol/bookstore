const BASE_URL = "/api/books";

const parseJson = async (response) => {
  const text = await response.text();
  try {
    return JSON.parse(text);
  } catch (error) {
    return { error: text || "Invalid JSON response." };
  }
};

const buildErrorMessage = (data, fallbackMessage) => {
  if (data?.details) {
    return `${data.error || "Error"}: ${data.details}`;
  }
  return data?.error || fallbackMessage;
};

export async function fetchBooks() {
  const response = await fetch(BASE_URL);
  const data = await parseJson(response);

  if (!response.ok) {
    throw new Error(buildErrorMessage(data, "Не вдалося завантажити каталог."));
  }

  return Array.isArray(data.books) ? data.books : [];
}

export async function fetchBookById(id) {
  if (!id) {
    throw new Error("Не вказано ідентифікатор книжки.");
  }

  const response = await fetch(`${BASE_URL}/${encodeURIComponent(id)}`);
  const data = await parseJson(response);

  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    throw new Error(buildErrorMessage(data, "Не вдалося завантажити книжку."));
  }

  return data.book || null;
}
