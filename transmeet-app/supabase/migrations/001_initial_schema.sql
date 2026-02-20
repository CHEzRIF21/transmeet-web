-- Transmeet initial schema
-- Uses auth.users from Supabase Auth; public tables reference it via user_id (uuid)

-- Enum types
CREATE TYPE app_role AS ENUM ('expediteur', 'transporteur', 'admin');
CREATE TYPE company_type AS ENUM ('expediteur', 'transporteur');
CREATE TYPE request_status AS ENUM ('draft', 'published', 'matched', 'in_progress', 'completed', 'cancelled');
CREATE TYPE mission_status AS ENUM ('pending', 'accepted', 'in_transit', 'delivered', 'completed');
CREATE TYPE document_type AS ENUM ('assurance', 'licence', 'transport');

-- Companies (expéditeur or transporteur)
CREATE TABLE companies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  type company_type NOT NULL,
  country char(3) NOT NULL,
  address text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Profiles: extends auth.users with role and optional company
CREATE TABLE profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text,
  full_name text,
  role app_role NOT NULL DEFAULT 'expediteur',
  company_id uuid REFERENCES companies(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Shippers (expéditeurs): one per user/company
CREATE TABLE shippers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  company_id uuid NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Transporters (transporteurs): one per user/company
CREATE TABLE transporters (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  company_id uuid NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Vehicles (belong to company / transporteur)
CREATE TABLE vehicles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  type text NOT NULL,
  capacity_tons decimal(10,2),
  plate_number text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Shipment requests (demandes de transport by expéditeur)
CREATE TABLE shipment_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  shipper_id uuid NOT NULL REFERENCES shippers(id) ON DELETE CASCADE,
  origin_city text NOT NULL,
  origin_country char(3) NOT NULL,
  dest_city text NOT NULL,
  dest_country char(3) NOT NULL,
  status request_status NOT NULL DEFAULT 'draft',
  weight_kg decimal(12,2),
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Missions (link request + transporteur + vehicle)
CREATE TABLE missions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id uuid NOT NULL REFERENCES shipment_requests(id) ON DELETE CASCADE,
  transporter_id uuid NOT NULL REFERENCES transporters(id) ON DELETE CASCADE,
  vehicle_id uuid NOT NULL REFERENCES vehicles(id) ON DELETE RESTRICT,
  status mission_status NOT NULL DEFAULT 'pending',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Messages (chat mission)
CREATE TABLE messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  mission_id uuid NOT NULL REFERENCES missions(id) ON DELETE CASCADE,
  sender_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Notifications
CREATE TABLE notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type text NOT NULL,
  title text NOT NULL,
  body text,
  read_at timestamptz,
  metadata jsonb,
  created_at timestamptz DEFAULT now()
);

-- Documents (mission-related or vehicle-related)
CREATE TABLE documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  mission_id uuid REFERENCES missions(id) ON DELETE CASCADE,
  vehicle_id uuid REFERENCES vehicles(id) ON DELETE CASCADE,
  type document_type NOT NULL,
  file_url text NOT NULL,
  uploaded_by uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  CONSTRAINT doc_mission_or_vehicle CHECK (
    (mission_id IS NOT NULL AND vehicle_id IS NULL) OR
    (mission_id IS NULL AND vehicle_id IS NOT NULL)
  )
);

-- Reviews (after mission)
CREATE TABLE reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  mission_id uuid NOT NULL REFERENCES missions(id) ON DELETE CASCADE,
  reviewer_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  reviewee_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  rating smallint NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment text,
  created_at timestamptz DEFAULT now(),
  UNIQUE(mission_id, reviewer_id)
);

-- Indexes
CREATE INDEX idx_profiles_role ON profiles(role);
CREATE INDEX idx_profiles_company ON profiles(company_id);
CREATE INDEX idx_vehicles_company ON vehicles(company_id);
CREATE INDEX idx_shipment_requests_shipper ON shipment_requests(shipper_id);
CREATE INDEX idx_shipment_requests_status ON shipment_requests(status);
CREATE INDEX idx_missions_transporter ON missions(transporter_id);
CREATE INDEX idx_missions_status ON missions(status);
CREATE INDEX idx_messages_mission ON messages(mission_id);
CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_read ON notifications(user_id, read_at);

-- RLS
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE shippers ENABLE ROW LEVEL SECURITY;
ALTER TABLE transporters ENABLE ROW LEVEL SECURITY;
ALTER TABLE vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE shipment_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE missions ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- Policies: profiles (user can read/update own)
CREATE POLICY "Users can read own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Companies: read if linked via profile/shipper/transporter
CREATE POLICY "Users can read companies they belong to" ON companies FOR SELECT USING (
  id IN (SELECT company_id FROM profiles WHERE id = auth.uid() AND company_id IS NOT NULL)
  OR id IN (SELECT company_id FROM shippers WHERE user_id = auth.uid())
  OR id IN (SELECT company_id FROM transporters WHERE user_id = auth.uid())
);
CREATE POLICY "Authenticated users can create companies" ON companies FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Users can update own company" ON companies FOR UPDATE USING (
  id IN (SELECT company_id FROM profiles WHERE id = auth.uid())
  OR id IN (SELECT company_id FROM shippers WHERE user_id = auth.uid())
  OR id IN (SELECT company_id FROM transporters WHERE user_id = auth.uid())
);

-- Shippers: own row only
CREATE POLICY "Shippers read own" ON shippers FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Shippers insert own" ON shippers FOR INSERT WITH CHECK (user_id = auth.uid());

-- Transporters: own row only
CREATE POLICY "Transporters read own" ON transporters FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Transporters insert own" ON transporters FOR INSERT WITH CHECK (user_id = auth.uid());

-- Vehicles: company members can CRUD
CREATE POLICY "Company members can read vehicles" ON vehicles FOR SELECT USING (
  company_id IN (SELECT company_id FROM transporters WHERE user_id = auth.uid())
  OR company_id IN (SELECT company_id FROM profiles WHERE id = auth.uid())
);
CREATE POLICY "Transporters can insert vehicles" ON vehicles FOR INSERT WITH CHECK (
  company_id IN (SELECT company_id FROM transporters WHERE user_id = auth.uid())
);
CREATE POLICY "Transporters can update vehicles" ON vehicles FOR UPDATE USING (
  company_id IN (SELECT company_id FROM transporters WHERE user_id = auth.uid())
);
CREATE POLICY "Transporters can delete vehicles" ON vehicles FOR DELETE USING (
  company_id IN (SELECT company_id FROM transporters WHERE user_id = auth.uid())
);

-- Shipment requests: shipper owns; transporteurs see published
CREATE POLICY "Shippers can CRUD own requests" ON shipment_requests FOR ALL USING (
  shipper_id IN (SELECT id FROM shippers WHERE user_id = auth.uid())
);
CREATE POLICY "Transporters can read published requests" ON shipment_requests FOR SELECT USING (
  status = 'published' OR shipper_id IN (SELECT id FROM shippers WHERE user_id = auth.uid())
);
CREATE POLICY "Admin can read all requests" ON shipment_requests FOR SELECT USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Missions: transporteur and shipper (via request) can read; admin can all
CREATE POLICY "Mission read by participant or admin" ON missions FOR SELECT USING (
  transporter_id IN (SELECT id FROM transporters WHERE user_id = auth.uid())
  OR request_id IN (SELECT id FROM shipment_requests WHERE shipper_id IN (SELECT id FROM shippers WHERE user_id = auth.uid()))
  OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Admin can insert missions" ON missions FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Transporters can update own mission status" ON missions FOR UPDATE USING (
  transporter_id IN (SELECT id FROM transporters WHERE user_id = auth.uid())
);

-- Messages: mission participants
CREATE POLICY "Mission participants can read messages" ON messages FOR SELECT USING (
  mission_id IN (
    SELECT m.id FROM missions m
    JOIN transporters t ON m.transporter_id = t.id AND t.user_id = auth.uid()
    UNION
    SELECT m.id FROM missions m
    JOIN shipment_requests sr ON m.request_id = sr.id
    JOIN shippers s ON sr.shipper_id = s.id AND s.user_id = auth.uid()
  )
);
CREATE POLICY "Mission participants can insert messages" ON messages FOR INSERT WITH CHECK (
  sender_id = auth.uid() AND mission_id IN (
    SELECT m.id FROM missions m
    JOIN transporters t ON m.transporter_id = t.id AND t.user_id = auth.uid()
    UNION
    SELECT m.id FROM missions m
    JOIN shipment_requests sr ON m.request_id = sr.id
    JOIN shippers s ON sr.shipper_id = s.id AND s.user_id = auth.uid()
  )
);

-- Notifications: own only
CREATE POLICY "Users read own notifications" ON notifications FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users update own notifications" ON notifications FOR UPDATE USING (user_id = auth.uid());
-- Service role or triggers insert

-- Documents: mission/vehicle participants
CREATE POLICY "Documents read by mission or vehicle owner" ON documents FOR SELECT USING (
  (mission_id IS NOT NULL AND mission_id IN (
    SELECT id FROM missions WHERE transporter_id IN (SELECT id FROM transporters WHERE user_id = auth.uid())
    OR request_id IN (SELECT id FROM shipment_requests WHERE shipper_id IN (SELECT id FROM shippers WHERE user_id = auth.uid()))
  ))
  OR (vehicle_id IS NOT NULL AND vehicle_id IN (SELECT id FROM vehicles WHERE company_id IN (SELECT company_id FROM transporters WHERE user_id = auth.uid())))
);
CREATE POLICY "Participants can insert documents" ON documents FOR INSERT WITH CHECK (uploaded_by = auth.uid());

-- Reviews: mission participants
CREATE POLICY "Read reviews for own missions" ON reviews FOR SELECT USING (
  mission_id IN (
    SELECT id FROM missions WHERE transporter_id IN (SELECT id FROM transporters WHERE user_id = auth.uid())
    UNION
    SELECT m.id FROM missions m JOIN shipment_requests sr ON m.request_id = sr.id JOIN shippers s ON sr.shipper_id = s.id WHERE s.user_id = auth.uid()
  )
);
CREATE POLICY "Mission participants can insert review" ON reviews FOR INSERT WITH CHECK (reviewer_id = auth.uid());

-- Trigger: create profile on signup (optional; or do in app)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name'),
    COALESCE((NEW.raw_user_meta_data->>'role')::app_role, 'expediteur')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
