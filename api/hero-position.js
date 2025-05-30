import heroNameToId from '../utils/heroNameToId.js';

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
    role,
    lane,
    size = 20,
    index = 1
  } = req.query;

  try {
    const params = new URLSearchParams();
    if (role) params.append('role', role);
    if (lane) params.append('lane', lane);
    params.append('size', size);
    params.append('index', index);

    const apiUrl = `https://mlbb-stats.ridwaanhall.com/api/hero-position/?${params}`;

    const response = await fetch(apiUrl);
    if (!response.ok) {
      return res.status(response.status).json({ error: 'Erro ao buscar dados de posição', apiUrl });
    }
    const data = await response.json();

    // Adiciona o id do herói a cada registro, baseado no nome
    if (data.data && Array.isArray(data.data.records)) {
      data.data.records = data.data.records.map(entry => {
        const heroData = entry?.data?.hero?.data;
        if (heroData) {
          heroData.id = heroNameToId(heroData.name);
        }
        return entry;
      });
    }

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: 'Erro no servidor proxy', details: error.message });
  }
}
