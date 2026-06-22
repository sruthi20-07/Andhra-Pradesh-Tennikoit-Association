-- Migration V14: Offline payments support and contact messages table
ALTER TABLE tournament_registrations ADD COLUMN IF NOT EXISTS payment_status VARCHAR(20) NOT NULL DEFAULT 'PENDING_PAYMENT';

CREATE TABLE IF NOT EXISTS contact_messages (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL,
    subject VARCHAR(150) NOT NULL,
    message TEXT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE downloads ADD COLUMN IF NOT EXISTS file_name VARCHAR(255);
ALTER TABLE downloads ADD COLUMN IF NOT EXISTS file_path VARCHAR(512);
