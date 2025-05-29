
import heroList from './heroList.js';

export default function heroNameToId(name) {
  if (!name || typeof name !== 'string') return null;

  const normalizado = name.trim().toLowerCase();

  for (const [id, heroName] of Object.entries(heroList)) {
    if (heroName.trim().toLowerCase() === normalizado) {
      return id;
    }
  }

  return null;
}
