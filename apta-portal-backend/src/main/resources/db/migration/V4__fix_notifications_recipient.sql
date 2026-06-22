-- V4__fix_notifications_recipient.sql
ALTER TABLE notifications ALTER COLUMN recipient_id DROP NOT NULL;
ALTER TABLE notifications DROP CONSTRAINT IF EXISTS notifications_recipient_id_not_null;
ALTER TABLE notifications ADD COLUMN IF NOT EXISTS created_by INT REFERENCES users(id) ON DELETE SET NULL;
