export function getCategoryIcon(name = '') {
  const n = name.toLowerCase();

  if (n.includes('aud') || n.includes('auri')) return '🎧';
  if (n.includes('acces')) return '🧩';
  if (n.includes('carg')) return '⚡';
  if (n.includes('watch') || n.includes('reloj')) return '⌚';
  if (n.includes('compu') || n.includes('pc') || n.includes('comput')) return '💻';
  if (n.includes('gami') || n.includes('juego') || n.includes('gamer')) return '🎮';
  if (n.includes('auto')) return '✨';
  if (n.includes('telefono') || n.includes('móvil') || n.includes('celular')) return '📱';
  if (n.includes('otros')) return '📦';

  return '📦';
}