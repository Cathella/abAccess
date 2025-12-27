-- Add member_id and nin columns to users table
-- Migration created: 2023-12-27

-- Add member_id column (unique identifier for members, format: A-XXXXXX)
ALTER TABLE users
ADD COLUMN member_id VARCHAR(8) UNIQUE;

-- Add nin column (National ID Number for Uganda, 14 characters)
ALTER TABLE users
ADD COLUMN nin VARCHAR(14);

-- Create index on member_id for faster lookups
CREATE INDEX idx_users_member_id ON users(member_id);

-- Create index on nin for faster lookups
CREATE INDEX idx_users_nin ON users(nin);

-- Add comment to columns for documentation
COMMENT ON COLUMN users.member_id IS 'Unique member identifier in format A-XXXXXX';
COMMENT ON COLUMN users.nin IS 'National ID Number (NIN) - 14 alphanumeric characters';
