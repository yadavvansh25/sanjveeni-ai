import React, { useState } from 'react';
import { 
  Video, 
  MapPin, 
  Clock, 
  User, 
  Plus
} from 'lucide-react';
import { Appointment } from '../types/app';

interface AppointmentsViewProps {
  appointments: Appointment[];
  onBookAppointment: (apt: Appointment) => void;
}

export const AppointmentsView: React.FC<AppointmentsViewProps> = ({
  appointments,
  onBookAppointment,
}) => {
  const [isBooking, setIsBooking] = useState(false);
  const [doctorName, setDoctorName] = useState('Dr. Elena Vance, MD');
  const [specialty, setSpecialty] = useState('Cardiology & Telehealth');
  const [appointmentType, setAppointmentType] = useState<Appointment['type']>('Telehealth Video');
  const [forMember, setForMember] = useState('John Doe (Self)');

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newApt: Appointment = {
      id: `apt-${Date.now()}`,
      doctorName,
      specialty,
      clinicName: "Apollo Premier Specialty Care",
      date: "Tomorrow, 02:00 PM",
      time: "02:00 PM - 02:30 PM",
      type: appointmentType,
      status: "Upcoming",
      telehealthUrl: appointmentType === 'Telehealth Video' ? 'https://meet.sanjeevani.ai/room/live-consult' : undefined,
      forMemberName: forMember,
    };
    onBookAppointment(newApt);
    setIsBooking(false);
  };

  return (
    <div className="p-8 h-full overflow-y-auto bg-slate-50">
      <div className="max-w-5xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-sky-600">
              Care Scheduling
            </span>
            <h2 className="text-xl font-bold text-slate-900 mt-0.5">
              Doctor Appointments & Telehealth
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Connect with verified specialists or clinic providers across your household.
            </p>
          </div>

          <button
            onClick={() => setIsBooking(!isBooking)}
            className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Book New Consultation
          </button>
        </div>

        {/* Booking Form Modal/Drawer */}
        {isBooking && (
          <form onSubmit={handleBookingSubmit} className="bg-sky-50 border border-sky-200 p-5 rounded-2xl space-y-4">
            <h3 className="text-sm font-bold text-sky-900">Schedule Medical Appointment</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Select Specialist</label>
                <select
                  value={doctorName}
                  onChange={(e) => {
                    setDoctorName(e.target.value);
                    if (e.target.value.includes('Vance')) setSpecialty('Cardiology & Telehealth');
                    else if (e.target.value.includes('Sharma')) setSpecialty('Endocrinology & Diabetology');
                    else setSpecialty('General Internal Medicine');
                  }}
                  className="w-full bg-white border border-slate-200 rounded-lg p-2.5 text-xs focus:outline-none focus:border-sky-500 font-medium cursor-pointer"
                >
                  <option value="Dr. Elena Vance, MD">Dr. Elena Vance, MD (Cardiologist)</option>
                  <option value="Dr. Rajesh Sharma, MBBS, MD">Dr. Rajesh Sharma, MD (Diabetologist)</option>
                  <option value="Dr. Priya Nair, MD">Dr. Priya Nair, MD (Pediatrician)</option>
                  <option value="Dr. Kabir Mehta, DM">Dr. Kabir Mehta, DM (Neurologist)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Consultation Format</label>
                <select
                  value={appointmentType}
                  onChange={(e) => setAppointmentType(e.target.value as any)}
                  className="w-full bg-white border border-slate-200 rounded-lg p-2.5 text-xs focus:outline-none focus:border-sky-500 font-medium cursor-pointer"
                >
                  <option value="Telehealth Video">Telehealth Video Call (Instant Link)</option>
                  <option value="In-Clinic Visit">In-Clinic Hospital Visit</option>
                  <option value="Follow-up">AI Triage Follow-up</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">For Patient Member</label>
                <select
                  value={forMember}
                  onChange={(e) => setForMember(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-lg p-2.5 text-xs focus:outline-none focus:border-sky-500 font-medium cursor-pointer"
                >
                  <option value="John Doe (Self)">John Doe (Self)</option>
                  <option value="Martha Doe (Mother)">Martha Doe (Mother)</option>
                  <option value="Leo Doe (Son)">Leo Doe (Son)</option>
                  <option value="Sarah Doe (Spouse)">Sarah Doe (Spouse)</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsBooking(false)}
                className="px-3 py-1.5 text-xs font-bold text-slate-600 hover:bg-slate-200 rounded-lg cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 bg-sky-600 text-white text-xs font-bold rounded-lg shadow-sm cursor-pointer"
              >
                Confirm Appointment
              </button>
            </div>
          </form>
        )}

        {/* Appointments List */}
        <div className="space-y-4">
          {appointments.map((apt) => (
            <div
              key={apt.id}
              className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center shrink-0">
                  {apt.type === 'Telehealth Video' ? (
                    <Video className="w-6 h-6" />
                  ) : (
                    <MapPin className="w-6 h-6" />
                  )}
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-slate-900">{apt.doctorName}</span>
                    <span className="text-[10px] px-2 py-0.5 bg-slate-100 text-slate-600 rounded font-semibold">
                      {apt.type}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">{apt.specialty} • {apt.clinicName}</p>
                  
                  <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-slate-600">
                    <span className="flex items-center gap-1 font-semibold text-slate-800">
                      <Clock className="w-3.5 h-3.5 text-sky-500" /> {apt.date}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1 text-slate-500">
                      <User className="w-3.5 h-3.5" /> For: {apt.forMemberName}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 w-full md:w-auto justify-end">
                {apt.telehealthUrl ? (
                  <a
                    href={apt.telehealthUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-sm transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <Video className="w-4 h-4" /> Join Video Room
                  </a>
                ) : (
                  <span className="text-xs font-semibold text-slate-500 px-3 py-1.5 bg-slate-100 rounded-lg">
                    In-Clinic Visit Confirmed
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};
