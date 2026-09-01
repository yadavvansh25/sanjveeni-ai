import React, { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { DashboardView } from './components/DashboardView';
import { AIChatView } from './components/AIChatView';
import { SymptomCheckerView } from './components/SymptomCheckerView';
import { HealthScoreAnalysisView } from './components/HealthScoreAnalysisView';
import { RecordsVaultView } from './components/RecordsVaultView';
import { AppointmentsView } from './components/AppointmentsView';
import { PharmacyView } from './components/PharmacyView';
import { BloodBankView } from './components/BloodBankView';
import { FamilyHubView } from './components/FamilyHubView';
import { NavigationPillar, FamilyMember, Appointment, HealthRecordItem, PharmacyOrder } from './types/app';
import {
  INITIAL_FAMILY_MEMBERS,
  INITIAL_APPOINTMENTS,
  INITIAL_RECORDS,
  INITIAL_ORDERS,
} from './data/mockHealthcareData';

export default function App() {
  const [currentPillar, setCurrentPillar] = useState<NavigationPillar>('dashboard');
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>(INITIAL_FAMILY_MEMBERS);
  const [appointments, setAppointments] = useState<Appointment[]>(INITIAL_APPOINTMENTS);
  const [records, setRecords] = useState<HealthRecordItem[]>(INITIAL_RECORDS);
  const [orders, setOrders] = useState<PharmacyOrder[]>(INITIAL_ORDERS);

  const handleAddAppointment = (apt: Appointment) => {
    setAppointments((prev) => [apt, ...prev]);
  };

  const handleAddRecord = (rec: HealthRecordItem) => {
    setRecords((prev) => [rec, ...prev]);
  };

  const handlePlaceOrder = (order: PharmacyOrder) => {
    setOrders((prev) => [order, ...prev]);
  };

  const handleAddFamilyMember = (mem: FamilyMember) => {
    setFamilyMembers((prev) => [...prev, mem]);
  };

  return (
    <div className="flex h-screen w-full bg-slate-50 text-slate-900 font-sans overflow-hidden">
      {/* 1. Responsive Sidebar Navigation for the 9 Pillars */}
      <Sidebar
        currentPillar={currentPillar}
        onSelectPillar={(pillar) => setCurrentPillar(pillar)}
        unreadAlertsCount={2}
      />

      {/* 2. Main Content View Area */}
      <main className="flex-1 flex flex-col h-full overflow-hidden bg-slate-50">
        <Header
          currentPillar={currentPillar}
          onQuickAction={(pillar) => setCurrentPillar(pillar)}
          alertsCount={2}
        />

        <div className="flex-1 overflow-hidden relative">
          {currentPillar === 'dashboard' && (
            <DashboardView
              onNavigate={(p) => setCurrentPillar(p)}
              familyMembers={familyMembers}
              appointments={appointments}
              orders={orders}
            />
          )}

          {currentPillar === 'ai-chat' && (
            <AIChatView onNavigate={(p) => setCurrentPillar(p)} />
          )}

          {currentPillar === 'symptoms' && (
            <SymptomCheckerView
              onNavigate={(p) => setCurrentPillar(p)}
              onSaveToVault={handleAddRecord}
            />
          )}

          {currentPillar === 'analysis' && (
            <HealthScoreAnalysisView onNavigate={(p) => setCurrentPillar(p)} />
          )}

          {currentPillar === 'records' && (
            <RecordsVaultView
              records={records}
              onAddRecord={handleAddRecord}
            />
          )}

          {currentPillar === 'appointments' && (
            <AppointmentsView
              appointments={appointments}
              onBookAppointment={handleAddAppointment}
            />
          )}

          {currentPillar === 'pharmacy' && (
            <PharmacyView
              orders={orders}
              onPlaceOrder={handlePlaceOrder}
            />
          )}

          {currentPillar === 'blood-bank' && <BloodBankView />}

          {currentPillar === 'family-hub' && (
            <FamilyHubView
              members={familyMembers}
              onNavigate={(p) => setCurrentPillar(p)}
              onAddMember={handleAddFamilyMember}
            />
          )}
        </div>
      </main>
    </div>
  );
}
