export default async function handler(req, res) {
  const url = 'https://mlbb-stats.ridwaanhall.com/api/hero-rank/?days=7&rank=mythic&size=10&index=2&sort_field=pick_rate&sort_order=asc';
  try {
    const response = await fetch(url);
    if (!response.ok) {
      return res.status(response.status).json({ error: 'Failed to fetch data from MLBB API' });
    }
    const data = await response.json();

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: 'Proxy server error', details: error.message });
  }
}
