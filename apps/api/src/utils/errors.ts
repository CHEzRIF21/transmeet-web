/**
 * Erreurs métier — classes d'erreur pour l'API
 */
export class AppError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly statusCode: number = 500
  ) {
    super(message);
    this.name = "AppError";
  }
}

export class MissionNotFoundError extends AppError {
  constructor() {
    super("Mission non trouvée", "MISSION_NOT_FOUND", 404);
    this.name = "MissionNotFoundError";
  }
}

export class UnauthorizedError extends AppError {
  constructor() {
    super("Non autorisé", "UNAUTHORIZED", 401);
    this.name = "UnauthorizedError";
  }
}

export class UserNotFoundError extends AppError {
  constructor() {
    super("Utilisateur non trouvé", "USER_NOT_FOUND", 404);
    this.name = "UserNotFoundError";
  }
}

export class PaymentFailedError extends AppError {
  constructor(message = "Paiement échoué") {
    super(message, "PAYMENT_FAILED", 402);
    this.name = "PaymentFailedError";
  }
}

export class ValidationError extends AppError {
  constructor(message = "Données invalides") {
    super(message, "VALIDATION_ERROR", 400);
    this.name = "ValidationError";
  }
}
