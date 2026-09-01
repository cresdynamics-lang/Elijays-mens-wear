const { GoogleGenerativeAI } = require('@google/generative-ai');

const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-3.6-flash';

const SYSTEM_PROMPT = `
You are an expert fashion catalog assistant for ELIJAY'S Men's Wear, a premium menswear store.
You analyze a product photo and return structured JSON for the product catalog.

Requirements:
1. Identify the garment/footwear type from the image.
2. Suggest a clean, descriptive product NAME and SEO-friendly SLUG (lowercase, hyphens).
3. List the colors visible in the image (primary first). Also suggest up to 3 additional colors this item is typically available in.
4. Write a rich product DESCRIPTION that explicitly covers: (a) material/fabric visible or typical for this item, (b) WHY a man should choose it (fit/confidence/appeal), (c) occasions it suits (work, wedding, casual, etc.).

Writing style rules (MANDATORY):
- Use natural sentence case. NEVER write in ALL CAPS.
- Capitalize only the first letter of each sentence, proper nouns (brands/places), and the first letter of each list line.
- Keep names/titles in Title Case (e.g., "Navy Stripe Long Sleeve Shirt"), not uppercase.
5. Provide a QUALITY/CONFIDENCE/AFTA note: confidence when worn, durability expectations, and material quality.

The store catalogue uses these parent categories and allowed subcategories. Pick categoryType from a parent and set subcategory to the closest matching sub (or empty if none fit):
- Trousers (slug trousers): Khaki, Formal, Official, Chino
- Shirts (slug shirts): Polos, Cuban, Boss, Tommy Hilfiger, Lacoste
- Suits (slug suits): Two Piece, Three Piece
- Jackets (slug jackets): Jackets, Half Jackets, Blazers
- Sweaters (slug sweaters): Crew Neck, V-Neck, Cardigan
- Formal Wear (slug formal-wear): Official Shirts, Formal Trousers, Ties
- Casual Wear (slug casual-wear): T-Shirts, Sweatshirts, Linen
- Accessories (slug accessories): Belts & Ties, Caps & Hats

Return ONLY valid JSON with this EXACT shape:
{
  "name": "string",
  "slug": "string",
  "categoryType": "trousers | shirts | suits | jackets | sweaters | formal-wear | casual-wear | accessories",
  "subcategory": "string",
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
  const categoryType = String(raw.categoryType || raw.type || '').trim().toLowerCase() || 'casual-wear';
  const subcategory = String(raw.subcategory || raw.categorySubtype || '').trim();
  const colors = coerceArray(raw.colors || raw.color);
  const suggestedColors = coerceArray(raw.suggestedColors || raw.otherColors);
  return {
    name,
    slug,
    categoryType,
    subcategory,
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

const BLOG_SYSTEM_PROMPT = `
You are the SEO copywriter for ELIJAY'S Men's Wear, a premium menswear store in Nairobi, Kenya.
You write high-intent blog/journal articles that help the shop get found on Google for what men search.

Rules (MANDATORY):
1. Write in natural sentence case. NEVER ALL CAPS. Keep headings Title Case.
2. Plain paragraphs separated by blank lines. Use "## " as the ONLY heading marker (## Heading). No bullet lists: write flowing sentences only.
3. Naturally weave in the brand and keywords without forcing them.
4. Make the article useful for a real man's shopping decision (fit, fabric, occasion, care, styling) so it earns search visibility.
5. Total content: 400-650 words. Keep it skimmable: an intro, 3-5 sections, a closing line.
6. Title: a headline a man would click (under 70 chars). Slug: lowercase hyphens.
7. Category: one of Fashion Tips | Trends | Style Guide | Lifestyle | News.
8. excerpt: 1-2 punchy sentences that read well as a Google snippet (include the main keyword).
9. meta: "title" = SEO title (under 60 chars), "metaDescription" = under 160 chars, "keywords" = 5-8 comma-separated search phrases.
10. Only mention products/prices you are sure exist. Never invent phone numbers, links, or discounts.

Return ONLY valid JSON with this EXACT shape:
{
  "title": "string",
  "slug": "string",
  "excerpt": "string",
  "content": "string",
  "category": "Fashion Tips | Trends | Style Guide | Lifestyle | News",
  "authorName": "ELIJAY'S Men's Wear",
  "meta": {
    "title": "string",
    "metaDescription": "string",
    "keywords": "string"
  }
}
`;

const generateBlogArticle = async ({ topic, scenario = '', retries = 2 } = {}) => {
  if (!process.env.GEMINI_API_KEY) {
    const err = new Error('GEMINI_API_KEY is not configured on the server');
    err.code = 'GEMINI_NOT_CONFIGURED';
    throw err;
  }
  if (!topic || !String(topic).trim()) throw new Error('A topic is required for AI blog writing');

  const audience = `
The reader context for this article:
- Topic: ${String(topic).trim()}
${scenario ? `- Context/scenario: ${String(scenario).trim()}` : ''}
`;

  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: GEMINI_MODEL });

  let lastError;
  for (let attempt = 0; attempt <= retries; attempt += 1) {
    try {
      const result = await model.generateContent({
        contents: [{ role: 'user', parts: [{ text: BLOG_SYSTEM_PROMPT + audience }] }],
        generationConfig: {
          temperature: 0.7,
          topP: 0.95,
          maxOutputTokens: 2048,
        },
      });
      const text = result.response.text();
      if (!text || !text.includes('{')) {
        throw new Error('Gemini returned no blog content');
      }
      const parsed = parseJson(text);
      const title = String(parsed.title || '').trim();
      if (!title) throw new Error('Gemini returned a blog without a title');
      return {
        title,
        slug: String(parsed.slug || '').trim() || title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
        excerpt: String(parsed.excerpt || '').trim(),
        content: String(parsed.content || '').trim(),
        category: String(parsed.category || 'Fashion Tips').trim(),
        authorName: String(parsed.authorName || "ELIJAY'S Men's Wear").trim(),
        meta: {
          title: String(parsed.meta?.title || title).slice(0, 60),
          metaDescription: String(parsed.meta?.metaDescription || '').slice(0, 160),
          keywords: String(parsed.meta?.keywords || '').slice(0, 300),
        },
      };
    } catch (error) {
      lastError = error;
      if (attempt < retries) {
        await new Promise((resolve) => setTimeout(resolve, 600 * (attempt + 1)));
      }
    }
  }
  throw lastError;
};

module.exports = { analyzeProductImage, generateBlogArticle, GEMINI_MODEL };