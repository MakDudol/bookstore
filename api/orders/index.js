const CONTENT_TYPE = "application/json; charset=utf-8";

const getEnv = () => {
  const apiKey = process.env.AIRTABLE_API_KEY;
  const baseId = process.env.AIRTABLE_BASE_ID;
  const tableName = process.env.AIRTABLE_ORDERS_TABLE;

  return { apiKey, baseId, tableName };
};

const toText = (value) => String(value ?? "").trim();

const parseNumber = (value) => {
  if (typeof value === "number") {
    return Number.isFinite(value) ? value : null;
  }

  if (typeof value === "string") {
    const cleaned = value.replace(",", ".").trim();
    if (!cleaned) return null;
    const parsed = Number(cleaned);
    return Number.isFinite(parsed) ? parsed : null;
  }

  return null;
};

const formatPrice = (value) =>
  new Intl.NumberFormat("uk-UA", {
    style: "currency",
    currency: "CAD",
    minimumFractionDigits: 2,
  }).format(value);

const parseBody = (req) => {
  if (!req.body) return null;
  if (typeof req.body === "string") {
    try {
      return JSON.parse(req.body);
    } catch (error) {
      return null;
    }
  }
  return req.body;
};

const normalizeItems = (items) => {
  if (!Array.isArray(items)) return [];

  return items
    .map((item) => {
      const title = toText(item?.title);
      const quantity = Math.floor(Number(item?.quantity) || 0);
      const unitPrice = parseNumber(item?.unitPrice) ?? 0;
      const lineTotal = parseNumber(item?.lineTotal) ?? unitPrice * quantity;

      if (!title || quantity <= 0) return null;

      return {
        title,
        quantity,
        unitPrice,
        lineTotal,
      };
    })
    .filter(Boolean);
};

const buildOrderDetails = (items) =>
  items
    .map(
      (item) =>
        `${item.title} — ${item.quantity} шт × ${formatPrice(item.unitPrice)} = ${formatPrice(item.lineTotal)}`,
    )
    .join("\n");

const validateCustomer = (customer) => {
  const required = [
    ["name", "Customer Name"],
    ["email", "Customer Email"],
    ["phone", "Customer Phone"],
    ["address", "Address"],
    ["city", "City"],
    ["region", "State/Province"],
    ["country", "Country"],
    ["postal", "ZIP/Postal"],
  ];

  for (const [key, label] of required) {
    if (!toText(customer?.[key])) {
      return `Missing required field: ${label}`;
    }
  }

  return "";
};

export default async function handler(req, res) {
  res.setHeader("Content-Type", CONTENT_TYPE);
  res.setHeader("Cache-Control", "no-store");

  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const { apiKey, baseId, tableName } = getEnv();
  if (!apiKey || !baseId || !tableName) {
    res.status(500).json({ error: "Missing Airtable configuration." });
    return;
  }

  const body = parseBody(req);
  if (!body || typeof body !== "object") {
    res.status(400).json({ error: "Invalid request body." });
    return;
  }

  const customer = body.customer && typeof body.customer === "object" ? body.customer : {};
  const validationError = validateCustomer(customer);
  if (validationError) {
    res.status(400).json({ error: validationError });
    return;
  }

  const items = normalizeItems(body.items);
  if (!items.length) {
    res.status(400).json({ error: "Cart must not be empty." });
    return;
  }

  const total = parseNumber(body.total);
  if (total === null || total < 0) {
    res.status(400).json({ error: "Invalid total." });
    return;
  }

  const orderDetails = buildOrderDetails(items);

  const fields = {
    "Customer Name": toText(customer.name),
    "Customer Email": toText(customer.email),
    "Customer Phone": toText(customer.phone),
    Address: toText(customer.address),
    Apartment: toText(customer.apartment),
    City: toText(customer.city),
    "State/Province": toText(customer.region),
    Country: toText(customer.country),
    "ZIP/Postal": toText(customer.postal),
    "Order Details": orderDetails,
    "Order Status": "New",
    Total: total,
  };

  const table = encodeURIComponent(tableName);
  const url = `https://api.airtable.com/v0/${baseId}/${table}`;

  let response;
  try {
    response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        records: [{ fields }],
        typecast: true,
      }),
    });
  } catch (error) {
    res.status(502).json({ error: "Airtable request failed." });
    return;
  }

  let airtableData = null;
  try {
    airtableData = await response.json();
  } catch (error) {
    airtableData = null;
  }

  if (!response.ok) {
    res.status(response.status || 502).json({
      error: airtableData?.error?.message || airtableData?.error || "Airtable request failed.",
      details: airtableData,
    });
    return;
  }

  const orderId = airtableData?.records?.[0]?.id || null;
  res.status(201).json({ success: true, orderId });
}
