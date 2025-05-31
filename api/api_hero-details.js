// /api/hero-details.js
// Proxy endpoint for MLBB API hero detail (by hero_id, 1-127)

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle pre-flight
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Accept both /api/hero-details?hero_id=127 and /api/hero-details/127
  let { hero_id } = req.query;
  if (!hero_id) {
    // Try to extract from path (/api/hero-details/127)
    const parts = req.url.split('/');
    const last = parts[parts.length - 1];
    if (/^\d+$/.test(last)) hero_id = last;
  }
  hero_id = parseInt(hero_id, 10);

  if (!hero_id || isNaN(hero_id) || hero_id < 1 || hero_id > 127) {
    return res.status(400).json({ error: "Missing or invalid hero_id parameter. Use /api/hero-details?hero_id=127 or /api/hero-details/127" });
  }

  try {
    const apiUrl = `https://mlbb-stats.ridwaanhall.com/api/hero-detail/${hero_id}/`;
    const response = await fetch(apiUrl);

    if (!response.ok) {
      return res.status(response.status).json({ error: 'Failed to fetch hero details', apiUrl });
    }

    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: 'Proxy error', details: error.message });
  }
}