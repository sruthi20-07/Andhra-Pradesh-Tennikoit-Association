-- Migration V16: Update feedback relations and contact_messages table

-- 1. Alter feedback table to make player_id and user_id nullable for anonymous submissions
ALTER TABLE feedback ALTER COLUMN player_id DROP NOT NULL;
ALTER TABLE feedback ALTER COLUMN user_id DROP NOT NULL;

-- 2. Add status and admin_reply columns to feedback table
ALTER TABLE feedback ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'NEW';
ALTER TABLE feedback ADD COLUMN IF NOT EXISTS admin_reply TEXT;

-- 3. Alter contact_messages table to support phone, status, and admin_reply
ALTER TABLE contact_messages ADD COLUMN IF NOT EXISTS phone VARCHAR(15);
ALTER TABLE contact_messages ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'OPEN';
ALTER TABLE contact_messages ADD COLUMN IF NOT EXISTS admin_reply TEXT;
