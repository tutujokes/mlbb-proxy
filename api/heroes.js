export default async function handler(req, res) {
const { role, lane, days, rank, size, index, sort_field, sort_order, source } = req.query;

// Definir endpoint de origem
let apiUrl = '';

if (source === 'position') {
// Filtros por função e rota
apiUrl = https://mlbb-stats.ridwaanhall.com/api/hero-position/?role=${role}&lane=${lane}&size=${size || 10}&index=${index || 1};
} else {
// Tier list baseada em win_rate, pick_rate, etc
apiUrl = https://mlbb-stats.ridwaanhall.com/api/hero-rank/?days=${days || 7}&rank=${rank || 'mythic'}&size=${size || 10}&index=${index || 1}&sort_field=${sort_field || 'win_rate'}&sort_order=${sort_order || 'desc'};
}

try {
const response = await fetch(apiUrl);
if (!response.ok) {
return res.status(response.status).json({ error: 'Erro ao buscar dados na API MLBB' });
}
const data = await response.json();

kotlin
Copiar
Editar
res.setHeader('Access-Control-Allow-Origin', '*');
res.status(200).json(data);
} catch (error) {
res.status(500).json({ error: 'Erro no servidor proxy', details: error.message });
}
}
