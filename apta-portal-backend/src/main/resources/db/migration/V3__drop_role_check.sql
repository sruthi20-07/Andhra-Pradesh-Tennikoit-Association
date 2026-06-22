-- V3__drop_role_check.sql
ALTER TABLE users DROP CONSTRAINT IF EXISTS users_role_check;
