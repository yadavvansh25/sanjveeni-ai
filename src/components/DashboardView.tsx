import React from 'react';
import { 
  Sparkles, 
  ChevronRight, 
  Pill, 
  Droplet, 
  Moon, 
  Footprints, 
  Stethoscope, 
  ArrowRight,
  Video
} from 'lucide-react';
import { NavigationPillar, FamilyMember, Appointment, PharmacyOrder } from '../types/app';

interface DashboardViewProps {
  onNavigate: (pillar: NavigationPillar) => void;
  familyMembers: FamilyMember[];
  appointments: Appointment[];
  orders: PharmacyOrder[];
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  onNavigate,
  familyMembers,
  appointments,
  orders,
}) => {
  const nextAppointment = appointments[0];
  const activeOrder = orders[0];

  return (
    <div className="p-8 h-full overflow-y-auto">
      <div className="grid grid-cols-12 gap-6 max-w-7xl mx-auto">
        
        {/* 1. Health Score Ring Card (Clean Minimalism Aesthetic) */}
        <div 
          onClick={() => onNavigate('analysis')}
          className="col-span-12 lg:col-span-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col items-center justify-center relative cursor-pointer hover:border-sky-300 transition-colors"
        >
          <div className="text-xs font-bold text-slate-400 uppercase tracking-widest absolute top-6 left-6">
            Analysis Score
          </div>
          
          {/* Circular SVG Gauge */}
          <div className="w-40 h-40 rounded-full border-[10px] border-slate-50 flex items-center justify-center relative my-4">
            <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="42"
                fill="transparent"
                stroke="#e2e8f0"
                strokeWidth="8"
              />
              <circle
                cx="50"
                cy="50"
                r="42"
                fill="transparent"
                stroke="#0284c7"
                strokeWidth="8"
                strokeDasharray="264"
                strokeDashoffset="42"
                strokeLinecap="round"
              />
            </svg>
            <div className="text-center z-10">
              <span className="text-5xl font-light text-slate-900">84</span>
              <p className="text-xs text-sky-600 font-semibold mt-0.5">Excellent</p>
            </div>
          </div>

          <div className="w-full grid grid-cols-2 gap-4 border-t border-slate-100 pt-4">
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 text-[10px] uppercase text-slate-400 font-bold mb-1">
                <Moon className="w-3 h-3 text-indigo-400" /> Sleep
              </div>
              <p className="text-sm font-semibold text-slate-800">7h 45m</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 text-[10px] uppercase text-slate-400 font-bold mb-1">
                <Footprints className="w-3 h-3 text-emerald-500" /> Activity
              </div>
              <p className="text-sm font-semibold text-slate-800">9.2k Steps</p>
            </div>
          </div>
        </div>

        {/* 2. MedGemma AI Insight Hero Card */}
        <div className="col-span-12 lg:col-span-8 bg-sky-600 p-6 rounded-2xl shadow-md text-white flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-sky-200" />
                <span className="text-sm font-semibold text-sky-100">Sanjeevani AI Insight</span>
              </div>
              <span className="text-[10px] px-2 py-0.5 bg-sky-500/80 rounded-full font-bold uppercase tracking-wider text-sky-100">
                Live Analysis
              </span>
            </div>

            <h2 className="text-2xl font-normal leading-snug mb-3">
              "Your heart rate variability indicates mild autonomic stress. Considering your upcoming Cardiology consultation at 10:30 AM, I have compiled your weekly vitals summary."
            </h2>
            <p className="text-sky-100/70 text-sm">
              Powered by MedGemma 2.5 Clinical Model • Continuous FHIR Integration
            </p>
          </div>

          <div className="flex flex-wrap gap-3 mt-6">
            <button
              onClick={() => onNavigate('symptoms')}
              className="px-4 py-2 bg-white text-sky-700 hover:bg-sky-50 rounded-lg text-sm font-bold shadow-sm transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Stethoscope className="w-4 h-4" />
              Check Current Symptoms
            </button>
            <button
              onClick={() => onNavigate('ai-chat')}
              className="px-4 py-2 bg-sky-500 hover:bg-sky-400 text-white rounded-lg text-sm font-bold border border-sky-400 transition-colors cursor-pointer"
            >
              Ask Sanjeevani AI
            </button>
          </div>
        </div>

        {/* 3. Upcoming Visits & Appointments */}
        <div className="col-span-12 lg:col-span-4 space-y-6">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                Upcoming Visits
              </h3>
              <button 
                onClick={() => onNavigate('appointments')}
                className="text-[11px] font-bold text-sky-600 hover:underline cursor-pointer"
              >
                View All
              </button>
            </div>

            {nextAppointment ? (
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-rose-50 text-rose-600 rounded-xl flex flex-col items-center justify-center shrink-0">
                  <span className="text-[10px] font-bold uppercase">TODAY</span>
                  <span className="text-lg font-bold leading-none">10:30</span>
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-800">{nextAppointment.doctorName}</p>
                  <p className="text-xs text-slate-500">{nextAppointment.specialty}</p>
                  <div className="mt-2 inline-flex items-center gap-1 px-2 py-0.5 bg-sky-50 text-sky-700 rounded text-[10px] font-semibold">
                    <Video className="w-3 h-3" /> Telehealth Link Ready
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-400">No scheduled visits.</p>
            )}
          </div>

          {/* Family Alerts Widget */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                Family Alerts
              </h3>
              <button 
                onClick={() => onNavigate('family-hub')}
                className="text-[11px] font-bold text-sky-600 hover:underline cursor-pointer"
              >
                Family Hub
              </button>
            </div>

            <div className="space-y-2.5">
              <div 
                onClick={() => onNavigate('family-hub')}
                className="flex items-center justify-between p-2 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-2.5 h-2.5 rounded-full bg-sky-500"></div>
                  <div>
                    <span className="text-sm font-medium text-slate-800 block">Mother (Martha)</span>
                    <span className="text-[11px] text-slate-400">Prescription Refill Needed</span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-300" />
              </div>

              <div 
                onClick={() => onNavigate('family-hub')}
                className="flex items-center justify-between p-2 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500"></div>
                  <div>
                    <span className="text-sm font-medium text-slate-800 block">Son (Leo)</span>
                    <span className="text-[11px] text-slate-400">School Physical Form Logged</span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-300" />
              </div>
            </div>
          </div>
        </div>

        {/* 4. Pharmacy & Emergency Blood Bank Matchers */}
        <div className="col-span-12 lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Pharmacy Card */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                  <Pill className="w-3.5 h-3.5 text-sky-500" /> Pharmacy Orders
                </h3>
                <button
                  onClick={() => onNavigate('pharmacy')}
                  className="text-[10px] font-bold text-sky-600 hover:text-sky-700 cursor-pointer"
                >
                  NEW ORDER +
                </button>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                <p className="text-xs font-semibold text-slate-800">
                  {activeOrder ? activeOrder.items[0]?.item.name : 'Atorvastatin 20mg'}
                </p>
                <p className="text-[10px] text-slate-500 mt-1">
                  Scheduled: Out for Delivery in 45 mins
                </p>
              </div>
            </div>

            <button
              onClick={() => onNavigate('pharmacy')}
              className="mt-4 w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold transition-colors flex items-center justify-center gap-1 cursor-pointer"
            >
              Track Prescription Delivery <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          {/* Blood Bank Alert Card */}
          <div className="bg-rose-50 p-5 rounded-2xl border border-rose-100 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-xs font-bold text-rose-500 uppercase tracking-widest flex items-center gap-1.5">
                  <Droplet className="w-3.5 h-3.5 text-rose-600" /> Blood Bank Match
                </h3>
                <span className="animate-pulse w-2.5 h-2.5 rounded-full bg-rose-500"></span>
              </div>

              <p className="text-sm font-bold text-rose-950">
                Emergency O+ Request Near You
              </p>
              <p className="text-xs text-rose-700 mt-1">
                St. Mary's General • 1.2km away • 2 Units Needed
              </p>
            </div>

            <button
              onClick={() => onNavigate('blood-bank')}
              className="mt-4 w-full py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-bold shadow-sm transition-colors cursor-pointer"
            >
              Respond as Donor / Match Units
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
