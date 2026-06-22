DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='feedback' AND column_name='player_id') THEN
        ALTER TABLE feedback ADD COLUMN player_id BIGINT NOT NULL REFERENCES players(id) ON DELETE CASCADE;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='feedback' AND column_name='user_id') THEN
        ALTER TABLE feedback ADD COLUMN user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE;
    END IF;
END $$;
