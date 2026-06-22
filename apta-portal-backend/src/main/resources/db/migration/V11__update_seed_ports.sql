-- V11__update_seed_ports.sql
UPDATE gallery_items 
SET media_url = REPLACE(media_url, '8080', '8082'),
    thumbnail_url = REPLACE(thumbnail_url, '8080', '8082');

UPDATE downloads 
SET file_url = REPLACE(file_url, '8080', '8082');

UPDATE tournaments 
SET brochure_url = REPLACE(brochure_url, '8080', '8082');

UPDATE certificates 
SET file_url = REPLACE(file_url, '8080', '8082');
