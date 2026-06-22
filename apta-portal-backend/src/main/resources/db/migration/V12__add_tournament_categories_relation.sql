-- Safe schema migration to establish association between tournaments and categories
ALTER TABLE tournament_categories ADD COLUMN IF NOT EXISTS tournament_id INT REFERENCES tournaments(id) ON DELETE CASCADE;

-- Clear previous entries if any to prevent duplicates on rerun
DELETE FROM tournament_categories WHERE tournament_id IN (1, 2);

-- Seed Categories for Tournament 1 (47th AP State Senior Tennikoit Championship)
INSERT INTO tournament_categories (tournament_id, category_name, gender, age_group, max_slots)
VALUES
(1, 'Men''s Singles', 'MALE', 'SENIOR', 64),
(1, 'Women''s Singles', 'FEMALE', 'SENIOR', 64),
(1, 'Men''s Doubles', 'MALE', 'SENIOR', 64),
(1, 'Women''s Doubles', 'FEMALE', 'SENIOR', 64),
(1, 'Mixed Doubles', 'MIXED', 'SENIOR', 64);

-- Seed Categories for Tournament 2 (AP State Sub-Junior Tennikoit Championship)
INSERT INTO tournament_categories (tournament_id, category_name, gender, age_group, max_slots)
VALUES
(2, 'Boys Singles', 'MALE', 'SUB_JUNIOR', 64),
(2, 'Girls Singles', 'FEMALE', 'SUB_JUNIOR', 64),
(2, 'Boys Doubles', 'MALE', 'SUB_JUNIOR', 64),
(2, 'Girls Doubles', 'FEMALE', 'SUB_JUNIOR', 64);
