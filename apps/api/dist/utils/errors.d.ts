/**
 * Erreurs métier — classes d'erreur pour l'API
 */
export declare class AppError extends Error {
    readonly code: string;
    readonly statusCode: number;
    constructor(message: string, code: string, statusCode?: number);
}
export declare class MissionNotFoundError extends AppError {
    constructor();
}
export declare class UnauthorizedError extends AppError {
    constructor();
}
export declare class UserNotFoundError extends AppError {
    constructor();
}
export declare class PaymentFailedError extends AppError {
    constructor(message?: string);
}
export declare class ValidationError extends AppError {
    constructor(message?: string);
}
//# sourceMappingURL=errors.d.ts.map