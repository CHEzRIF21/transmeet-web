/**
 * Pagination curseur-based — utilitaires pour les listes
 */
export interface CursorPaginationParams {
    cursor?: string;
    limit?: number;
}
export declare const DEFAULT_LIMIT = 20;
export declare const MAX_LIMIT = 100;
export declare function parseLimit(limit?: number): number;
//# sourceMappingURL=pagination.d.ts.map