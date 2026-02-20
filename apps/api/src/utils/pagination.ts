/**
 * Pagination curseur-based — utilitaires pour les listes
 */
export interface CursorPaginationParams {
  cursor?: string;
  limit?: number;
}

export const DEFAULT_LIMIT = 20;
export const MAX_LIMIT = 100;

export function parseLimit(limit?: number): number {
  if (limit == null) return DEFAULT_LIMIT;
  const n = Math.min(Math.max(1, limit), MAX_LIMIT);
  return n;
}
