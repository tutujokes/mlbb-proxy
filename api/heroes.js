const API_URL = "https://mlbb-proxy.vercel.app/api/hero-list/";

function criarCardHeroi(hero) {
  const card = document.createElement('div');
  card.className = "card-hero";
  card.innerHTML = `
    <a href="heroi.html?name=${encodeURIComponent(hero.name)}">
      <img src="${hero.head}" alt="${hero.name}">
      <div>${hero.name}</div>
    </a>
  `;
  return card;
}

fetch(API_URL)
  .then(res => res.json())
  .then(json => {
    // Ajuste para records
    const records = json.data && json.data.records ? json.data.records : [];
    records.sort((a, b) => {
      const nameA = a.data.main_hero.data.name;
      const nameB = b.data.main_hero.data.name;
      return nameA.localeCompare(nameB, 'pt-BR');
    });
    const container = document.getElementById('lista-herois');
    records.forEach(entry => {
      const hero = entry.data.main_hero.data;
      const card = criarCardHeroi(hero);
      container.appendChild(card);
    });
  })
  .catch(() => {
    document.getElementById('lista-herois').innerHTML = '<p>Erro ao carregar lista de heróis.</p>';
  });
