-- Drop the old constraint first before updating statuses to avoid constraint violation
ALTER TABLE tournament_registrations DROP CONSTRAINT IF EXISTS tournament_registrations_status_check;

-- Update existing status values to match new flow/constraints
UPDATE tournament_registrations SET status = 'CONFIRMED' WHERE status = 'APPROVED';
UPDATE tournament_registrations SET status = 'REJECTED' WHERE status = 'CANCELLED';

-- Add the new constraint with PENDING, REGISTERED, CONFIRMED, REJECTED
ALTER TABLE tournament_registrations ADD CONSTRAINT tournament_registrations_status_check CHECK (status IN ('PENDING', 'REGISTERED', 'CONFIRMED', 'REJECTED'));
