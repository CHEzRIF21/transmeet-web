"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OfferNotFoundError = exports.TransportRequestNotFoundError = exports.ValidationError = exports.PaymentFailedError = exports.UserNotFoundError = exports.UnauthorizedError = exports.MissionNotFoundError = exports.AppError = void 0;
/**
 * Erreurs métier — classes d'erreur pour l'API
 */
class AppError extends Error {
    code;
    statusCode;
    constructor(message, code, statusCode = 500) {
        super(message);
        this.code = code;
        this.statusCode = statusCode;
        this.name = "AppError";
    }
}
exports.AppError = AppError;
class MissionNotFoundError extends AppError {
    constructor() {
        super("Mission non trouvée", "MISSION_NOT_FOUND", 404);
        this.name = "MissionNotFoundError";
    }
}
exports.MissionNotFoundError = MissionNotFoundError;
class UnauthorizedError extends AppError {
    constructor() {
        super("Non autorisé", "UNAUTHORIZED", 401);
        this.name = "UnauthorizedError";
    }
}
exports.UnauthorizedError = UnauthorizedError;
class UserNotFoundError extends AppError {
    constructor() {
        super("Utilisateur non trouvé", "USER_NOT_FOUND", 404);
        this.name = "UserNotFoundError";
    }
}
exports.UserNotFoundError = UserNotFoundError;
class PaymentFailedError extends AppError {
    constructor(message = "Paiement échoué") {
        super(message, "PAYMENT_FAILED", 402);
        this.name = "PaymentFailedError";
    }
}
exports.PaymentFailedError = PaymentFailedError;
class ValidationError extends AppError {
    constructor(message = "Données invalides") {
        super(message, "VALIDATION_ERROR", 400);
        this.name = "ValidationError";
    }
}
exports.ValidationError = ValidationError;
class TransportRequestNotFoundError extends AppError {
    constructor() {
        super("Demande non trouvée", "REQUEST_NOT_FOUND", 404);
        this.name = "TransportRequestNotFoundError";
    }
}
exports.TransportRequestNotFoundError = TransportRequestNotFoundError;
class OfferNotFoundError extends AppError {
    constructor() {
        super("Proposition non trouvée", "OFFER_NOT_FOUND", 404);
        this.name = "OfferNotFoundError";
    }
}
exports.OfferNotFoundError = OfferNotFoundError;
//# sourceMappingURL=errors.js.map