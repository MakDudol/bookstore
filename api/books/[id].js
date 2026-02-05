const CACHE_CONTROL = "s-maxage=60, stale-while-revalidate=300";
const CONTENT_TYPE = "application/json; charset=utf-8";

const getEnv = () => {
  const apiKey = process.env.AIRTABLE_API_KEY;
  const baseId = process.env.AIRTABLE_BASE_ID;
  const tableName = process.env.AIRTABLE_TABLE_NAME || "Books";
  const viewName = process.env.AIRTABLE_VIEW_NAME || "✅ Published";

  return { apiKey, baseId, tableName, viewName };
};

const parseNumber = (value) => {
  if (typeof value === "number") return value;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
};

const parseTags = (value) => {
  if (typeof value !== "string") return [];
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
};

const mapRecord = (record) => {
  const fields = record.fields || {};
  const coverAttachment = Array.isArray(fields["Cover Image"]) ? fields["Cover Image"][0] : null;
  const coverUrl = coverAttachment?.url || null;
  const gallery = Array.isArray(fields["Gallery Images"])
    ? fields["Gallery Images"].map((item) => item?.url).filter(Boolean)
    : [];

  return {
    id: fields.ID || record.id,
    title: fields.Title || "",
    author: fields.Author || "",
    priceCad: parseNumber(fields.Price) ?? 0,
    discountPriceCad: parseNumber(fields["Discount Price"]),
    description: fields.Description || "",
    category: fields.Category || "",
    genre: Array.isArray(fields.Genre) ? fields.Genre : [],
    tags: parseTags(fields.Tags),
    stock: parseNumber(fields["Stock Level"]),
    coverUrl,
    gallery,
  };
};

export default async function handler(req, res) {
  res.setHeader("Content-Type", CONTENT_TYPE);
  res.setHeader("Cache-Control", CACHE_CONTROL);

  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const { apiKey, baseId, tableName, viewName } = getEnv();
  const { id } = req.query || {};

  if (!apiKey || !baseId) {
    res.status(500).json({ error: "Missing Airtable configuration." });
    return;
  }

  if (!id) {
    res.status(404).json({ error: "Not found" });
    return;
  }

  const table = encodeURIComponent(tableName);
  const baseUrl = `https://api.airtable.com/v0/${baseId}/${table}`;
  const safeId = String(id).replace(/"/g, '\\"');
  const formula = `{ID}="${safeId}"`;
  const params = new URLSearchParams();
  params.set("view", viewName);
  params.set("filterByFormula", formula);

  const response = await fetch(`${baseUrl}?${params.toString()}`, {
    headers: {
      Authorization: `Bearer ${apiKey}`,
    },
  });

  if (!response.ok) {
    const text = await response.text();
    res.status(response.status).json({
      error: "Airtable request failed.",
      details: text,
    });
    return;
  }

  const data = await response.json();
  const record = Array.isArray(data.records) ? data.records[0] : null;

  if (!record) {
    res.status(404).json({ error: "Not found" });
    return;
  }

  const book = mapRecord(record);
  if ((!book.gallery || book.gallery.length === 0) && book.coverUrl) {
    book.gallery = [book.coverUrl];
  }

  res.status(200).json({ book });
}
