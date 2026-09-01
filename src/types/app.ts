export type NavigationPillar = 
  | 'dashboard'
  | 'ai-chat'
  | 'symptoms'
  | 'analysis'
  | 'records'
  | 'appointments'
  | 'pharmacy'
  | 'blood-bank'
  | 'family-hub';

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  suggestedAction?: {
    label: string;
    targetPillar: NavigationPillar;
  };
}

export interface PharmacyItem {
  id: string;
  name: string;
  genericName: string;
  category: 'Prescription' | 'OTC' | 'Supplements' | 'First Aid' | 'Chronic Care';
  dosage: string;
  price: number;
  inStock: boolean;
  requiresPrescription: boolean;
  rating: number;
  deliveryTime: string;
  imageUrl?: string;
}

export interface PharmacyOrder {
  id: string;
  items: { item: PharmacyItem; quantity: number }[];
  totalAmount: number;
  status: 'PROCESSING' | 'DISPATCHED' | 'OUT_FOR_DELIVERY' | 'DELIVERED';
  deliveryAddress: string;
  orderDate: string;
  estimatedDelivery: string;
}

export interface BloodRequest {
  id: string;
  patientName: string;
  bloodGroup: string;
  unitsRequired: number;
  hospitalName: string;
  urgency: 'CRITICAL_1HR' | 'HIGH_4HRS' | 'MODERATE_24HRS';
  matchedDonorsCount: number;
  status: 'SEARCHING' | 'MATCHED' | 'FULFILLED';
  requestedAt: string;
}

export interface FamilyMember {
  id: string;
  name: string;
  relation: string;
  age: number;
  bloodGroup: string;
  allergies: string[];
  chronicConditions: string[];
  avatarColor: string;
  healthScore: number;
  pendingAlerts: number;
  lastCheckup: string;
}

export interface Appointment {
  id: string;
  doctorName: string;
  specialty: string;
  clinicName: string;
  date: string;
  time: string;
  type: 'Telehealth Video' | 'In-Clinic Visit' | 'Follow-up';
  status: 'Upcoming' | 'Completed' | 'Cancelled';
  telehealthUrl?: string;
  forMemberName: string;
}

export interface HealthRecordItem {
  id: string;
  title: string;
  category: 'Lab Report' | 'Prescription' | 'Vaccination' | 'Imaging (DICOM)' | 'Discharge Summary';
  date: string;
  doctorOrLab: string;
  patientName: string;
  fhirType: string;
  fileSize: string;
  tags: string[];
  findingsSummary: string;
  status: 'Verified' | 'Pending Review';
}
