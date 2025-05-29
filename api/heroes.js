
import heroNameToId from '../utils/heroNameToId.js';

export default async function handler(req, res) {
  const {
    source = 'rank',
    id,
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

  let finalId = id;

  if (!finalId && name) {
    try {
      finalId = heroNameToId(name);
      if (!finalId) {
        return res.status(404).json({ error: 'Herói não encontrado pelo nome informado.' });
      }
    } catch (err) {
      return res.status(500).json({ error: 'Erro ao converter nome para ID.', details: err.message });
    }
  }

  let apiUrl = '';

  try {
    switch (source) {
      case 'rank':
        apiUrl = `https://mlbb-stats.ridwaanhall.com/api/hero-rank/?days=${days || 7}&rank=${rank}&size=${size}&index=${index}&sort_field=${sort_field}&sort_order=${sort_order}`;
        break;

      case 'position':
        const params = new URLSearchParams();
        if (role) params.append('role', role);
        if (lane) params.append('lane', lane);
        params.append('size', size);
        params.append('index', index);
        apiUrl = `https://mlbb-stats.ridwaanhall.com/api/hero-position/?${params}`;
        break;

      case 'detail':
        if (!finalId) return res.status(400).json({ error: "Missing hero ID or name" });
        apiUrl = `https://mlbb-stats.ridwaanhall.com/api/hero-detail/${finalId}`;
        break;

      case 'detail-stats':
        if (!finalId) return res.status(400).json({ error: "Missing hero ID or name" });
        apiUrl = `https://mlbb-stats.ridwaanhall.com/api/hero-detail-stats/${finalId}`;
        break;

      case 'rate':
        if (!finalId) return res.status(400).json({ error: "Missing hero ID or name" });
        apiUrl = `https://mlbb-stats.ridwaanhall.com/api/hero-rate/${finalId}/?past-days=${days || 7}`;
        break;

      case 'compatibility':
        if (!finalId) return res.status(400).json({ error: "Missing hero ID or name" });
        apiUrl = `https://mlbb-stats.ridwaanhall.com/api/hero-compatibility/${finalId}`;
        break;

      default:
        return res.status(400).json({ error: "Invalid source type" });
    }

    const response = await fetch(apiUrl);
    const data = await response.json();

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: 'Proxy server error', details: error.message });
  }
}
