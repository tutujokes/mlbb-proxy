// Recarrega a lista a cada 5 minutos no máximo
let heroListCache = null;
let cacheTime = 0;

async function getHeroList() {
  const now = Date.now();
  if (heroListCache && now - cacheTime < 5 * 60 * 1000) {
    return heroListCache;
  }
  const res = await fetch('https://mlbb-stats.ridwaanhall.com/api/hero-list/');
  const data = await res.json();
  heroListCache = data;
  cacheTime = now;
  return data;
}

/**
 * Busca o ID do herói pelo nome, ignorando maiúsculas/minúsculas e acentos
 */
async function heroNameToId(name) {
  const list = await getHeroList();
  const normalized = (str) => str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
  const target = normalized(name);
  for (const [id, heroName] of Object.entries(list)) {
    if (normalized(heroName) === target) return id;
  }
  return null;
}

export default heroNameToId;
