-- V7__drop_status_constraints.sql
ALTER TABLE tournaments DROP CONSTRAINT IF EXISTS tournaments_status_check;
ALTER TABLE players DROP CONSTRAINT IF EXISTS players_status_check;
ALTER TABLE tournament_registrations DROP CONSTRAINT IF EXISTS tournament_registrations_status_check;
ALTER TABLE payments DROP CONSTRAINT IF EXISTS payments_payment_status_check;
ALTER TABLE notifications DROP CONSTRAINT IF EXISTS notifications_notification_type_check;
