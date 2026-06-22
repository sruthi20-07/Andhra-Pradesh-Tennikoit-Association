-- V8__seed_data.sql

-- ── STEP 1: DROP ALL PROBLEMATIC CONSTRAINTS ──────────────────
DO $$
DECLARE r RECORD;
BEGIN
  FOR r IN
    SELECT conname, conrelid::regclass AS tbl
    FROM pg_constraint
    WHERE contype = 'c' AND conrelid::regclass::text IN ('tournaments', 'players', 'tournament_registrations', 'payments', 'notifications', 'users')
  LOOP
    EXECUTE 'ALTER TABLE ' || r.tbl || ' DROP CONSTRAINT IF EXISTS ' || r.conname || ' CASCADE;';
  END LOOP;
END $$;

-- ── STEP 2: ADD MISSING COLUMNS ───────────────────────────────
ALTER TABLE players ADD COLUMN IF NOT EXISTS experience_years INT DEFAULT 0;
ALTER TABLE players ADD COLUMN IF NOT EXISTS id_proof_url VARCHAR(512);
ALTER TABLE players ADD COLUMN IF NOT EXISTS approved_at TIMESTAMP;
ALTER TABLE players ADD COLUMN IF NOT EXISTS approved_by INT REFERENCES users(id) ON DELETE SET NULL;

ALTER TABLE tournaments ADD COLUMN IF NOT EXISTS brochure_url VARCHAR(512);
ALTER TABLE tournaments ADD COLUMN IF NOT EXISTS max_participants INT DEFAULT 100;
ALTER TABLE tournaments ADD COLUMN IF NOT EXISTS is_free BOOLEAN DEFAULT TRUE;

ALTER TABLE notifications ADD COLUMN IF NOT EXISTS notif_type VARCHAR(50) DEFAULT 'announcement';

ALTER TABLE tournament_categories ALTER COLUMN age_group DROP NOT NULL;

-- ── STEP 3: RECREATE CLEAN CONSTRAINTS ────────────────────────
ALTER TABLE tournaments ADD CONSTRAINT tournaments_status_check CHECK (status IN ('DRAFT', 'PUBLISHED', 'COMPLETED', 'CANCELLED', 'UPCOMING', 'ONGOING', 'ACTIVE'));
ALTER TABLE players ADD CONSTRAINT players_status_check CHECK (status IN ('PENDING', 'APPROVED', 'REJECTED', 'INACTIVE'));
ALTER TABLE tournament_registrations ADD CONSTRAINT tournament_registrations_status_check CHECK (status IN ('PENDING', 'APPROVED', 'REJECTED', 'CANCELLED'));
ALTER TABLE payments ADD CONSTRAINT payments_payment_status_check CHECK (payment_status IN ('PENDING', 'SUCCESS', 'FAILED', 'REFUNDED'));
ALTER TABLE notifications ADD CONSTRAINT notifications_notification_type_check CHECK (notification_type IN ('SYSTEM', 'EMAIL', 'SMS'));

-- ── STEP 4: SEED DATA ──────────────────────────────────────────
-- 1. Admin user
INSERT INTO users (email, password_hash, role, first_name, last_name, phone_number, district, status)
VALUES ('admin@aptamp.org', '$2a$10$qsd693EbEdi1Nwqt5dwZtO1jARJdSedB072qhRzwRHSrYhoUF/.Ty', 'ROLE_ADMIN', 'APTA', 'Admin', '9999999999', 'Guntur', 'ACTIVE')
ON CONFLICT (email) DO NOTHING;

-- 2. Committee members
INSERT INTO committee_members (name, role, district, contact, designation, term_start, term_end, active, display_order)
VALUES 
('Sri. Ch. Venkat Rao', 'President', 'Krishna', 'president@aptennikoit.org', 'President', '2024-01-01', '2028-12-31', TRUE, 1),
('Dr. M. Sridhar', 'General Secretary', 'Guntur', 'secretary@aptennikoit.org', 'Secretary', '2024-01-01', '2028-12-31', TRUE, 2),
('Smt. K. Sarada', 'Treasurer', 'Visakhapatnam', 'treasurer@aptennikoit.org', 'Treasurer', '2024-01-01', '2028-12-31', TRUE, 3);

-- 3. Downloads
INSERT INTO downloads (title, name, size, type, object_name, description, file_url, category, download_count, active)
VALUES
('Official Tennikoit Rule Book 2026', 'rulebook_2026.pdf', 2516582, 'PDF', 'rulebook_2026.pdf', 'Official international and national rules for Tennikoit matches.', 'http://localhost:8080/uploads/documents/rulebook_2026.pdf', 'RULES', 150, TRUE),
('Player Registration Guide', 'registration_guide.pdf', 1153433, 'PDF', 'registration_guide.pdf', 'Step-by-step guide for registering players on the APTAMP portal.', 'http://localhost:8080/uploads/documents/registration_guide.pdf', 'GUIDES', 320, TRUE);

-- 4. Tournaments
INSERT INTO tournaments (title, description, venue, start_date, end_date, registration_deadline, entry_fee, status, brochure_url, max_participants, is_free)
VALUES
('47th AP State Senior Tennikoit Championship', 'Annual state level championship for senior players.', 'Indira Gandhi Municipal Stadium, Vijayawada', '2026-07-15', '2026-07-18', '2026-07-05', 200.00, 'PUBLISHED', 'http://localhost:8080/uploads/documents/brochure_47th.pdf', 256, FALSE),
('AP State Sub-Junior Tennikoit Championship', 'Annual state level championship for sub-junior category (boys & girls).', 'NTR Municipal Stadium, Guntur', '2026-08-01', '2026-08-04', '2026-07-20', 0.00, 'PUBLISHED', 'http://localhost:8080/uploads/documents/brochure_sub_jr.pdf', 128, TRUE);

-- 5. Notifications
INSERT INTO notifications (title, message, notification_type, notif_type, is_read)
VALUES
('Welcome to APTAMP Portal', 'Welcome to the Andhra Pradesh Tennikoit Association Management Portal. Please register and update your profile.', 'SYSTEM', 'announcement', FALSE),
('State Championship Registration Open', 'Registrations are now open for the 47th AP State Senior Tennikoit Championship. Last date to apply is 2026-07-05.', 'SYSTEM', 'announcement', FALSE);

-- 6. Gallery Items
INSERT INTO gallery_items (title, description, media_type, media_url, thumbnail_url, gallery_type)
VALUES
('Action Shot - 46th State Championship', 'Intense final match of the 46th State Championship.', 'IMAGE', 'http://localhost:8080/uploads/gallery/action_shot.jpg', 'http://localhost:8080/uploads/gallery/action_shot.jpg', 'PHOTO'),
('Award Ceremony 2025', 'Winners receiving awards from the President.', 'IMAGE', 'http://localhost:8080/uploads/gallery/award_ceremony.jpg', 'http://localhost:8080/uploads/gallery/award_ceremony.jpg', 'PHOTO');

-- 7. Calendar Events
INSERT INTO calendar_events (title, description, event_date, date_text, location, event_type)
VALUES
('47th State Senior Championship', 'State level championship.', '2026-07-15', '15th - 18th July 2026', 'Vijayawada', 'TOURNAMENT'),
('Referee Clinic and Certification', 'Training and certification program for official referees.', '2026-07-10', '10th July 2026', 'Guntur', 'EVENT');
