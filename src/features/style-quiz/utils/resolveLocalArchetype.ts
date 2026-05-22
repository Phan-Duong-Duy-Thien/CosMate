import { ARCHETYPE_PROFILES } from '../constants/archetypes';

/**
 * Interim archetype for checkpoint UI after stage 1 (no submit-quiz yet).
 * BE assigns final archetype on the single submit-quiz at end of stage 2.
 */
export function resolveLocalArchetypeId(E: number, A: number, O: number): string {
  const keys = Object.keys(ARCHETYPE_PROFILES);
  if (keys.length === 0) return 'ARCH_01';

  const max = Math.max(E, A, O);
  if (max <= 0) return keys[0];

  if (E === max) return keys[0] ?? 'ARCH_01';
  if (A === max) return keys[Math.min(1, keys.length - 1)] ?? 'ARCH_02';
  return keys[Math.min(2, keys.length - 1)] ?? 'ARCH_03';
}
