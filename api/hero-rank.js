export default async function handler(req, res) {
  // Libera CORS para qualquer origem
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Trata requisição OPTIONS (pré-flight)
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const {
    days = 7,
    rank = 'mythic',
    size = 20,
    index = 1,
    sort_field = 'win_rate',
    sort_order = 'desc'
  } = req.query;

  try {
    const apiUrl = `https://mlbb-stats.ridwaanhall.com/api/hero-rank/?days=${days}&rank=${rank}&size=${size}&index=${index}&sort_field=${sort_field}&sort_order=${sort_order}`;
    const response = await fetch(apiUrl);
    if (!response.ok) {
      return res.status(response.status).json({ error: 'Erro ao buscar dados de ranking', apiUrl });
    }
    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: 'Erro no servidor proxy', details: error.message });
  }
}