/** Generated-style types for Transmeet Supabase schema (match 001_initial_schema.sql) */

export type AppRole = "expediteur" | "transporteur" | "admin";
export type CompanyType = "expediteur" | "transporteur";
export type RequestStatus =
  | "draft"
  | "published"
  | "matched"
  | "in_progress"
  | "completed"
  | "cancelled";
export type MissionStatus =
  | "pending"
  | "accepted"
  | "in_transit"
  | "delivered"
  | "completed";
export type DocumentType = "assurance" | "licence" | "transport";

export interface Company {
  id: string;
  name: string;
  type: CompanyType;
  country: string;
  address: string | null;
  created_at: string;
  updated_at: string;
}

export interface Profile {
  id: string;
  email: string | null;
  phone: string | null;
  full_name: string | null;
  role: AppRole;
  company_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface Shipper {
  id: string;
  user_id: string;
  company_id: string;
  created_at: string;
  updated_at: string;
}

export interface Transporter {
  id: string;
  user_id: string;
  company_id: string;
  created_at: string;
  updated_at: string;
}

export interface Vehicle {
  id: string;
  company_id: string;
  type: string;
  capacity_tons: number | null;
  plate_number: string;
  created_at: string;
  updated_at: string;
}

export interface ShipmentRequest {
  id: string;
  shipper_id: string;
  origin_city: string;
  origin_country: string;
  dest_city: string;
  dest_country: string;
  status: RequestStatus;
  weight_kg: number | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface Mission {
  id: string;
  request_id: string;
  transporter_id: string;
  vehicle_id: string;
  status: MissionStatus;
  created_at: string;
  updated_at: string;
}

export interface Message {
  id: string;
  mission_id: string;
  sender_id: string;
  content: string;
  created_at: string;
}

export interface Notification {
  id: string;
  user_id: string;
  type: string;
  title: string;
  body: string | null;
  read_at: string | null;
  metadata: Record<string, unknown> | null;
  created_at: string;
}

export interface Document {
  id: string;
  mission_id: string | null;
  vehicle_id: string | null;
  type: DocumentType;
  file_url: string;
  uploaded_by: string;
  created_at: string;
}

export interface Review {
  id: string;
  mission_id: string;
  reviewer_id: string;
  reviewee_id: string;
  rating: number;
  comment: string | null;
  created_at: string;
}

export interface Database {
  public: {
    Tables: {
      companies: { Row: Company; Insert: Omit<Company, "created_at" | "updated_at"> & { created_at?: string; updated_at?: string }; Update: Partial<Company> };
      profiles: { Row: Profile; Insert: Omit<Profile, "created_at" | "updated_at"> & { created_at?: string; updated_at?: string }; Update: Partial<Profile> };
      shippers: { Row: Shipper; Insert: Omit<Shipper, "created_at" | "updated_at"> & { created_at?: string; updated_at?: string }; Update: Partial<Shipper> };
      transporters: { Row: Transporter; Insert: Omit<Transporter, "created_at" | "updated_at"> & { created_at?: string; updated_at?: string }; Update: Partial<Transporter> };
      vehicles: { Row: Vehicle; Insert: Omit<Vehicle, "created_at" | "updated_at"> & { created_at?: string; updated_at?: string }; Update: Partial<Vehicle> };
      shipment_requests: { Row: ShipmentRequest; Insert: Omit<ShipmentRequest, "created_at" | "updated_at"> & { created_at?: string; updated_at?: string }; Update: Partial<ShipmentRequest> };
      missions: { Row: Mission; Insert: Omit<Mission, "created_at" | "updated_at"> & { created_at?: string; updated_at?: string }; Update: Partial<Mission> };
      messages: { Row: Message; Insert: Omit<Message, "created_at"> & { created_at?: string }; Update: Partial<Message> };
      notifications: { Row: Notification; Insert: Omit<Notification, "created_at"> & { created_at?: string }; Update: Partial<Notification> };
      documents: { Row: Document; Insert: Omit<Document, "created_at"> & { created_at?: string }; Update: Partial<Document> };
      reviews: { Row: Review; Insert: Omit<Review, "created_at"> & { created_at?: string }; Update: Partial<Review> };
    };
  };
}
