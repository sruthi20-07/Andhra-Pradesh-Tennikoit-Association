-- V2__fix_download_size.sql
ALTER TABLE downloads ALTER COLUMN size TYPE BIGINT USING size::BIGINT;
