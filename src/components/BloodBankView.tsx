import React, { useState } from 'react';
import { 
  Droplet, 
  MapPin, 
  Clock, 
  PhoneCall, 
  AlertCircle, 
  Plus, 
  CheckCircle2, 
  Search,
  Heart
} from 'lucide-react';
import { BloodRequest } from '../types/app';
import { INITIAL_BLOOD_REQUESTS } from '../data/mockHealthcareData';

export const BloodBankView: React.FC = () => {
  const [requests, setRequests] = useState<BloodRequest[]>(INITIAL_BLOOD_REQUESTS);
  const [isCreating, setIsCreating] = useState(false);
  const [patientName, setPatientName] = useState('');
  const [bloodGroup, setBloodGroup] = useState('O+');
  const [units, setUnits] = useState(2);
  const [hospitalName, setHospitalName] = useState('Metro Trauma Center');
  const [urgency, setUrgency] = useState<BloodRequest['urgency']>('CRITICAL_1HR');
  const [respondedIds, setRespondedIds] = useState<string[]>([]);

  const handleCreateRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientName.trim()) return;

    const newReq: BloodRequest = {
      id: `BLD-${Math.floor(1000 + Math.random() * 9000)}`,
      patientName,
      bloodGroup,
      unitsRequired: Number(units),
      hospitalName,
      urgency,
      matchedDonorsCount: 4,
      status: 'SEARCHING',
      requestedAt: 'Just now',
    };

    setRequests([newReq, ...requests]);
    setPatientName('');
    setIsCreating(false);
  };

  const handleDonorResponse = (reqId: string) => {
    setRespondedIds((prev) => [...prev, reqId]);
    setRequests((prev) =>
      prev.map((r) =>
        r.id === reqId
          ? { ...r, matchedDonorsCount: r.matchedDonorsCount + 1, status: 'MATCHED' }
          : r
      )
    );
  };

  return (
    <div className="p-8 h-full overflow-y-auto bg-slate-50">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Banner */}
        <div className="bg-rose-50 border border-rose-200 p-6 rounded-2xl shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 bg-rose-600 text-white rounded text-[10px] font-bold flex items-center gap-1 animate-pulse">
                <Droplet className="w-3 h-3" /> LIVE EMERGENCY NETWORK
              </span>
              <span className="text-xs text-rose-700 font-medium">Verified Blood Bank Interconnect</span>
            </div>
            <h2 className="text-xl font-bold text-rose-950 mt-1">
              Geo-Radius Emergency Blood Matcher
            </h2>
            <p className="text-xs text-rose-800 mt-0.5">
              Instantly broadcast urgent blood component requests to nearby certified donors and partner hospitals.
            </p>
          </div>

          <button
            onClick={() => setIsCreating(!isCreating)}
            className="px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Raise Emergency Request
          </button>
        </div>

        {/* Emergency Creation Drawer */}
        {isCreating && (
          <form onSubmit={handleCreateRequest} className="bg-white border border-rose-200 p-6 rounded-2xl shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-rose-900 flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4 text-rose-600" /> New Emergency Blood Broadcast
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Patient Name / Case ID</label>
                <input
                  type="text"
                  placeholder="e.g., Surgery Patient ICU-4"
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs focus:outline-none focus:border-rose-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Blood Group Needed</label>
                <select
                  value={bloodGroup}
                  onChange={(e) => setBloodGroup(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs focus:outline-none focus:border-rose-500 font-bold text-rose-700 cursor-pointer"
                >
                  {['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'].map((bg) => (
                    <option key={bg} value={bg}>{bg}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Units (Bags)</label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={units}
                  onChange={(e) => setUnits(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs focus:outline-none focus:border-rose-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Urgency Level</label>
                <select
                  value={urgency}
                  onChange={(e) => setUrgency(e.target.value as any)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs focus:outline-none focus:border-rose-500 font-medium cursor-pointer"
                >
                  <option value="CRITICAL_1HR">Critical (Within 1 Hour)</option>
                  <option value="HIGH_4HRS">High (Within 4 Hours)</option>
                  <option value="MODERATE_24HRS">Moderate (Within 24 Hours)</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsCreating(false)}
                className="px-3 py-1.5 text-xs font-bold text-slate-600 hover:bg-slate-200 rounded-lg cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 bg-rose-600 text-white text-xs font-bold rounded-lg shadow-sm cursor-pointer"
              >
                Broadcast to Donors
              </button>
            </div>
          </form>
        )}

        {/* Requests List */}
        <div className="space-y-4">
          {requests.map((req) => {
            const hasResponded = respondedIds.includes(req.id);
            return (
              <div
                key={req.id}
                className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
              >
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-rose-100 text-rose-700 font-bold text-lg flex items-center justify-center shrink-0 border border-rose-200">
                    {req.bloodGroup}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-slate-900">{req.patientName}</span>
                      <span className="text-[10px] px-2 py-0.5 bg-rose-50 text-rose-700 rounded font-semibold border border-rose-200">
                        {req.unitsRequired} Units Required
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 mt-1 text-xs text-slate-600">
                      <span className="flex items-center gap-1 font-medium text-slate-700">
                        <MapPin className="w-3.5 h-3.5 text-rose-500" /> {req.hospitalName}
                      </span>
                      <span>•</span>
                      <span className="text-slate-400">Requested: {req.requestedAt}</span>
                    </div>

                    <div className="mt-2 text-xs font-semibold text-emerald-700 flex items-center gap-1">
                      <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
                      <span>{req.matchedDonorsCount} Registered Donors Nearby Notified</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 w-full md:w-auto justify-end">
                  {hasResponded ? (
                    <span className="px-4 py-2 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-xl text-xs font-bold flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4" /> Donor Response Registered
                    </span>
                  ) : (
                    <button
                      onClick={() => handleDonorResponse(req.id)}
                      className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm cursor-pointer"
                    >
                      <Heart className="w-4 h-4" /> Accept & Donate
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
};
