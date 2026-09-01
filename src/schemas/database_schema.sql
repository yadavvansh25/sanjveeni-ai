-- ============================================================================
-- Sanjeevani AI PostgreSQL DDL Schema
-- Relational Models: Users, Family Hub, Healthcare Providers, Appointments,
-- Blood Bank & Pharmacy
-- Standards: ISO 8601, UUID v4, RBAC, FHIR mappings
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "citext";

-- Enum Definitions
CREATE TYPE user_role_enum AS ENUM (
    'PATIENT',
    'PRIMARY_FAMILY_ADMIN',
    'FAMILY_MEMBER',
    'DOCTOR',
    'PHARMACIST',
    'BLOOD_BANK_COORDINATOR',
    'ADMIN'
);

CREATE TYPE gender_enum AS ENUM ('MALE', 'FEMALE', 'NON_BINARY', 'PREFER_NOT_TO_SAY');

CREATE TYPE blood_group_enum AS ENUM ('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-');

CREATE TYPE appointment_type_enum AS ENUM (
    'TELEHEALTH_VIDEO',
    'IN_CLINIC',
    'HOME_VISIT',
    'AI_TRIAGE_FOLLOWUP'
);

CREATE TYPE appointment_status_enum AS ENUM (
    'SCHEDULED',
    'CONFIRMED',
    'IN_PROGRESS',
    'COMPLETED',
    'CANCELLED',
    'RESCHEDULED'
);

CREATE TYPE payment_status_enum AS ENUM ('PENDING', 'PAID', 'REFUNDED');

-- 1. Users Table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email CITEXT UNIQUE NOT NULL,
    phone_number VARCHAR(20) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(150) NOT NULL,
    date_of_birth DATE NOT NULL,
    gender gender_enum NOT NULL DEFAULT 'PREFER_NOT_TO_SAY',
    blood_group blood_group_enum,
    role user_role_enum NOT NULL DEFAULT 'PATIENT',
    is_verified BOOLEAN NOT NULL DEFAULT FALSE,
    two_factor_enabled BOOLEAN NOT NULL DEFAULT FALSE,
    national_health_id VARCHAR(50) UNIQUE, -- ABHA / National Health Identifier
    primary_family_id UUID,
    emergency_contact_phone VARCHAR(20),
    address_line1 VARCHAR(255),
    city VARCHAR(100),
    state VARCHAR(100),
    postal_code VARCHAR(20),
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Family Hub Accounts
CREATE TABLE IF NOT EXISTS family_accounts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    family_name VARCHAR(150) NOT NULL,
    primary_admin_user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    household_code VARCHAR(16) UNIQUE NOT NULL,
    max_members INT DEFAULT 8,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE users 
    ADD CONSTRAINT fk_user_family 
    FOREIGN KEY (primary_family_id) 
    REFERENCES family_accounts(id) 
    ON DELETE SET NULL;

-- 3. Family Members Table (For dependents and sub-accounts under one household)
CREATE TABLE IF NOT EXISTS family_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    family_account_id UUID NOT NULL REFERENCES family_accounts(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    relationship VARCHAR(50) NOT NULL, -- e.g. 'SELF', 'SPOUSE', 'CHILD', 'PARENT'
    display_name VARCHAR(150) NOT NULL,
    date_of_birth DATE NOT NULL,
    gender gender_enum NOT NULL DEFAULT 'PREFER_NOT_TO_SAY',
    blood_group blood_group_enum,
    allergies TEXT[] DEFAULT ARRAY[]::TEXT[],
    chronic_conditions TEXT[] DEFAULT ARRAY[]::TEXT[],
    emergency_access_granted BOOLEAN DEFAULT TRUE,
    can_manage_appointments BOOLEAN DEFAULT TRUE,
    can_view_records BOOLEAN DEFAULT TRUE,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. Healthcare Providers (Doctors, Telehealth Specialists)
CREATE TABLE IF NOT EXISTS healthcare_providers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    license_number VARCHAR(100) UNIQUE NOT NULL,
    specialty VARCHAR(100) NOT NULL,
    qualification VARCHAR(100) NOT NULL,
    years_experience INT NOT NULL DEFAULT 0,
    clinic_hospital_name VARCHAR(200) NOT NULL,
    consultation_fee NUMERIC(10,2) NOT NULL DEFAULT 0.00,
    rating_avg NUMERIC(3,2) DEFAULT 5.00,
    total_reviews INT DEFAULT 0,
    is_telehealth_available BOOLEAN DEFAULT TRUE,
    available_languages TEXT[] DEFAULT ARRAY['English']::TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. Appointments Table
CREATE TABLE IF NOT EXISTS appointments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    family_member_id UUID REFERENCES family_members(id) ON DELETE SET NULL,
    provider_id UUID NOT NULL REFERENCES healthcare_providers(id) ON DELETE RESTRICT,
    appointment_type appointment_type_enum NOT NULL DEFAULT 'TELEHEALTH_VIDEO',
    status appointment_status_enum NOT NULL DEFAULT 'CONFIRMED',
    scheduled_start_time TIMESTAMP WITH TIME ZONE NOT NULL,
    scheduled_end_time TIMESTAMP WITH TIME ZONE NOT NULL,
    chief_complaint TEXT NOT NULL,
    symptom_checker_session_id VARCHAR(64), -- Reference to Mongo Symptom Session ObjectId
    ai_pre_consultation_summary TEXT,
    telehealth_room_url TEXT,
    cancellation_reason TEXT,
    payment_status payment_status_enum NOT NULL DEFAULT 'PENDING',
    consultation_fee NUMERIC(10,2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance & quick lookups
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_phone ON users(phone_number);
CREATE INDEX IF NOT EXISTS idx_users_family ON users(primary_family_id);
CREATE INDEX IF NOT EXISTS idx_family_members_account ON family_members(family_account_id);
CREATE INDEX IF NOT EXISTS idx_appointments_patient ON appointments(patient_user_id);
CREATE INDEX IF NOT EXISTS idx_appointments_provider ON appointments(provider_id);
CREATE INDEX IF NOT EXISTS idx_appointments_schedule ON appointments(scheduled_start_time, status);
