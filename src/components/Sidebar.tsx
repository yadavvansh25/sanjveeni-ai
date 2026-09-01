import React from 'react';
import {
  LayoutDashboard,
  MessageSquareHeart,
  Stethoscope,
  Activity,
  FolderHeart,
  CalendarCheck,
  Pill,
  Droplet,
  Users,
  ShieldCheck
} from 'lucide-react';
import { NavigationPillar } from '../types/app';

interface SidebarProps {
  currentPillar: NavigationPillar;
  onSelectPillar: (pillar: NavigationPillar) => void;
  unreadAlertsCount?: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentPillar,
  onSelectPillar,
  unreadAlertsCount = 2,
}) => {
  const navItems = [
    {
      group: 'Core Modules',
      items: [
        { id: 'dashboard' as NavigationPillar, label: 'Dashboard', icon: LayoutDashboard },
        { id: 'ai-chat' as NavigationPillar, label: 'AI Assistant', icon: MessageSquareHeart, badge: 'MedGemma' },
        { id: 'symptoms' as NavigationPillar, label: 'Symptoms', icon: Stethoscope },
        { id: 'analysis' as NavigationPillar, label: 'Analysis (Score)', icon: Activity },
        { id: 'records' as NavigationPillar, label: 'Records Vault', icon: FolderHeart },
      ],
    },
    {
      group: 'Family & Emergency',
      items: [
        { id: 'family-hub' as NavigationPillar, label: 'Family Hub', icon: Users, badge: '4 Members' },
        { id: 'blood-bank' as NavigationPillar, label: 'Blood Bank', icon: Droplet, alertDot: true },
      ],
    },
    {
      group: 'Services & Care',
      items: [
        { id: 'appointments' as NavigationPillar, label: 'Appointments', icon: CalendarCheck },
        { id: 'pharmacy' as NavigationPillar, label: 'Pharmacy', icon: Pill },
      ],
    },
  ];

  return (
    <aside className="w-64 bg-white border-r border-slate-200 flex flex-col h-full shrink-0 select-none">
      {/* Brand Header */}
      <div className="p-6 border-b border-slate-100 flex items-center justify-between">
        <div 
          onClick={() => onSelectPillar('dashboard')}
          className="flex items-center gap-2.5 cursor-pointer"
        >
          <div className="w-8 h-8 bg-sky-500 rounded-lg flex items-center justify-center text-white font-bold text-lg shadow-sm">
            S
          </div>
          <div>
            <span className="font-semibold text-lg tracking-tight text-slate-900 block leading-tight">
              Sanjeevani AI
            </span>
            <span className="text-[10px] text-slate-400 font-medium">Unified Healthcare</span>
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 p-4 space-y-4 overflow-y-auto">
        {navItems.map((group) => (
          <div key={group.group}>
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-3 mb-2">
              {group.group}
            </div>
            <div className="space-y-1">
              {group.items.map((item) => {
                const Icon = item.icon;
                const isActive = currentPillar === item.id;
                return (
                  <button
                    key={item.id}
                    id={`nav-pillar-${item.id}`}
                    onClick={() => onSelectPillar(item.id)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-md font-medium text-sm transition-colors text-left ${
                      isActive
                        ? 'bg-sky-50 text-sky-700 font-semibold'
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-sky-600' : 'text-slate-400'}`} />
                      <span>{item.label}</span>
                    </div>

                    {item.badge && (
                      <span className={`text-[10px] px-1.5 py-0.5 rounded font-semibold ${
                        isActive ? 'bg-sky-100 text-sky-800' : 'bg-slate-100 text-slate-500'
                      }`}>
                        {item.badge}
                      </span>
                    )}

                    {item.alertDot && (
                      <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* User Footer Profile */}
      <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-sky-100 text-sky-700 flex items-center justify-center font-bold text-xs">
            JD
          </div>
          <div className="overflow-hidden">
            <p className="text-xs font-semibold text-slate-800 truncate">John Doe</p>
            <div className="flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-emerald-500" />
              <p className="text-[10px] text-slate-500">ABHA: 91-4829-10</p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};
