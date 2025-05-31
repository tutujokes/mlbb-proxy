// /api/hero-detail-stats.js
// Proxy endpoint for MLBB API hero detail stats (main_heroid: 1-127)

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

  // Accept both /api/hero-detail-stats?main_heroid=127 and /api/hero-detail-stats/127
  let { main_heroid } = req.query;
  if (!main_heroid) {
    // Try to extract from path (/api/hero-detail-stats/127)
    const parts = req.url.split('/');
    const last = parts[parts.length - 1];
    if (/^\d+$/.test(last)) main_heroid = last;
  }
  main_heroid = parseInt(main_heroid, 10);

  if (!main_heroid || isNaN(main_heroid) || main_heroid < 1 || main_heroid > 127) {
    return res.status(400).json({ error: "Missing or invalid main_heroid parameter. Use /api/hero-detail-stats?main_heroid=127 or /api/hero-detail-stats/127" });
  }

  try {
    const apiUrl = `https://mlbb-stats.ridwaanhall.com/api/hero-detail-stats/${main_heroid}/`;
    const response = await fetch(apiUrl);

    if (!response.ok) {
      return res.status(response.status).json({ error: 'Failed to fetch hero detail stats', apiUrl });
    }

    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: 'Proxy error', details: error.message });
  }
}