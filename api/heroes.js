import heroNameToId from '../utils/heroNameToId.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const {
    source = 'rank',
    name,
    role,
    lane,
    days,
    rank = 'mythic',
    size = 20,
    index = 1,
    sort_field = 'win_rate',
    sort_order = 'desc'
  } = req.query;

  let apiUrl = '';

  try {
    switch (source) {
      case 'rank':
        apiUrl = `https://mlbb-stats.ridwaanhall.com/api/hero-rank/?days=${days || 7}&rank=${rank}&size=${size}&index=${index}&sort_field=${sort_field}&sort_order=${sort_order}`;
        break;
      case 'position': {
        const params = new URLSearchParams();
        if (role) params.append('role', role);
        if (lane) params.append('lane', lane);
        params.append('size', size);
        params.append('index', index);
        apiUrl = `https://mlbb-stats.ridwaanhall.com/api/hero-position/?${params.toString()}`;
        break;
      }
      case 'list':
        apiUrl = `https://mlbb-stats.ridwaanhall.com/api/hero-list/`;
        break;
      // Para endpoints que exigem id no path
      case 'detail':
      case 'detail-stats':
      case 'rate':
      case 'compatibility': {
        if (!name) return res.status(400).json({ error: `Parâmetro 'name' obrigatório para '${source}'` });
        const id = await heroNameToId(name);
        if (!id) return res.status(404).json({ error: "Herói não encontrado" });
        if (source === 'rate') {
          // Passa o parâmetro days se vier do frontend
          const daysParam = days ? `?past-days=${days}` : '';
          apiUrl = `https://mlbb-stats.ridwaanhall.com/api/hero-rate/${id}/${daysParam}`;
        } else {
          apiUrl = `https://mlbb-stats.ridwaanhall.com/api/hero-${source}/${id}/`;
        }
        break;
      }
      // Endpoints que realmente usam name (combo, counter, skin, equipment)
      case 'combo':
      case 'counter':
      case 'skin': {
        if (!name) return res.status(400).json({ error: `Parâmetro 'name' obrigatório para '${source}'` });
        apiUrl = `https://mlbb-stats.ridwaanhall.com/api/hero-${source}/?name=${encodeURIComponent(name)}`;
        break;
      }
      case 'equipment': {
        if (!name) return res.status(400).json({ error: `Parâmetro 'name' obrigatório para '${source}'` });
        // se a API oficial pedir id, adapte aqui conforme docs
        apiUrl = `https://mlbb-stats.ridwaanhall.com/api/hero-equip/?name=${encodeURIComponent(name)}`;
        break;
      }
      default:
        return res.status(400).json({ error: `Fonte inválida: '${source}'` });
    }

    const response = await fetch(apiUrl);
    if (!response.ok) {
      return res.status(response.status).json({ error: 'Erro ao buscar dados na API MLBB', apiUrl });
    }

    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: 'Erro no servidor proxy', details: error.message, apiUrl });
  }
}