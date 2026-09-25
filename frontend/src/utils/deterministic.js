/**
 * Deterministic pseudo-random — pure function of (seed).
 * Single mulberry32 step over an integer seed → [0, 1).
 *
 * Why not Math.random()? Particle geometry is generated during render
 * (useMemo initializer). Math.random() is impure, which breaks render
 * purity (react-hooks/purity) and makes geometry unstable across
 * re-renders. A seeded PRNG is pure, stable, and visually identical.
 */
export const rand01 = (seed) => {
  let t = Math.imul((seed | 0) ^ ((seed | 0) >>> 15), (seed | 0) | 1);
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};

export default rand01;
