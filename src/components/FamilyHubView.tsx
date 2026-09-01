import React, { useState } from 'react';
import { 
  Users, 
  ShieldCheck, 
  Heart, 
  AlertTriangle, 
  CalendarCheck, 
  Plus, 
  ChevronRight,
  Activity,
  UserPlus
} from 'lucide-react';
import { FamilyMember, NavigationPillar } from '../types/app';

interface FamilyHubViewProps {
  members: FamilyMember[];
  onSelectMember?: (member: FamilyMember) => void;
  onNavigate: (pillar: NavigationPillar) => void;
  onAddMember: (member: FamilyMember) => void;
}

export const FamilyHubView: React.FC<FamilyHubViewProps> = ({
  members,
  onNavigate,
  onAddMember,
}) => {
  const [isAdding, setIsAdding] = useState(false);
  const [name, setName] = useState('');
  const [relation, setRelation] = useState('Child');
  const [age, setAge] = useState(12);
  const [bloodGroup, setBloodGroup] = useState('O+');

  const handleAddMemberSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newMember: FamilyMember = {
      id: `fam-${Date.now()}`,
      name,
      relation,
      age: Number(age),
      bloodGroup,
      allergies: ['None reported'],
      chronicConditions: ['None'],
      avatarColor: 'bg-emerald-500',
      healthScore: 88,
      pendingAlerts: 0,
      lastCheckup: new Date().toISOString().split('T')[0],
    };

    onAddMember(newMember);
    setName('');
    setIsAdding(false);
  };

  return (
    <div className="p-8 h-full overflow-y-auto bg-slate-50">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Header & Household Code Banner */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 bg-sky-50 text-sky-700 border border-sky-200 rounded text-[10px] font-bold">
                Household Code: SANJ-8492
              </span>
              <span className="text-xs text-slate-400 font-medium">RBAC Central Family Governance</span>
            </div>
            <h2 className="text-xl font-bold text-slate-900 mt-1">
              Family Health Hub ({members.length} Members)
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              One unified login to manage medical logs, vaccination trackers, and appointments for dependents.
            </p>
          </div>

          <button
            onClick={() => setIsAdding(!isAdding)}
            className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm"
          >
            <UserPlus className="w-4 h-4" /> Add Household Member
          </button>
        </div>

        {/* Add Member Drawer */}
        {isAdding && (
          <form onSubmit={handleAddMemberSubmit} className="bg-white p-5 rounded-2xl border border-sky-200 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-sky-900">Add Household Member</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Full Name</label>
                <input
                  type="text"
                  placeholder="e.g. Grandma Rose"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs focus:outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Relationship</label>
                <select
                  value={relation}
                  onChange={(e) => setRelation(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs focus:outline-none focus:border-sky-500 font-medium"
                >
                  <option value="Spouse">Spouse</option>
                  <option value="Child">Child</option>
                  <option value="Parent">Parent</option>
                  <option value="Sibling">Sibling</option>
                  <option value="Dependent">Dependent</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Age</label>
                <input
                  type="number"
                  value={age}
                  onChange={(e) => setAge(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs focus:outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Blood Group</label>
                <select
                  value={bloodGroup}
                  onChange={(e) => setBloodGroup(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs focus:outline-none focus:border-sky-500 font-medium"
                >
                  {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((bg) => (
                    <option key={bg} value={bg}>{bg}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsAdding(false)}
                className="px-3 py-1.5 text-xs font-bold text-slate-600 hover:bg-slate-200 rounded-lg"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 bg-sky-600 text-white text-xs font-bold rounded-lg shadow-sm"
              >
                Save Member
              </button>
            </div>
          </form>
        )}

        {/* Member Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {members.map((member) => (
            <div
              key={member.id}
              className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between hover:border-sky-300 transition-colors"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl ${member.avatarColor} text-white flex items-center justify-center font-bold text-sm shadow-sm`}>
                      {member.name.split(' ')[0][0]}{member.name.split(' ')[1] ? member.name.split(' ')[1][0] : ''}
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 leading-tight">{member.name}</h3>
                      <p className="text-xs text-slate-500">{member.relation} • Age {member.age} • Blood Group {member.bloodGroup}</p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-xs font-bold text-sky-600 block">{member.healthScore}/100</span>
                    <span className="text-[10px] text-slate-400">Score</span>
                  </div>
                </div>

                <div className="space-y-2 text-xs bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Chronic Conditions:</span>
                    <span className="font-semibold text-slate-800">{member.chronicConditions.join(', ')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Known Allergies:</span>
                    <span className="font-semibold text-rose-600">{member.allergies.join(', ')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Last Checkup:</span>
                    <span className="font-medium text-slate-700">{member.lastCheckup}</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between gap-2">
                <button
                  onClick={() => onNavigate('appointments')}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold transition-colors flex items-center gap-1"
                >
                  <CalendarCheck className="w-3.5 h-3.5 text-slate-500" /> Book Visit
                </button>
                <button
                  onClick={() => onNavigate('records')}
                  className="px-3 py-1.5 bg-sky-50 hover:bg-sky-100 text-sky-700 rounded-lg text-xs font-bold transition-colors"
                >
                  View Records Vault
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};
