/*
  # Add password column to artists table

  1. Changes
    - Add password column to artists table
    - Add passwords for Yuno $weez and J@M@R

  2. Security
    - Passwords are stored for demo purposes only
    - In production, use proper authentication
*/

ALTER TABLE artists ADD COLUMN IF NOT EXISTS password TEXT;

UPDATE artists 
SET password = CASE 
  WHEN name = 'Yuno $weez' THEN 'Benkifiya1'
  WHEN name = 'J@M@R' THEN 'jamar123'
  ELSE password
END
WHERE password IS NULL;
