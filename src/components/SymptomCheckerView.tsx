import React, { useState } from 'react';
import { 
  Stethoscope, 
  CheckCircle2, 
  CalendarCheck, 
  Pill, 
  FolderHeart, 
  ArrowRight,
  RefreshCw,
  Info
} from 'lucide-react';
import { NavigationPillar } from '../types/app';

interface SymptomCheckerViewProps {
  onNavigate: (pillar: NavigationPillar) => void;
  onSaveToVault?: (report: any) => void;
}

const COMMON_SYMPTOMS = [
  'Headache',
  'Fever / Chills',
  'Fatigue',
  'Dry Cough',
  'Shortness of Breath',
  'Chest Tightness',
  'Sore Throat',
  'Abdominal Pain',
  'Dizziness',
  'Joint Pain',
  'Nausea',
  'Muscle Aches',
];

export const SymptomCheckerView: React.FC<SymptomCheckerViewProps> = ({
  onNavigate,
}) => {
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>(['Headache', 'Fatigue']);
  const [customSymptom, setCustomSymptom] = useState('');
  const [durationDays, setDurationDays] = useState(3);
  const [severity, setSeverity] = useState(5);
  const [bodyLocation, setBodyLocation] = useState('Head / Neck');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);

  const toggleSymptom = (sym: string) => {
    setSelectedSymptoms((prev) =>
      prev.includes(sym) ? prev.filter((s) => s !== sym) : [...prev, sym]
    );
  };

  const handleAddCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (customSymptom.trim() && !selectedSymptoms.includes(customSymptom.trim())) {
      setSelectedSymptoms((prev) => [...prev, customSymptom.trim()]);
      setCustomSymptom('');
    }
  };

  const handleAnalyze = async () => {
    if (selectedSymptoms.length === 0) return;
    setIsAnalyzing(true);

    try {
      const res = await fetch('/api/symptoms/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          symptoms: selectedSymptoms,
          durationDays,
          severity,
          bodyLocation,
        }),
      });
      const data = await res.json();
      setAnalysisResult(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="p-8 h-full overflow-y-auto bg-slate-50">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Core Loop Step Indicator Banner */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div className="flex items-center gap-4 text-xs font-semibold">
            <span className="flex items-center gap-1.5 text-sky-700 bg-sky-50 px-3 py-1 rounded-full border border-sky-100">
              <span className="w-4 h-4 rounded-full bg-sky-600 text-white flex items-center justify-center text-[10px]">1</span>
              Ask or Check
            </span>
            <span className="text-slate-300">→</span>
            <span className={`flex items-center gap-1.5 px-3 py-1 rounded-full ${analysisResult ? 'text-sky-700 bg-sky-50 border border-sky-100' : 'text-slate-400 bg-slate-50'}`}>
              <span className="w-4 h-4 rounded-full bg-slate-400 text-white flex items-center justify-center text-[10px]">2</span>
              AI MedGemma Analysis
            </span>
            <span className="text-slate-300">→</span>
            <span className={`flex items-center gap-1.5 px-3 py-1 rounded-full ${analysisResult ? 'text-emerald-700 bg-emerald-50 border border-emerald-100 font-bold' : 'text-slate-400 bg-slate-50'}`}>
              <span className="w-4 h-4 rounded-full bg-slate-400 text-white flex items-center justify-center text-[10px]">3</span>
              Take Action
            </span>
          </div>

          <div className="text-[11px] text-slate-400 flex items-center gap-1">
            <Info className="w-3.5 h-3.5" /> ISO/FHIR Symptom Triage Matrix
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Column: Symptom Selector */}
          <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
            <div>
              <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-1">
                Select Your Symptoms
              </h2>
              <p className="text-xs text-slate-500">
                Choose from common indicators or enter custom clinical terms.
              </p>
            </div>

            {/* Quick chips */}
            <div className="flex flex-wrap gap-2">
              {COMMON_SYMPTOMS.map((sym) => {
                const isSelected = selectedSymptoms.includes(sym);
                return (
                  <button
                    key={sym}
                    onClick={() => toggleSymptom(sym)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-sky-600 text-white shadow-2xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {isSelected && '✓ '}
                    {sym}
                  </button>
                );
              })}
            </div>

            {/* Custom Input */}
            <form onSubmit={handleAddCustom} className="flex gap-2">
              <input
                type="text"
                placeholder="Add other symptom (e.g. Vertigo, Rash)..."
                value={customSymptom}
                onChange={(e) => setCustomSymptom(e.target.value)}
                className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-sky-500"
              />
              <button
                type="submit"
                className="px-3 py-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold rounded-lg cursor-pointer"
              >
                + Add
              </button>
            </form>

            {/* Sliders for Duration, Severity, Location */}
            <div className="space-y-4 pt-4 border-t border-slate-100">
              <div>
                <div className="flex justify-between text-xs font-medium text-slate-700 mb-1">
                  <span>Duration:</span>
                  <span className="font-bold text-sky-600">{durationDays} {durationDays === 1 ? 'day' : 'days'}</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="30"
                  value={durationDays}
                  onChange={(e) => setDurationDays(Number(e.target.value))}
                  className="w-full accent-sky-600 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-medium text-slate-700 mb-1">
                  <span>Severity Scale (1 - 10):</span>
                  <span className={`font-bold ${severity >= 7 ? 'text-rose-600' : 'text-sky-600'}`}>
                    Level {severity}/10
                  </span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={severity}
                  onChange={(e) => setSeverity(Number(e.target.value))}
                  className="w-full accent-sky-600 cursor-pointer"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-slate-700 block mb-1">Primary Body Location:</label>
                <select
                  value={bodyLocation}
                  onChange={(e) => setBodyLocation(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs focus:outline-none focus:border-sky-500 font-medium cursor-pointer"
                >
                  <option value="Head / Neck">Head / Neck / ENT</option>
                  <option value="Chest / Cardiovascular">Chest / Cardiovascular / Respiratory</option>
                  <option value="Abdomen / Gastrointestinal">Abdomen / Gastrointestinal</option>
                  <option value="Musculoskeletal">Musculoskeletal / Joints</option>
                  <option value="Dermatological">Dermatological / Skin</option>
                  <option value="Systemic / Full Body">Systemic / Full Body</option>
                </select>
              </div>
            </div>

            <button
              onClick={handleAnalyze}
              disabled={selectedSymptoms.length === 0 || isAnalyzing}
              className="w-full py-3 bg-sky-600 hover:bg-sky-700 disabled:opacity-50 text-white font-bold rounded-xl text-sm transition-colors flex items-center justify-center gap-2 shadow-sm cursor-pointer"
            >
              {isAnalyzing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Processing MedGemma Diagnostic Model...</span>
                </>
              ) : (
                <>
                  <Stethoscope className="w-4 h-4" />
                  <span>Run Clinical AI Symptom Analysis</span>
                </>
              )}
            </button>
          </div>

          {/* Right Column: AI Analysis Result & 3-Step Action Gateway */}
          <div className="lg:col-span-7 space-y-6">
            {analysisResult ? (
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
                
                {/* Triage Level Header */}
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 block">
                      MedGemma Triage Assessment
                    </span>
                    <h3 className="text-base font-bold text-slate-900 mt-0.5">
                      {analysisResult.summary}
                    </h3>
                  </div>

                  <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                    analysisResult.triageLevel === 'EMERGENCY_IMMEDIATE'
                      ? 'bg-rose-100 text-rose-800 border border-rose-200'
                      : analysisResult.triageLevel === 'HIGH_URGENT_CARE'
                      ? 'bg-amber-100 text-amber-800 border border-amber-200'
                      : 'bg-sky-100 text-sky-800 border border-sky-200'
                  }`}>
                    {analysisResult.triageLevel.replace('_', ' ')}
                  </span>
                </div>

                {/* Differential Diagnoses with ICD-10 */}
                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">
                    Differential Diagnoses (ICD-10 Mapped)
                  </h4>
                  <div className="space-y-3">
                    {analysisResult.differentialDiagnoses?.map((diag: any, i: number) => (
                      <div key={i} className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-slate-800">{diag.condition}</span>
                            <span className="text-[10px] px-1.5 py-0.5 bg-slate-200 text-slate-700 rounded font-mono">
                              ICD: {diag.icd10}
                            </span>
                          </div>
                          <span className="text-xs font-bold text-sky-700">
                            {diag.confidence}% Confidence
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 mt-1">{diag.reasoning}</p>
                        <p className="text-[11px] text-slate-400 mt-1 font-medium">
                          Recommended Specialist: <span className="text-slate-700 font-semibold">{diag.specialist}</span>
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 3-Step Action Cards (Seamless Navigation) */}
                <div>
                  <h4 className="text-xs font-bold text-emerald-600 uppercase tracking-widest mb-3 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" /> Recommended Clinical Actions (Step 3)
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    
                    {/* Action 1: Book Appointment */}
                    <div 
                      onClick={() => onNavigate('appointments')}
                      className="p-3.5 bg-sky-50 hover:bg-sky-100 border border-sky-200 rounded-xl cursor-pointer transition-colors flex flex-col justify-between"
                    >
                      <div>
                        <CalendarCheck className="w-5 h-5 text-sky-600 mb-2" />
                        <p className="text-xs font-bold text-sky-900">Book Doctor Visit</p>
                        <p className="text-[10px] text-sky-700 mt-1">Schedule telehealth with cardiologist/physician.</p>
                      </div>
                      <span className="text-[10px] font-bold text-sky-800 mt-3 flex items-center gap-1">
                        Book Now <ArrowRight className="w-3 h-3" />
                      </span>
                    </div>

                    {/* Action 2: Pharmacy Order */}
                    <div 
                      onClick={() => onNavigate('pharmacy')}
                      className="p-3.5 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-xl cursor-pointer transition-colors flex flex-col justify-between"
                    >
                      <div>
                        <Pill className="w-5 h-5 text-emerald-600 mb-2" />
                        <p className="text-xs font-bold text-emerald-900">Order Medicine</p>
                        <p className="text-[10px] text-emerald-700 mt-1">Get OTC pain relief & hydration delivered in 45m.</p>
                      </div>
                      <span className="text-[10px] font-bold text-emerald-800 mt-3 flex items-center gap-1">
                        Open Pharmacy <ArrowRight className="w-3 h-3" />
                      </span>
                    </div>

                    {/* Action 3: Save to Vault */}
                    <div 
                      onClick={() => onNavigate('records')}
                      className="p-3.5 bg-purple-50 hover:bg-purple-100 border border-purple-200 rounded-xl cursor-pointer transition-colors flex flex-col justify-between"
                    >
                      <div>
                        <FolderHeart className="w-5 h-5 text-purple-600 mb-2" />
                        <p className="text-xs font-bold text-purple-900">Save to Vault</p>
                        <p className="text-[10px] text-purple-700 mt-1">Archive this AI triage to your FHIR medical records.</p>
                      </div>
                      <span className="text-[10px] font-bold text-purple-800 mt-3 flex items-center gap-1">
                        View Records <ArrowRight className="w-3 h-3" />
                      </span>
                    </div>

                  </div>
                </div>

              </div>
            ) : (
              <div className="bg-white p-12 rounded-2xl border border-slate-200 shadow-sm flex flex-col items-center justify-center text-center">
                <div className="w-16 h-16 bg-sky-50 text-sky-600 rounded-full flex items-center justify-center mb-4">
                  <Stethoscope className="w-8 h-8" />
                </div>
                <h3 className="text-base font-bold text-slate-800 mb-1">
                  Ready for Symptom Assessment
                </h3>
                <p className="text-xs text-slate-400 max-w-sm">
                  Select your symptoms on the left and click "Run Clinical AI Symptom Analysis" to generate an ICD-10 mapped assessment and actionable care plan.
                </p>
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};
