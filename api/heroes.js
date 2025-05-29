export default async function handler(req, res) {
  // Normalize os parâmetros para minúsculo
  const role = req.query.role;
  const lane = req.query.lane;
  const days = req.query.days;
  const rank = req.query.rank;
  const size = req.query.size || 10;
  const index = req.query.index || 1;
  const sort_field = req.query.sort_field;
  const sort_order = req.query.sort_order;
  const source = req.query.source;

  let apiUrl = '';

  if (source === 'position') {
    // Monta a URL apenas com params definidos
    let params = [];
    if (role) params.push(`role=${role}`);
    if (lane) params.push(`lane=${lane}`);
    params.push(`size=${size}`);
    params.push(`index=${index}`);
    apiUrl = `https://mlbb-stats.ridwaanhall.com/api/hero-position/?${params.join('&')}`;
  } else {
    let params = [];
    if (days) params.push(`days=${days}`);
    params.push(`rank=${rank || 'mythic'}`);
    params.push(`size=${size}`);
    params.push(`index=${index}`);
    params.push(`sort_field=${sort_field || 'win_rate'}`);
    params.push(`sort_order=${sort_order || 'desc'}`);
    apiUrl = `https://mlbb-stats.ridwaanhall.com/api/hero-rank/?${params.join('&')}`;
  }

  try {
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
