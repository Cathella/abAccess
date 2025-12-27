-- ABA Access Database Schema
-- Run this SQL in your Supabase SQL Editor to set up the database

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create custom types (enums)
CREATE TYPE relationship AS ENUM ('child', 'spouse', 'parent', 'sibling', 'other');
CREATE TYPE gender AS ENUM ('male', 'female', 'other');
CREATE TYPE package_status AS ENUM ('active', 'expired', 'exhausted');
CREATE TYPE package_category AS ENUM ('consultations', 'childWellness', 'maternity', 'labTests', 'dental', 'optical');
CREATE TYPE visit_status AS ENUM ('pending', 'confirmed', 'completed', 'cancelled', 'noShow');
CREATE TYPE booking_status AS ENUM ('pending', 'confirmed', 'declined', 'cancelled');
CREATE TYPE transaction_type AS ENUM ('topUp', 'purchase', 'refund');
CREATE TYPE transaction_status AS ENUM ('pending', 'completed', 'failed');
CREATE TYPE payment_provider AS ENUM ('mtnMomo', 'airtelMoney', 'card');
CREATE TYPE notification_type AS ENUM ('approval', 'booking', 'reminder', 'package', 'wallet', 'system');
CREATE TYPE approval_status AS ENUM ('pending', 'approved', 'declined', 'expired');

-- Users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    phone TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    pin TEXT NOT NULL,  -- Bcrypt hashed PIN (not plain text)
    member_id VARCHAR(8) UNIQUE,  -- Unique member identifier (A-XXXXXX)
    nin VARCHAR(14),  -- National ID Number (14 alphanumeric characters)
    avatar TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Dependents table
CREATE TABLE dependents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    relationship relationship NOT NULL,
    date_of_birth DATE NOT NULL,
    gender gender NOT NULL,
    photo TEXT,
    birth_certificate_number TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Family members table (similar to dependents but more general)
CREATE TABLE family_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    relationship relationship NOT NULL,
    date_of_birth DATE NOT NULL,
    gender gender NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Packages table
CREATE TABLE packages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    visit_count INTEGER NOT NULL,
    validity_days INTEGER NOT NULL,
    copay DECIMAL(10, 2) NOT NULL DEFAULT 0,
    category package_category NOT NULL,
    facilities TEXT[] DEFAULT '{}',
    features TEXT[] DEFAULT '{}',
    is_active BOOLEAN DEFAULT TRUE
);

-- User packages table (purchased packages)
CREATE TABLE user_packages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    package_id UUID NOT NULL REFERENCES packages(id),
    purchase_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    expiry_date TIMESTAMPTZ NOT NULL,
    visits_remaining INTEGER NOT NULL,
    visits_used INTEGER DEFAULT 0,
    status package_status DEFAULT 'active'
);

-- Facilities table
CREATE TABLE facilities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    address TEXT NOT NULL,
    latitude DECIMAL(10, 8) NOT NULL,
    longitude DECIMAL(11, 8) NOT NULL,
    phone TEXT NOT NULL,
    rating DECIMAL(3, 2) DEFAULT 0,
    rating_count INTEGER DEFAULT 0,
    services TEXT[] DEFAULT '{}',
    operating_hours JSONB,
    accepts_booking BOOLEAN DEFAULT FALSE,
    is_partner BOOLEAN DEFAULT FALSE
);

-- Visits table
CREATE TABLE visits (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_package_id UUID NOT NULL REFERENCES user_packages(id) ON DELETE CASCADE,
    dependent_id UUID REFERENCES dependents(id) ON DELETE SET NULL,
    facility_id UUID NOT NULL REFERENCES facilities(id),
    visit_date TIMESTAMPTZ NOT NULL,
    status visit_status DEFAULT 'pending',
    copay_paid BOOLEAN DEFAULT FALSE,
    qr_code TEXT NOT NULL UNIQUE,
    provider_notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Bookings table
CREATE TABLE bookings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    visit_id UUID NOT NULL REFERENCES visits(id) ON DELETE CASCADE,
    requested_date DATE NOT NULL,
    requested_time TIME NOT NULL,
    confirmed_date DATE,
    confirmed_time TIME,
    status booking_status DEFAULT 'pending'
);

-- Wallets table
CREATE TABLE wallets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    balance DECIMAL(10, 2) DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Transactions table
CREATE TABLE transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    wallet_id UUID NOT NULL REFERENCES wallets(id) ON DELETE CASCADE,
    type transaction_type NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    description TEXT NOT NULL,
    reference TEXT,
    status transaction_status DEFAULT 'pending',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Payment methods table
CREATE TABLE payment_methods (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type payment_provider NOT NULL,
    provider TEXT NOT NULL,
    account_number TEXT NOT NULL,
    is_default BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Notifications table
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type notification_type NOT NULL,
    title TEXT NOT NULL,
    body TEXT NOT NULL,
    data JSONB,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Approval requests table
CREATE TABLE approval_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_package_id UUID NOT NULL REFERENCES user_packages(id) ON DELETE CASCADE,
    dependent_id UUID NOT NULL REFERENCES dependents(id) ON DELETE CASCADE,
    facility_id UUID NOT NULL REFERENCES facilities(id),
    status approval_status DEFAULT 'pending',
    requested_at TIMESTAMPTZ DEFAULT NOW(),
    responded_at TIMESTAMPTZ,
    expires_at TIMESTAMPTZ NOT NULL
);

-- Create indexes for better performance
CREATE INDEX idx_users_phone ON users(phone);
CREATE INDEX idx_users_member_id ON users(member_id);
CREATE INDEX idx_users_nin ON users(nin);
CREATE INDEX idx_dependents_user_id ON dependents(user_id);
CREATE INDEX idx_family_members_user_id ON family_members(user_id);
CREATE INDEX idx_user_packages_user_id ON user_packages(user_id);
CREATE INDEX idx_user_packages_status ON user_packages(status);
CREATE INDEX idx_visits_user_package_id ON visits(user_package_id);
CREATE INDEX idx_visits_facility_id ON visits(facility_id);
CREATE INDEX idx_visits_qr_code ON visits(qr_code);
CREATE INDEX idx_wallets_user_id ON wallets(user_id);
CREATE INDEX idx_transactions_wallet_id ON transactions(wallet_id);
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_is_read ON notifications(is_read);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add triggers for updated_at columns
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_family_members_updated_at BEFORE UPDATE ON family_members
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_wallets_updated_at BEFORE UPDATE ON wallets
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE dependents ENABLE ROW LEVEL SECURITY;
ALTER TABLE family_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE visits ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE wallets ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_methods ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE approval_requests ENABLE ROW LEVEL SECURITY;

-- RLS Policies for users table
-- Note: In production, you'll need to implement proper authentication-based policies
-- These are simplified policies for development

-- Users can view their own data
CREATE POLICY "Users can view own data" ON users
    FOR SELECT USING (true);

-- Users can update their own data
CREATE POLICY "Users can update own data" ON users
    FOR UPDATE USING (true);

-- Users can insert their own data
CREATE POLICY "Users can insert own data" ON users
    FOR INSERT WITH CHECK (true);

-- Dependents policies
CREATE POLICY "Users can view own dependents" ON dependents
    FOR SELECT USING (true);

CREATE POLICY "Users can insert own dependents" ON dependents
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update own dependents" ON dependents
    FOR UPDATE USING (true);

CREATE POLICY "Users can delete own dependents" ON dependents
    FOR DELETE USING (true);

-- Family members policies
CREATE POLICY "Users can view own family members" ON family_members
    FOR SELECT USING (true);

CREATE POLICY "Users can insert own family members" ON family_members
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update own family members" ON family_members
    FOR UPDATE USING (true);

CREATE POLICY "Users can delete own family members" ON family_members
    FOR DELETE USING (true);

-- Packages are public (all users can view)
CREATE POLICY "Packages are viewable by everyone" ON packages
    FOR SELECT USING (is_active = true);

-- User packages policies
CREATE POLICY "Users can view own packages" ON user_packages
    FOR SELECT USING (true);

CREATE POLICY "Users can insert own packages" ON user_packages
    FOR INSERT WITH CHECK (true);

-- Facilities are public (all users can view)
CREATE POLICY "Facilities are viewable by everyone" ON facilities
    FOR SELECT USING (is_partner = true);

-- Visits policies
CREATE POLICY "Users can view own visits" ON visits
    FOR SELECT USING (true);

CREATE POLICY "Users can insert own visits" ON visits
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update own visits" ON visits
    FOR UPDATE USING (true);

-- Bookings policies
CREATE POLICY "Users can view own bookings" ON bookings
    FOR SELECT USING (true);

CREATE POLICY "Users can insert own bookings" ON bookings
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update own bookings" ON bookings
    FOR UPDATE USING (true);

-- Wallets policies
CREATE POLICY "Users can view own wallet" ON wallets
    FOR SELECT USING (true);

CREATE POLICY "Users can insert own wallet" ON wallets
    FOR INSERT WITH CHECK (true);

-- Transactions policies
CREATE POLICY "Users can view own transactions" ON transactions
    FOR SELECT USING (true);

CREATE POLICY "Users can insert own transactions" ON transactions
    FOR INSERT WITH CHECK (true);

-- Payment methods policies
CREATE POLICY "Users can view own payment methods" ON payment_methods
    FOR SELECT USING (true);

CREATE POLICY "Users can insert own payment methods" ON payment_methods
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update own payment methods" ON payment_methods
    FOR UPDATE USING (true);

CREATE POLICY "Users can delete own payment methods" ON payment_methods
    FOR DELETE USING (true);

-- Notifications policies
CREATE POLICY "Users can view own notifications" ON notifications
    FOR SELECT USING (true);

CREATE POLICY "Users can update own notifications" ON notifications
    FOR UPDATE USING (true);

-- Approval requests policies
CREATE POLICY "Users can view own approval requests" ON approval_requests
    FOR SELECT USING (true);

CREATE POLICY "Users can insert own approval requests" ON approval_requests
    FOR INSERT WITH CHECK (true);

-- Insert some sample data for testing

-- Sample packages
INSERT INTO packages (name, description, price, visit_count, validity_days, copay, category, features) VALUES
    ('Basic Consultation', '3 doctor consultations for basic healthcare needs', 50000, 3, 90, 0, 'consultations', ARRAY['General Checkup', 'Prescription Refills', 'Minor Ailments']),
    ('Child Wellness', '5 visits for child health monitoring and vaccinations', 75000, 5, 180, 0, 'childWellness', ARRAY['Immunizations', 'Growth Monitoring', 'Nutrition Advice']),
    ('Maternity Care', '8 antenatal visits and basic delivery care', 500000, 8, 270, 50000, 'maternity', ARRAY['Antenatal Checkups', 'Ultrasound Scans', 'Delivery Support']),
    ('Lab Tests Bundle', '10 laboratory tests for diagnostics', 120000, 10, 180, 0, 'labTests', ARRAY['Blood Tests', 'Urine Analysis', 'Rapid Tests']),
    ('Dental Care', '3 dental checkups and cleanings', 90000, 3, 180, 10000, 'dental', ARRAY['Cleaning', 'Checkup', 'X-Ray']),
    ('Optical Care', '2 eye exams and basic glasses', 150000, 2, 365, 0, 'optical', ARRAY['Eye Examination', 'Glasses Prescription', 'Vision Test']);

-- Sample facilities
INSERT INTO facilities (name, address, latitude, longitude, phone, rating, rating_count, services, accepts_booking, is_partner) VALUES
    ('Mulago National Referral Hospital', 'Mulago Hill, Kampala', 0.3379, 32.5784, '+256414554000', 4.2, 156, ARRAY['General Medicine', 'Surgery', 'Emergency'], TRUE, TRUE),
    ('Nsambya Hospital', 'Plot 18, Hanlon Road, Nsambya', 0.3009, 32.5923, '+256414267051', 4.5, 203, ARRAY['Maternity', 'Pediatrics', 'Lab Tests'], TRUE, TRUE),
    ('Case Hospital', '69-71 Kanjokya Street, Kamwokya', 0.3371, 32.5903, '+256414258211', 4.3, 178, ARRAY['General Medicine', 'Dental', 'Optical'], TRUE, TRUE),
    ('IHK Hospital', 'Plot 4686, Kisugu-Muyenga', 0.2949, 32.6156, '+256312200400', 4.7, 245, ARRAY['General Medicine', 'Surgery', 'Lab Tests'], TRUE, TRUE),
    ('Kampala International Hospital', 'Plot 20, Hadija Namukasa Road', 0.3015, 32.5923, '+256788994000', 4.4, 189, ARRAY['General Medicine', 'Maternity', 'Pediatrics'], TRUE, TRUE);

-- Note: For production use, you should:
-- 1. PINs are now bcrypt hashed (implemented in lib/supabase/auth.ts)
-- 2. Implement proper RLS policies based on auth.uid()
-- 3. Set up proper authentication with Supabase Auth
-- 4. Add more comprehensive indexes
-- 5. Add data validation constraints
-- 6. Set up database backups
