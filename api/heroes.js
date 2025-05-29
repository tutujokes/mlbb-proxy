export default async function handler(req, res) {
  const source = req.query.source || 'rank';
  const name = req.query.name;
  const role = req.query.role;
  const lane = req.query.lane;
  const days = req.query.days;
  const rank = req.query.rank || 'mythic';
  const size = req.query.size || 10;
  const index = req.query.index || 1;
  const sort_field = req.query.sort_field || 'win_rate';
  const sort_order = req.query.sort_order || 'desc';

  let apiUrl = '';

  try {
    switch (source) {
      case 'position':
        {
          const params = [];
          if (role) params.push(`role=${role}`);
          if (lane) params.push(`lane=${lane}`);
          params.push(`size=${size}`);
          params.push(`index=${index}`);
          apiUrl = `https://mlbb-stats.ridwaanhall.com/api/hero-position/?${params.join('&')}`;
        }
        break;

      case 'list':
        apiUrl = `https://mlbb-stats.ridwaanhall.com/api/hero-list/`;
        break;

      case 'detail':
        if (!name) return res.status(400).json({ error: "Parâmetro 'name' obrigatório para detail" });
        apiUrl = `https://mlbb-stats.ridwaanhall.com/api/hero-detail/?name=${encodeURIComponent(name)}`;
        break;

      case 'combo':
        if (!name) return res.status(400).json({ error: "Parâmetro 'name' obrigatório para combo" });
        apiUrl = `https://mlbb-stats.ridwaanhall.com/api/hero-combo/?name=${encodeURIComponent(name)}`;
        break;

      case 'counter':
        if (!name) return res.status(400).json({ error: "Parâmetro 'name' obrigatório para counter" });
        apiUrl = `https://mlbb-stats.ridwaanhall.com/api/hero-counter/?name=${encodeURIComponent(name)}`;
        break;

      case 'skin':
        if (!name) return res.status(400).json({ error: "Parâmetro 'name' obrigatório para skin" });
        apiUrl = `https://mlbb-stats.ridwaanhall.com/api/hero-skin/?name=${encodeURIComponent(name)}`;
        break;

      case 'equipment':
        if (!name) return res.status(400).json({ error: "Parâmetro 'name' obrigatório para equipment" });
        apiUrl = `https://mlbb-stats.ridwaanhall.com/api/hero-equipment/?name=${encodeURIComponent(name)}`;
        break;

      default:
        {
          // fallback para hero-rank
          const params = [];
          if (days !== undefined) params.push(`days=${days}`);
          if (rank) params.push(`rank=${rank}`);
          params.push(`size=${size}`);
          params.push(`index=${index}`);
          params.push(`sort_field=${sort_field}`);
          params.push(`sort_order=${sort_order}`);
          apiUrl = `https://mlbb-stats.ridwaanhall.com/api/hero-rank/?${params.join('&')}`;
        }
        break;
    }

    console.log('📡 Chamando:', apiUrl);

    const response = await fetch(apiUrl);
    if (!response.ok) {
      return res.status(response.status).json({ error: 'Erro ao buscar dados na API MLBB', apiUrl });
    }

    const data = await response.json();

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: 'Erro no servidor proxy', details: error.message, apiUrl });
  }
}
