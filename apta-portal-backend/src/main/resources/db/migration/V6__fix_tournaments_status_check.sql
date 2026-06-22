-- V6__fix_tournaments_status_check.sql
ALTER TABLE tournaments DROP CONSTRAINT IF EXISTS tournaments_status_check;
ALTER TABLE tournaments ADD CONSTRAINT tournaments_status_check CHECK (status IN ('DRAFT', 'PUBLISHED', 'COMPLETED', 'CANCELLED', 'UPCOMING', 'ONGOING', 'ACTIVE'));

