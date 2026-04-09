const BASE_URL = "/api/orders";

const parseJson = async (response) => {
  const text = await response.text();
  try {
    return JSON.parse(text);
  } catch (error) {
    return { error: text || "Invalid JSON response." };
  }
};

const buildErrorMessage = (data, fallbackMessage) => {
  return data?.error || fallbackMessage;
};

export async function submitOrder(payload) {
  const response = await fetch(BASE_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await parseJson(response);

  if (!response.ok) {
    throw new Error(buildErrorMessage(data, "Не вдалося відправити замовлення."));
  }

  return data;
}
