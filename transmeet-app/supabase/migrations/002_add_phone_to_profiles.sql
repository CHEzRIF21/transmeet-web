-- Add phone column to profiles for OTP auth
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS phone text;

-- Update trigger to include phone from auth.users (phone auth sets NEW.phone)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, phone, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name'),
    COALESCE(NEW.phone, NEW.raw_user_meta_data->>'phone'),
    COALESCE((NEW.raw_user_meta_data->>'role')::app_role, 'expediteur')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
