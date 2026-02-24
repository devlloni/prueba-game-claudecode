/**
 * Leaderboard – Gestiona el top 10 de puntajes en localStorage.
 * Simula un archivo .json de persistencia local en el navegador.
 *
 * API pública:
 *   Leaderboard.get()                   → array de entradas ordenado por score desc
 *   Leaderboard.add(name, score, coins) → agrega entrada y devuelve array actualizado
 *   Leaderboard.isHighScore(score)      → true si el score entraría en el top 10
 *   Leaderboard.clear()                 → borra todos los records
 */
const Leaderboard = {
  KEY: 'pixelhop_leaderboard',
  MAX_ENTRIES: 10,

  /** Devuelve el array de entradas ordenado por score desc. */
  get() {
    try {
      return JSON.parse(localStorage.getItem(this.KEY) || '[]');
    } catch (_) {
      return [];
    }
  },

  /**
   * Agrega una nueva entrada, ordena por score y recorta a MAX_ENTRIES.
   * @returns {{ entries: Array, rank: number }} - array actualizado y posición (0-indexed)
   */
  add(name, score, coins) {
    const entries = this.get();
    const entry = {
      name:  (name || 'PLAYER').substring(0, 10).toUpperCase(),
      score: score || 0,
      coins: coins || 0,
      date:  new Date().toLocaleDateString()
    };
    entries.push(entry);
    entries.sort((a, b) => b.score - a.score);
    entries.splice(this.MAX_ENTRIES);
    localStorage.setItem(this.KEY, JSON.stringify(entries));

    // Devuelve también el rank final de la entrada recién agregada
    const rank = entries.findIndex(e => e.name === entry.name && e.score === entry.score);
    return { entries, rank, entry };
  },

  /** True si el score entraría en el top 10 actual. */
  isHighScore(score) {
    const entries = this.get();
    return entries.length < this.MAX_ENTRIES ||
           score > (entries[entries.length - 1]?.score ?? 0);
  },

  /** Elimina todos los records del localStorage. */
  clear() {
    localStorage.removeItem(this.KEY);
  }
};
