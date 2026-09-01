import React, { useState } from 'react';
import { 
  Moon, 
  Footprints, 
  Droplets, 
  HeartHandshake, 
  Sparkles
} from 'lucide-react';
import { NavigationPillar } from '../types/app';

interface HealthScoreAnalysisViewProps {
  onNavigate: (pillar: NavigationPillar) => void;
}

export const HealthScoreAnalysisView: React.FC<HealthScoreAnalysisViewProps> = ({ onNavigate }) => {
  const [sleepHours, setSleepHours] = useState(7.5);
  const [steps, setSteps] = useState(9200);
  const [waterMl, setWaterMl] = useState(2500);
  const [hrvMs, setHrvMs] = useState(58);

  // Compute 100-point composite score dynamically
  const sleepScore = Math.min(25, Math.round((Math.min(sleepHours, 8) / 8) * 25));
  const activityScore = Math.min(25, Math.round((Math.min(steps, 10000) / 10000) * 25));
  const nutritionScore = Math.min(25, Math.round((Math.min(waterMl, 3000) / 3000) * 25));
  const stressScore = Math.min(25, Math.round((Math.min(hrvMs, 65) / 65) * 25));
  const totalScore = sleepScore + activityScore + nutritionScore + stressScore;

  return (
    <div className="p-8 h-full overflow-y-auto bg-slate-50">
      <div className="max-w-5xl mx-auto space-y-6">
        
        {/* Top Summary Banner */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 rounded-full border-8 border-sky-500 flex items-center justify-center shrink-0">
              <span className="text-3xl font-light text-slate-900">{totalScore}</span>
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-sky-600">
                Composite Health Rating (Out of 100)
              </span>
              <h2 className="text-xl font-bold text-slate-800 mt-0.5">
                {totalScore >= 85 ? 'Optimal Physiological State' : 'Good Recovery Baseline'}
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Calculated across 4 vital pillars: Sleep Quality, Daily Activity, Hydration/Nutrition, and Stress/HRV.
              </p>
            </div>
          </div>

          <button
            onClick={() => onNavigate('ai-chat')}
            className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm shrink-0 cursor-pointer"
          >
            <Sparkles className="w-4 h-4" /> Get AI Coaching Advice
          </button>
        </div>

        {/* 4 Quadrants Interactive Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Quadrant 1: Sleep Quality */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                  <Moon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-800">Sleep Quality</h3>
                  <p className="text-[11px] text-slate-400">Target: 8.0 hrs</p>
                </div>
              </div>
              <span className="text-base font-bold text-indigo-600">{sleepScore} / 25 pts</span>
            </div>

            <div>
              <div className="flex justify-between text-xs text-slate-600 mb-1">
                <span>Duration Slept:</span>
                <span className="font-bold">{sleepHours} Hours</span>
              </div>
              <input
                type="range"
                min="4"
                max="10"
                step="0.5"
                value={sleepHours}
                onChange={(e) => setSleepHours(Number(e.target.value))}
                className="w-full accent-indigo-600 cursor-pointer"
              />
            </div>
            <p className="text-[11px] text-slate-500">
              Deep Sleep Ratio: 22% (Optimal REM architecture detected).
            </p>
          </div>

          {/* Quadrant 2: Physical Activity */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <Footprints className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-800">Physical Activity</h3>
                  <p className="text-[11px] text-slate-400">Target: 10,000 steps</p>
                </div>
              </div>
              <span className="text-base font-bold text-emerald-600">{activityScore} / 25 pts</span>
            </div>

            <div>
              <div className="flex justify-between text-xs text-slate-600 mb-1">
                <span>Daily Steps:</span>
                <span className="font-bold">{steps.toLocaleString()} Steps</span>
              </div>
              <input
                type="range"
                min="2000"
                max="15000"
                step="200"
                value={steps}
                onChange={(e) => setSteps(Number(e.target.value))}
                className="w-full accent-emerald-600 cursor-pointer"
              />
            </div>
            <p className="text-[11px] text-slate-500">
              Active calorie burn: 480 kcal • Moderate aerobic duration: 42 mins.
            </p>
          </div>

          {/* Quadrant 3: Nutrition & Hydration */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center">
                  <Droplets className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-800">Nutrition & Water</h3>
                  <p className="text-[11px] text-slate-400">Target: 3,000 ml</p>
                </div>
              </div>
              <span className="text-base font-bold text-sky-600">{nutritionScore} / 25 pts</span>
            </div>

            <div>
              <div className="flex justify-between text-xs text-slate-600 mb-1">
                <span>Water Intake:</span>
                <span className="font-bold">{waterMl} ml</span>
              </div>
              <input
                type="range"
                min="1000"
                max="4000"
                step="100"
                value={waterMl}
                onChange={(e) => setWaterMl(Number(e.target.value))}
                className="w-full accent-sky-600 cursor-pointer"
              />
            </div>
            <p className="text-[11px] text-slate-500">
              Electrolyte balance normal. 3 balanced meals logged.
            </p>
          </div>

          {/* Quadrant 4: Stress Management & HRV */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                  <HeartHandshake className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-800">Stress & HRV</h3>
                  <p className="text-[11px] text-slate-400">Target: 65+ ms</p>
                </div>
              </div>
              <span className="text-base font-bold text-amber-600">{stressScore} / 25 pts</span>
            </div>

            <div>
              <div className="flex justify-between text-xs text-slate-600 mb-1">
                <span>Heart Rate Variability (HRV):</span>
                <span className="font-bold">{hrvMs} ms</span>
              </div>
              <input
                type="range"
                min="30"
                max="90"
                step="1"
                value={hrvMs}
                onChange={(e) => setHrvMs(Number(e.target.value))}
                className="w-full accent-amber-600 cursor-pointer"
              />
            </div>
            <p className="text-[11px] text-slate-500">
              Autonomic nervous system recovery index: 82% efficiency.
            </p>
          </div>

        </div>

      </div>
    </div>
  );
};
