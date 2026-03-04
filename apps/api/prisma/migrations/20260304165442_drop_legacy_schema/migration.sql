-- Drop legacy tables (reverse FK order)
DROP TABLE IF EXISTS public.reviews CASCADE;
DROP TABLE IF EXISTS public.documents CASCADE;
DROP TABLE IF EXISTS public.messages CASCADE;
DROP TABLE IF EXISTS public.notifications CASCADE;
DROP TABLE IF EXISTS public.missions CASCADE;
DROP TABLE IF EXISTS public.shipment_requests CASCADE;
DROP TABLE IF EXISTS public.transporters CASCADE;
DROP TABLE IF EXISTS public.shippers CASCADE;
DROP TABLE IF EXISTS public.vehicles CASCADE;
DROP TABLE IF EXISTS public.companies CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;

-- Drop legacy enums
DROP TYPE IF EXISTS document_type CASCADE;
DROP TYPE IF EXISTS mission_status CASCADE;
DROP TYPE IF EXISTS request_status CASCADE;
DROP TYPE IF EXISTS company_type CASCADE;
DROP TYPE IF EXISTS app_role CASCADE;
