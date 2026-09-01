import React from 'react';
import { Bell, HeartPulse, CheckCircle2 } from 'lucide-react';
import { NavigationPillar } from '../types/app';

interface HeaderProps {
  currentPillar: NavigationPillar;
  onQuickAction: (pillar: NavigationPillar) => void;
  alertsCount?: number;
}

const PILLAR_TITLES: Record<NavigationPillar, { title: string; subtitle: string }> = {
  dashboard: { title: 'Health Overview', subtitle: 'Real-time personalized monitoring & triage hub' },
  'ai-chat': { title: 'Sanjeevani AI Assistant', subtitle: 'Powered by MedGemma & Vertex AI' },
  symptoms: { title: 'Interactive Symptom Checker', subtitle: 'Clinical AI differential diagnosis & 3-step action' },
  analysis: { title: 'Health Score & Metabolic Analysis', subtitle: 'Dynamic composite rating based on sleep, activity & stress' },
  records: { title: 'FHIR Health Records Vault', subtitle: 'Secure AES-256 encrypted clinical documents & DICOM' },
  appointments: { title: 'Appointments & Telehealth', subtitle: 'Schedule visits with certified doctors & specialists' },
  pharmacy: { title: 'Pharmacy & Prescriptions', subtitle: 'Browse, order, and track prescription & OTC medicines' },
  'blood-bank': { title: 'Emergency Blood Bank Matcher', subtitle: 'Instant geo-radius matching for emergency blood requests' },
  'family-hub': { title: 'Family Health Hub', subtitle: 'Manage household dependents, alerts, and shared medical logs' },
};

export const Header: React.FC<HeaderProps> = ({
  currentPillar,
  onQuickAction,
  alertsCount = 2,
}) => {
  const currentMeta = PILLAR_TITLES[currentPillar] || PILLAR_TITLES.dashboard;

  return (
    <header className="h-16 bg-white border-b border-slate-200 px-8 flex items-center justify-between shrink-0">
      <div>
        <h1 className="text-lg font-semibold text-slate-800 leading-none">
          {currentMeta.title}
        </h1>
        <p className="text-xs text-slate-400 mt-1">{currentMeta.subtitle}</p>
      </div>

      <div className="flex items-center gap-4">
        {/* FHIR Connected Status */}
        <div className="flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-full">
          <span className="flex h-2 w-2 rounded-full bg-emerald-500"></span>
          <span className="text-xs font-medium">FHIR R4 Connected</span>
        </div>

        {/* Emergency Blood Match Trigger Button */}
        <button
          onClick={() => onQuickAction('blood-bank')}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 rounded-lg text-xs font-bold transition-colors"
        >
          <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
          Emergency Blood Match
        </button>

        {/* Notifications Pill */}
        <div className="flex items-center gap-2 px-3 py-1 bg-slate-100 rounded-full text-slate-600">
          <Bell className="w-3.5 h-3.5 text-slate-500" />
          <span className="text-xs font-semibold">{alertsCount} Notifications</span>
        </div>
      </div>
    </header>
  );
};
