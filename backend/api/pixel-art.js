export default async function handler(req, res) {
  // ---- CORS (so GitHub Pages can call Vercel) ----
  const allowedOrigins = new Set([
  "https://angelina010.github.io",
  "http://127.0.0.1:5500",
  "http://localhost:5500",
  "http://127.0.0.1:3000",
  "http://localhost:3000",
]);

  const origin = req.headers.origin;

  if (allowedOrigins.has(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  } else {
    // optional: keep it locked down instead of "*"
    res.setHeader("Access-Control-Allow-Origin", "https://angelina010.github.io");
  }

  res.setHeader("Vary", "Origin");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");


  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { prompt, rows, cols } = req.body || {};

    if (!process.env.OPENAI_API_KEY) {
      return res.status(500).json({ error: "Missing OPENAI_API_KEY env var" });
    }

    if (!prompt || !rows || !cols) {
      return res.status(400).json({ error: "Missing prompt/rows/cols" });
    }

    const r = Math.max(1, Math.min(Number(rows), 100));
    const c = Math.max(1, Math.min(Number(cols), 100));

    // Force exact dimensions using const + minItems/maxItems
    const format = {
      type: "json_schema",
      name: "pixel_art",
      strict: true,
      schema: {
        type: "object",
        additionalProperties: false,
        required: ["rows", "cols", "pixels"],
        properties: {
          rows: { type: "integer", const: r },
          cols: { type: "integer", const: c },
          pixels: {
            type: "array",
            minItems: r,
            maxItems: r,
            items: {
              type: "array",
              minItems: c,
              maxItems: c,
              items: {
                type: "string",
                // "#RRGGBB" OR "" for transparent
                pattern: "^(#[0-9A-Fa-f]{6})?$"
              }
            }
          }
        }
      }
    };

const inputText = `
You are a pixel artist creating a small game sprite.

Goal: Make the subject clearly recognizable at low resolution.

Rules:
- No face/eyes unless the prompt explicitly asks for a face.
- Use a bold outline (darker shade) around the subject.
- Use a limited palette (max 10 colors + "" for transparent).
- Use simple shading (1 highlight + 1 shadow) instead of many similar colors.
- Center the subject with padding around it.
- Background must be transparent ("").

Canvas: EXACTLY ${r} rows by ${c} columns.
Each pixel is "#RRGGBB" or "" (transparent).

Subject: ${prompt}
`.trim();

    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || "gpt-4o-mini",
        input: inputText,
        text: { format }
      })
    });

    const rawText = await response.text();

    if (!response.ok) {
      // Forward OpenAI error details
      return res.status(500).send(rawText);
    }

    const json = JSON.parse(rawText);

    // Robust extractor for Responses API output
    function extractResponseJSON(resp) {
      if (typeof resp.output_text === "string" && resp.output_text.trim()) {
        return resp.output_text;
      }
      const output = resp.output;
      if (!Array.isArray(output)) return null;

      for (const item of output) {
        const content = item.content;
        if (!Array.isArray(content)) continue;

        for (const c of content) {
          if (c.type === "output_text" && typeof c.text === "string") return c.text;
          if (c.type === "output_json" && c.json != null) return JSON.stringify(c.json);
        }
      }
      return null;
    }

    const jsonText = extractResponseJSON(json);
    if (!jsonText) {
      return res.status(500).json({ error: "No JSON content returned from model." });
    }

    let parsed;
    try {
      parsed = JSON.parse(jsonText);
    } catch {
      return res.status(500).json({ error: "Model returned non-JSON output." });
    }

    // Final safety check
    if (
      parsed.rows !== r ||
      parsed.cols !== c ||
      !Array.isArray(parsed.pixels) ||
      parsed.pixels.length !== r ||
      parsed.pixels.some((rowArr) => !Array.isArray(rowArr) || rowArr.length !== c)
    ) {
      return res.status(500).json({ error: "Model returned invalid pixel dimensions." });
    }

    return res.status(200).json(parsed);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error." });
  }
}
