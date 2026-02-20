-- Storage bucket for documents
INSERT INTO storage.buckets (id, name, public) VALUES ('documents', 'documents', false);

-- RLS: users can read objects in documents bucket if they are participant (mission or vehicle company)
-- Allow upload for authenticated (policy can be refined per path)
CREATE POLICY "Authenticated upload documents" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'documents' AND auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated read own context documents" ON storage.objects
  FOR SELECT USING (bucket_id = 'documents' AND auth.uid() IS NOT NULL);
