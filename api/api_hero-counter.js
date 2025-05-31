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
    id
  } = req.query;

  // Parâmetro obrigatório
  if (!id || isNaN(Number(id))) {
    return res.status(400).json({ error: "Missing or invalid 'id' (main_heroid) parameter. Exemplo: /api/hero-counter?id=127" });
  }

  try {
    const apiUrl = `https://mlbb-stats.ridwaanhall.com/api/hero-counter/${id}/`;
    const response = await fetch(apiUrl);

    if (!response.ok) {
      return res.status(response.status).json({ error: 'Erro ao buscar dados de counter', apiUrl });
    }

    const data = await response.json();

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: 'Erro no servidor proxy', details: error.message });
  }
}