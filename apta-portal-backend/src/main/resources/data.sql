-- APTAMP Seeding Data Script
-- Default password for all seeded users is: password (BCrypt: $2a$10$8.K1dgrb60E9197pRy.SVOc4zE9.2qj2iY9W6O36Q8lYf3Yt82522)

-- 1. Seed Users (Admin, District Admins, Players)
INSERT INTO users (id, email, password_hash, role, first_name, last_name, phone_number, district, status) VALUES
(1, 'admin@aptennikoit.org', '$2a$10$8.K1dgrb60E9197pRy.SVOc4zE9.2qj2iY9W6O36Q8lYf3Yt82522', 'SUPER_ADMIN', 'APTA', 'Admin', '9876543210', 'Guntur', 'ACTIVE'),
(2, 'district@aptennikoit.org', '$2a$10$8.K1dgrb60E9197pRy.SVOc4zE9.2qj2iY9W6O36Q8lYf3Yt82522', 'DISTRICT_ADMIN', 'Guntur', 'Admin', '9876543211', 'Guntur', 'ACTIVE'),
(3, 'player@aptennikoit.org', '$2a$10$8.K1dgrb60E9197pRy.SVOc4zE9.2qj2iY9W6O36Q8lYf3Yt82522', 'PLAYER', 'Srinivasa', 'Naidu', '9876543212', 'Visakhapatnam', 'ACTIVE'),
(4, 'lakshmi@aptennikoit.org', '$2a$10$8.K1dgrb60E9197pRy.SVOc4zE9.2qj2iY9W6O36Q8lYf3Yt82522', 'PLAYER', 'T.', 'Lakshmi', '9876543213', 'Guntur', 'ACTIVE');

-- 2. Seed Players
INSERT INTO players (id, user_id, registration_number, gender, date_of_birth, tennikoit_category, coach_name, father_name, state, photo_url, status) VALUES
(1, 3, 'APTA-2026-VIS-001', 'MALE', '1998-05-15', 'Senior', 'Dr. Prasad', 'Rama Naidu', 'Andhra Pradesh', 'Visakhapatnam_001.jpg', 'APPROVED'),
(2, 4, 'APTA-2026-GUN-002', 'FEMALE', '2000-08-20', 'Senior', 'Shri. Rao', 'Appa Rao', 'Andhra Pradesh', 'Guntur_002.jpg', 'APPROVED');

-- 3. Seed Tournaments
INSERT INTO tournaments (id, title, description, venue, start_date, end_date, registration_deadline, entry_fee, status) VALUES
(1, '45th AP State Inter-District Tournament 2026', 'AP State Inter-District Championship in singles and doubles categories.', 'Vijayawada Sports Complex, Krishna', '2026-07-12', '2026-07-15', '2026-07-05', 250.00, 'PUBLISHED'),
(2, 'AP State Selection Trials (Sub-Junior)', 'Selection trials to select the AP team for Nationals 2026.', 'District Stadium, Guntur', '2026-06-25', '2026-06-27', '2026-06-20', 100.00, 'PUBLISHED'),
(3, 'Senior Inter-District Championship 2026', 'AP state matches for Senior players.', 'Nellore Athletic Club, Nellore', '2026-09-20', '2026-09-23', '2026-09-10', 300.00, 'DRAFT');

-- 4. Seed Tournament Categories
INSERT INTO tournament_categories (id, category_name, gender, age_group, max_slots) VALUES
(1, 'Men''s Singles', 'MALE', 'Senior', 64),
(2, 'Women''s Singles', 'FEMALE', 'Senior', 64),
(3, 'Men''s Doubles', 'MALE', 'Senior', 32),
(4, 'Women''s Doubles', 'FEMALE', 'Senior', 32),
(5, 'Mixed Doubles', 'MIXED', 'Senior', 32);

-- 5. Seed Rankings
INSERT INTO rankings (id, player_id, category_id, points, current_rank, last_updated) VALUES
(1, 1, 1, 840, 1, CURRENT_TIMESTAMP),
(2, 2, 2, 760, 2, CURRENT_TIMESTAMP);

-- 6. Seed Committee Members
INSERT INTO committee_members (id, name, role, district, contact, designation, term_start, active, display_order) VALUES
(1, 'Dr. K. Ramakrishna Prasad', 'President', 'Guntur', 'president@aptennikoit.org', 'President', '2025-01-01', TRUE, 1),
(2, 'Shri. P. Venugopal Rao', 'General Secretary', 'Vijayawada', 'secretary@aptennikoit.org', 'General Secretary', '2025-01-01', TRUE, 2),
(3, 'Smt. T. Satyavathi', 'Treasurer', 'Visakhapatnam', 'treasurer@aptennikoit.org', 'Treasurer', '2025-01-01', TRUE, 3),
(4, 'Shri. M. Ravindra Reddi', 'Vice President', 'Kurnool', 'vicepresident@aptennikoit.org', 'Vice President', '2025-01-01', TRUE, 4);

-- 7. Seed Calendar Events
INSERT INTO calendar_events (id, title, description, date_text, location, event_type) VALUES
(1, 'State Selection Trials (Sub-Junior Boys/Girls)', 'Mandatory trials for selecting athletes for Sub-Junior Nationals 2026.', 'June 25, 2026', 'District Stadium, Guntur', 'TOURNAMENT'),
(2, '45th AP State Inter-District Tournament', 'AP state inter-district championship in singles and doubles categories.', 'July 12-15, 2026', 'Vijayawada Sports Complex', 'TOURNAMENT'),
(3, 'APTA Coach Training & License Program', 'Professional certification course for referees and coaches.', 'August 05-08, 2026', 'Swarna Bharati Stadium, Visakhapatnam', 'MEETING');

-- 8. Seed Downloads
INSERT INTO downloads (id, name, size, type, object_name, title, description, file_url, category) VALUES
(1, 'APTA Official Tennikoit Rulebook (Edition 2026)', '2.4 MB', 'PDF', 'rulebook.pdf', 'APTA Official Tennikoit Rulebook (Edition 2026)', 'Official rules guidelines.', '/files/download?objectName=rulebook.pdf', 'RULE_BOOKS'),
(2, 'District Roster Athlete Registration Form (Offline Copy)', '480 KB', 'PDF', 'athlete_form.pdf', 'District Roster Athlete Registration Form (Offline Copy)', 'Registration template.', '/files/download?objectName=athlete_form.pdf', 'FORMS'),
(3, 'Medical and DOB Proof declaration format', '320 KB', 'DOCX', 'dob_declaration.docx', 'Medical and DOB Proof declaration format', 'Medical DOB format.', '/files/download?objectName=dob_declaration.docx', 'FORMS');

-- 9. Seed Tournament Registrations (to link player and certificates)
INSERT INTO tournament_registrations (id, tournament_id, category_id, player_id, payment_id, status) VALUES
(1, 1, 1, 1, NULL, 'CONFIRMED');

-- 10. Seed Certificates
INSERT INTO certificates (id, player_id, registration_id, certificate_type, certificate_number, file_url, issued_by) VALUES
(1, 1, 1, 'PARTICIPATION', 'APTA-CERT-1-84729', 'http://localhost:8082/api/certificates/pdf/APTA-CERT-1-84729', 1);

-- 11. Seed Feedback
INSERT INTO feedback (id, name, email, phone_number, subject, message, rating, player_id, user_id) VALUES
(1, 'Samba Siva Rao', 'samba@gmail.com', '9885012345', 'Excellent Tournament System', 'The new online registration portal is highly convenient and works smoothly on mobile. Thank you for this modern system.', 5, 1, 3),
(2, 'Girish Kumar', 'girish.k@yahoo.com', '8886054321', 'Tournament Timing Suggestion', 'Please schedule sub-junior matches in the evening slots to avoid excessive noon heat.', 4, 2, 4);

-- 12. Seed Audit Logs
INSERT INTO audit_logs (id, user_id, action_type, table_name, record_id, action_details, client_ip) VALUES
(1, 1, 'USER_LOGIN', 'users', 1, 'Super Admin logged in successfully', '127.0.0.1'),
(2, 1, 'CREATE_TOURNAMENT', 'tournaments', 1, 'Created 45th AP State Inter-District Tournament 2026', '127.0.0.1');

-- Adjust ID sequences for serial tables
SELECT setval('users_id_seq', (SELECT MAX(id) FROM users));
SELECT setval('players_id_seq', (SELECT MAX(id) FROM players));
SELECT setval('tournaments_id_seq', (SELECT MAX(id) FROM tournaments));
SELECT setval('tournament_categories_id_seq', (SELECT MAX(id) FROM tournament_categories));
SELECT setval('rankings_id_seq', (SELECT MAX(id) FROM rankings));
SELECT setval('committee_members_id_seq', (SELECT MAX(id) FROM committee_members));
SELECT setval('calendar_events_id_seq', (SELECT MAX(id) FROM calendar_events));
SELECT setval('downloads_id_seq', (SELECT MAX(id) FROM downloads));
SELECT setval('tournament_registrations_id_seq', (SELECT MAX(id) FROM tournament_registrations));
SELECT setval('certificates_id_seq', (SELECT MAX(id) FROM certificates));
SELECT setval('feedback_id_seq', (SELECT MAX(id) FROM feedback));
SELECT setval('audit_logs_id_seq', (SELECT MAX(id) FROM audit_logs));
