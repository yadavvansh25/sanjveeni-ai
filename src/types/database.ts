/**
 * Sanjeevani AI - Unified Healthcare Architecture Type Definitions
 * Relational (PostgreSQL) + Document (MongoDB / FHIR R4) Schemas
 */

export type UserRole = 'PATIENT' | 'PRIMARY_FAMILY_ADMIN' | 'FAMILY_MEMBER' | 'DOCTOR' | 'PHARMACIST' | 'BLOOD_BANK_COORDINATOR' | 'ADMIN';

export type BloodGroup = 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';

export type AppointmentStatus = 'SCHEDULED' | 'CONFIRMED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED' | 'RESCHEDULED';
export type AppointmentType = 'TELEHEALTH_VIDEO' | 'IN_CLINIC' | 'HOME_VISIT' | 'AI_TRIAGE_FOLLOWUP';

export type RecordCategory = 'LAB_REPORT' | 'PRESCRIPTION' | 'DISCHARGE_SUMMARY' | 'VACCINATION' | 'IMAGING_DICOM' | 'VITALS_LOG' | 'AI_TRIAGE_SUMMARY';

/* =========================================================================
   1. PostgreSQL RELATIONAL SCHEMAS
   ========================================================================= */

/** PostgreSQL: users table */
export interface UserRecord {
  id: string; // UUID primary key
  email: string;
  phone_number: string;
  password_hash: string; // Argon2 / bcrypt
  full_name: string;
  date_of_birth: string; // ISO date
  gender: 'MALE' | 'FEMALE' | 'NON_BINARY' | 'PREFER_NOT_TO_SAY';
  blood_group?: BloodGroup;
  role: UserRole;
  is_verified: boolean;
  two_factor_enabled: boolean;
  national_health_id?: string; // ABHA / Ayushman Bharat or standard Health ID
  primary_family_id?: string; // Foreign key to family_accounts
  emergency_contact_phone?: string;
  address_line1?: string;
  city?: string;
  state?: string;
  postal_code?: string;
  latitude?: number;
  longitude?: number;
  created_at: string;
  updated_at: string;
}

/** PostgreSQL: family_accounts table */
export interface FamilyAccountRecord {
  id: string; // UUID
  family_name: string;
  primary_admin_user_id: string; // Foreign key to users.id
  household_code: string; // Unique joining code
  max_members: number; // default 8
  created_at: string;
  updated_at: string;
}

/** PostgreSQL: family_members table */
export interface FamilyMemberRecord {
  id: string; // UUID
  family_account_id: string; // Foreign key to family_accounts.id
  user_id?: string; // Optional: linked registered user account
  relationship: 'SELF' | 'SPOUSE' | 'CHILD' | 'PARENT' | 'SIBLING' | 'GUARDIAN' | 'DEPENDENT';
  display_name: string;
  date_of_birth: string;
  gender: string;
  blood_group?: BloodGroup;
  allergies: string[]; // PG Text[] array
  chronic_conditions: string[]; // PG Text[] array
  emergency_access_granted: boolean;
  can_manage_appointments: boolean;
  can_view_records: boolean;
  avatar_url?: string;
  created_at: string;
}

/** PostgreSQL: healthcare_providers table */
export interface HealthcareProviderRecord {
  id: string; // UUID
  user_id: string; // Foreign key to users.id
  license_number: string;
  specialty: string; // e.g. Cardiology, General Medicine, Pediatrics
  qualification: string; // e.g. MBBS, MD, DM
  years_experience: number;
  clinic_hospital_name: string;
  consultation_fee: number; // In currency units
  rating_avg: number; // 0.0 - 5.0
  total_reviews: number;
  is_telehealth_available: boolean;
  available_languages: string[];
  created_at: string;
}

/** PostgreSQL: appointments table */
export interface AppointmentRecord {
  id: string; // UUID
  patient_user_id: string; // Foreign key to users.id
  family_member_id?: string; // Foreign key to family_members.id if booked for dependent
  provider_id: string; // Foreign key to healthcare_providers.id
  provider_name?: string;
  specialty?: string;
  appointment_type: AppointmentType;
  status: AppointmentStatus;
  scheduled_start_time: string; // ISO datetime
  scheduled_end_time: string; // ISO datetime
  chief_complaint: string;
  symptom_checker_session_id?: string; // Foreign key to MongoDB symptom session
  ai_pre_consultation_summary?: string;
  telehealth_room_url?: string;
  cancellation_reason?: string;
  payment_status: 'PENDING' | 'PAID' | 'REFUNDED';
  consultation_fee: number;
  created_at: string;
  updated_at: string;
}

/* =========================================================================
   2. MongoDB / NO-SQL & FHIR R4 SCHEMAS
   ========================================================================= */

/** MongoDB Collection: health_records (FHIR R4 Compliant Document) */
export interface MongoHealthRecord {
  _id: string; // MongoDB ObjectId
  fhir_resource_type: 'DiagnosticReport' | 'Observation' | 'Condition' | 'MedicationRequest' | 'DocumentReference';
  patient_id: string; // UUID mapping to PostgreSQL users.id or family_members.id
  primary_user_id: string; // Parent account ID
  record_title: string;
  category: RecordCategory;
  issued_date: string;
  provider_name?: string;
  facility_name?: string;
  
  // Encrypted PHI payload (AES-256-GCM)
  is_encrypted: boolean;
  encryption_metadata?: {
    algorithm: 'AES-256-GCM';
    key_id: string;
    iv: string;
    auth_tag: string;
  };

  // Structured FHIR Coding (LOINC / SNOMED CT / ICD-10)
  coding?: {
    system: string; // e.g. "http://loinc.org" or "http://hl7.org/fhir/sid/icd-10"
    code: string;
    display: string;
  }[];

  // Clinical measurements & findings (Observations)
  vital_signs?: {
    blood_pressure_systolic?: number;
    blood_pressure_diastolic?: number;
    heart_rate_bpm?: number;
    sp_o2_percentage?: number;
    body_temperature_celsius?: number;
    respiratory_rate_bpm?: number;
    glucose_mg_dl?: number;
  };

  // Lab Results array
  lab_results?: {
    test_name: string;
    measured_value: number | string;
    unit: string;
    reference_range: string;
    interpretation: 'NORMAL' | 'ELEVATED' | 'LOW' | 'CRITICAL';
  }[];

  // Prescriptions extracted
  medications?: {
    name: string;
    dosage: string;
    frequency: string;
    duration_days: number;
    instructions: string;
  }[];

  // AI-Assisted Clinical Extraction & OCR
  ai_summary?: string;
  ai_key_findings?: string[];
  ai_followup_recommendations?: string[];

  // Attachments / DICOM imaging links
  attachments?: {
    file_name: string;
    file_type: 'application/pdf' | 'image/png' | 'image/jpeg' | 'application/dicom';
    storage_uri: string;
    file_size_bytes: number;
    dicom_study_instance_uid?: string;
  }[];

  tags: string[];
  created_at: string;
  updated_at: string;
}

/** MongoDB Collection: symptom_checker_sessions */
export interface MongoSymptomSession {
  _id: string;
  user_id: string;
  family_member_id?: string;
  reported_symptoms: {
    symptom_name: string;
    severity_scale_1_to_10: number;
    duration_days: number;
    body_location?: string;
    aggravating_factors?: string[];
  }[];
  triage_level: 'EMERGENCY_IMMEDIATE' | 'HIGH_URGENT_CARE' | 'MODERATE_TELEHEALTH' | 'LOW_SELF_CARE';
  differential_diagnoses: {
    condition_name: string;
    icd10_code: string;
    confidence_percentage: number;
    reasoning: string;
    recommended_specialist: string;
  }[];
  medgemma_reasoning_trace?: string;
  milvus_vector_embedding_id?: string;
  recommended_actions: {
    action_type: 'BOOK_APPOINTMENT' | 'ORDER_MEDICINE' | 'EMERGENCY_BLOOD_REQUEST' | 'SAVE_TO_VAULT';
    description: string;
    priority: number;
  }[];
  is_resolved: boolean;
  created_at: string;
}

/** MongoDB Collection: health_score_daily_metrics */
export interface MongoHealthScoreMetric {
  _id: string;
  user_id: string;
  date: string; // YYYY-MM-DD
  composite_score: number; // 0 - 100
  breakdown: {
    sleep_quality: {
      score: number; // 0 - 25
      hours_slept: number;
      deep_sleep_ratio: number;
      status: 'EXCELLENT' | 'GOOD' | 'FAIR' | 'POOR';
    };
    activity: {
      score: number; // 0 - 25
      steps_count: number;
      active_minutes: number;
      calories_burned: number;
      status: 'EXCELLENT' | 'GOOD' | 'FAIR' | 'POOR';
    };
    nutrition: {
      score: number; // 0 - 25
      water_intake_ml: number;
      balanced_meals_ratio: number;
      status: 'EXCELLENT' | 'GOOD' | 'FAIR' | 'POOR';
    };
    stress_management: {
      score: number; // 0 - 25
      hrv_ms: number;
      mindfulness_minutes: number;
      status: 'EXCELLENT' | 'GOOD' | 'FAIR' | 'POOR';
    };
  };
  ai_coaching_tip: string;
  created_at: string;
}
