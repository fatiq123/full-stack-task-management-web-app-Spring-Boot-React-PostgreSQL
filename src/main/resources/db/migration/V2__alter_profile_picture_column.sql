-- Alter the profile_picture column to use TEXT type instead of VARCHAR(255)
ALTER TABLE users ALTER COLUMN profile_picture TYPE TEXT;
