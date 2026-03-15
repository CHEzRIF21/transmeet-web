/**
 * Types partagés Transmit — re-export des types Prisma et API
 * Après `prisma generate`, on peut ajouter: export * from '@prisma/client'
 */

export type UserRole = "EXPEDITEUR" | "TRANSPORTEUR" | "ADMIN" | "DOUANIER";

export type LeadType = "EXPEDITEUR" | "TRANSPORTEUR" | "BTP" | "CONTACT";

export interface Lead {
  id: string;
  type: LeadType;
  name: string | null;
  email: string | null;
  phone: string | null;
  company: string | null;
  message: string | null;
  metadata: Record<string, unknown> | null;
  createdAt: string;
}

export interface ApiSuccess<T> {
  success: true;
  data: T;
  message?: string;
}

export interface ApiError {
  success: false;
  error: string;
  code: string;
  details?: unknown;
}

export type ApiResponse<T> = ApiSuccess<T> | ApiError;
