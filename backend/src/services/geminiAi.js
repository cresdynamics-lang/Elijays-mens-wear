const { GoogleGenerativeAI } = require('@google/generative-ai');

const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-3.6-flash';

const SYSTEM_PROMPT = `
You are an expert fashion catalog assistant for ELIJAY'S Men's Wear, a premium menswear store.
You analyze a product photo and return structured JSON for the product catalog.

Requirements:
1. Identify the garment/footwear type (cloth/shirt, trouser, suit, shoe, etc.) from the image.
2. Suggest a clean, descriptive product NAME and SEO-friendly SLUG (lowercase, hyphens).
3. List the colors visible in the image (primary first). Also suggest up to 3 additional colors this item is typically available in.
4. Write a rich product DESCRIPTION that explicitly covers: (a) material/fabric visible or typical for this item, (b) WHY a man should choose it (fit/confidence/appeal), (c) occasions it suits (work, wedding, casual, etc.).
5. Provide a QUALITY/CONFIDENCE/AFTA note: confidence when worn, durability expectations, and material quality.

Return ONLY valid JSON with this EXACT shape:
{
  "name": "string",
  "slug": "string",
  "categoryType": "cloth | shoe | suit | trouser | belt | watch | accessory",
  "colors": ["string"],
  "suggestedColors": ["string"],
  "material": "string",
  "occasions": ["string"],
  "highlights": ["string"],
  "description": "string",
  "qualityNotes": "string",
  "confidenceNotes": "string",
  "durabilityNotes": "string"
}
Keep every description concrete and tied to what is visible in the photo. Do not invent brand or price.
`;

const parseJson = (raw) => {
  let text = String(raw || '').trim();
  const fenceMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (fenceMatch) text = fenceMatch[1].trim();
  const start = text.indexOf('{');
  const end = text.lastIndexOf('}');
  if (start >= 0 && end > start) text = text.slice(start, end + 1);
  const parsed = JSON.parse(text);
  if (!parsed || typeof parsed !== 'object') throw new Error('Gemini returned empty JSON');
  return parsed;
};

const coerceArray = (value) => {
  if (!value) return [];
  if (Array.isArray(value)) return value.filter(Boolean).map(String);
  return [String(value)];
};

const normalize = (data) => {
  const raw = data || {};
  const name = String(raw.name || raw.productName || '').trim();
  const slug = String(raw.slug || '').trim() || name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
  const categoryType = String(raw.categoryType || raw.type || '').trim().toLowerCase() || 'cloth';
  const colors = coerceArray(raw.colors || raw.color);
  const suggestedColors = coerceArray(raw.suggestedColors || raw.otherColors);
  return {
    name,
    slug,
    categoryType,
    colors,
    suggestedColors,
    material: String(raw.material || '').trim(),
    occasions: coerceArray(raw.occasions || raw.occasion),
    highlights: coerceArray(raw.highlights || raw.details),
    description: String(raw.description || '').trim(),
    qualityNotes: String(raw.qualityNotes || raw.quality || '').trim(),
    confidenceNotes: String(raw.confidenceNotes || raw.confidence || '').trim(),
    durabilityNotes: String(raw.durabilityNotes || raw.durability || '').trim(),
  };
};

const analyzeProductImage = async (imageBase64, { mimeType = 'image/jpeg', retries = 2 } = {}) => {
  if (!process.env.GEMINI_API_KEY) {
    const err = new Error('GEMINI_API_KEY is not configured on the server');
    err.code = 'GEMINI_NOT_CONFIGURED';
    throw err;
  }
  if (!imageBase64) throw new Error('No image data provided for AI analysis');

  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: GEMINI_MODEL });

  let lastError;
  for (let attempt = 0; attempt <= retries; attempt += 1) {
    try {
      const result = await model.generateContent({
        contents: [
          {
            role: 'user',
            parts: [
              { text: SYSTEM_PROMPT },
              { inlineData: { mimeType, data: imageBase64 } },
            ],
          },
        ],
        generationConfig: {
          temperature: 0.4,
          topP: 0.95,
          responseMimeType: 'application/json',
        },
      });
      const text = result.response.text();
      if (!text || !text.includes('{')) {
        // Model may have refused to return JSON with mimeType; retry without it
        if (attempt < retries) {
          const retryResult = await model.generateContent({
            contents: [
              {
                role: 'user',
                parts: [
                  { text: SYSTEM_PROMPT },
                  { inlineData: { mimeType, data: imageBase64 } },
                ],
              },
            ],
            generationConfig: { temperature: 0.4, topP: 0.95 },
          });
          return normalize(parseJson(retryResult.response.text()));
        }
      }
      return normalize(parseJson(text));
    } catch (error) {
      lastError = error;
      if (attempt < retries) {
        // Small backoff before retrying transient failures
        await new Promise((resolve) => setTimeout(resolve, 600 * (attempt + 1)));
      }
    }
  }
  throw lastError;
};

module.exports = { analyzeProductImage, GEMINI_MODEL };