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

  try {
    const apiUrl = 'https://mlbb-stats.ridwaanhall.com/api/hero-list/';
    const response = await fetch(apiUrl);
    if (!response.ok) {
      return res.status(response.status).json({ error: 'Erro ao buscar lista de heróis', apiUrl });
    }
    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: 'Erro no servidor proxy', details: error.message });
  }
}