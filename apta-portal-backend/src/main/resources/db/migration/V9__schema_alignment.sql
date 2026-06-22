-- Safe schema alignment (no data deletion)

CREATE TABLE IF NOT EXISTS grievances (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE SET NULL,
    name VARCHAR(100),
    email VARCHAR(150),
    subject VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'OPEN',
    resolved_by INT REFERENCES users(id) ON DELETE SET NULL,
    resolution_details TEXT,
    resolved_at TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Align ranking history table name if Hibernate created ranking_history
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.tables
        WHERE table_schema = 'public' AND table_name = 'ranking_history'
    ) AND NOT EXISTS (
        SELECT 1 FROM information_schema.tables
        WHERE table_schema = 'public' AND table_name = 'ranking_histories'
    ) THEN
        ALTER TABLE ranking_history RENAME TO ranking_histories;
    END IF;
END $$;

ALTER TABLE calendar_events ADD COLUMN IF NOT EXISTS event_date_text VARCHAR(150);
ALTER TABLE players ADD COLUMN IF NOT EXISTS district VARCHAR(100);
ALTER TABLE tournaments ADD COLUMN IF NOT EXISTS organizer VARCHAR(150);
ALTER TABLE gallery_items ADD COLUMN IF NOT EXISTS is_featured BOOLEAN NOT NULL DEFAULT FALSE;
