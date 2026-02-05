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

const fetchAllRecords = async ({ apiKey, baseId, tableName, viewName }) => {
  const records = [];
  let offset;

  const table = encodeURIComponent(tableName);
  const baseUrl = `https://api.airtable.com/v0/${baseId}/${table}`;

  do {
    const params = new URLSearchParams();
    params.set("view", viewName);
    if (offset) params.set("offset", offset);

    const response = await fetch(`${baseUrl}?${params.toString()}`, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
    });

    if (!response.ok) {
      const text = await response.text();
      return { error: text, status: response.status };
    }

    const data = await response.json();
    records.push(...(data.records || []));
    offset = data.offset;
  } while (offset);

  return { records };
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

  if (!apiKey || !baseId) {
    res.status(500).json({ error: "Missing Airtable configuration." });
    return;
  }

  const listResult = await fetchAllRecords({ apiKey, baseId, tableName, viewName });

  if (listResult.error) {
    res.status(listResult.status || 500).json({
      error: "Airtable request failed.",
      details: listResult.error,
    });
    return;
  }

  const books = listResult.records.map(mapRecord);
  res.status(200).json({ books });
}
