-- Allow authenticated users to insert notifications (e.g. when sending message, API creates notification for recipient)
CREATE POLICY "Authenticated can insert notifications" ON notifications
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
