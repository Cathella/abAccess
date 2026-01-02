-- Add metadata column to transactions table for storing extended transaction details
-- This allows storing payment method info, fees, package details, etc.

ALTER TABLE transactions ADD COLUMN IF NOT EXISTS metadata JSONB;

-- Add GIN index for efficient JSONB queries
CREATE INDEX IF NOT EXISTS idx_transactions_metadata ON transactions USING GIN (metadata);

-- Add index for sorting by creation date (most recent first)
CREATE INDEX IF NOT EXISTS idx_transactions_created_at ON transactions(created_at DESC);

-- Add comment explaining metadata structure
COMMENT ON COLUMN transactions.metadata IS 'JSONB field storing extended transaction details: paymentMethod, phoneNumber, cardLast4, cardBrand, packageName, packageVisits, fee';
