// /api/hero-detail/[hero_id].js

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const { hero_id } = req.query;

  const id = parseInt(hero_id, 10);
  if (!id || isNaN(id) || id < 1 || id > 127) {
    return res.status(400).json({ error: "Invalid hero_id. Use an integer between 1 and 127." });
  }

  try {
    const apiUrl = `https://mlbb-stats.ridwaanhall.com/api/hero-detail/${id}/`;
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