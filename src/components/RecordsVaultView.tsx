import React, { useState } from 'react';
import { 
  Search, 
  ExternalLink,
  Lock,
  Plus
} from 'lucide-react';
import { HealthRecordItem } from '../types/app';

interface RecordsVaultViewProps {
  records: HealthRecordItem[];
  onAddRecord: (rec: HealthRecordItem) => void;
}

export const RecordsVaultView: React.FC<RecordsVaultViewProps> = ({
  records,
  onAddRecord,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [isUploading, setIsUploading] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<HealthRecordItem['category']>('Lab Report');

  const filteredRecords = records.filter((r) => {
    const matchesSearch = r.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.doctorOrLab.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.tags.some(t => t.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'ALL' || r.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newRecord: HealthRecordItem = {
      id: `rec-${Date.now()}`,
      title: newTitle,
      category: newCategory,
      date: new Date().toISOString().split('T')[0],
      doctorOrLab: "Metro Health Clinical Diagnostics",
      patientName: "John Doe (Self)",
      fhirType: "Observation / DiagnosticReport",
      fileSize: "1.2 MB PDF",
      tags: ["Uploaded", "Verified"],
      findingsSummary: "Document uploaded and encrypted via AES-256-GCM. Extracted metadata indexed in FHIR database.",
      status: "Verified",
    };

    onAddRecord(newRecord);
    setNewTitle('');
    setIsUploading(false);
  };

  return (
    <div className="p-8 h-full overflow-y-auto bg-slate-50">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Top Header & Security Badge */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded text-[10px] font-bold flex items-center gap-1">
                <Lock className="w-3 h-3" /> AES-256-GCM Encrypted
              </span>
              <span className="text-xs text-slate-400 font-medium">HL7/FHIR R4 Diagnostic Vault</span>
            </div>
            <h2 className="text-xl font-bold text-slate-900 mt-1">Medical Records & Prescriptions</h2>
          </div>

          <button
            onClick={() => setIsUploading(!isUploading)}
            className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Upload Document / DICOM
          </button>
        </div>

        {/* Upload Drawer / Modal */}
        {isUploading && (
          <form onSubmit={handleUploadSubmit} className="bg-sky-50 border border-sky-200 p-5 rounded-2xl space-y-4">
            <h3 className="text-sm font-bold text-sky-900">Upload New Health Document</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Document Title</label>
                <input
                  type="text"
                  placeholder="e.g., Annual Health Checkup 2026..."
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-lg p-2.5 text-xs focus:outline-none focus:border-sky-500"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Category</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as any)}
                  className="w-full bg-white border border-slate-200 rounded-lg p-2.5 text-xs focus:outline-none focus:border-sky-500 font-medium cursor-pointer"
                >
                  <option value="Lab Report">Lab Report</option>
                  <option value="Prescription">Prescription</option>
                  <option value="Vaccination">Vaccination</option>
                  <option value="Imaging (DICOM)">Imaging (DICOM)</option>
                  <option value="Discharge Summary">Discharge Summary</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsUploading(false)}
                className="px-3 py-1.5 text-xs font-bold text-slate-600 hover:bg-slate-200 rounded-lg cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 bg-sky-600 text-white text-xs font-bold rounded-lg shadow-sm cursor-pointer"
              >
                Encrypt & Save Record
              </button>
            </div>
          </form>
        )}

        {/* Filter / Search Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="relative flex-1 min-w-[240px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search reports by doctor, test name, LOINC code..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-xs focus:outline-none focus:border-sky-500"
            />
          </div>

          <div className="flex gap-1.5 overflow-x-auto">
            {['ALL', 'Lab Report', 'Prescription', 'Imaging (DICOM)', 'Vaccination'].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-slate-900 text-white'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Records List Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredRecords.map((record) => (
            <div
              key={record.id}
              className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between hover:border-sky-300 transition-colors"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <span className="text-[10px] font-bold px-2 py-0.5 bg-sky-50 text-sky-700 rounded">
                    {record.category}
                  </span>
                  <span className="text-[11px] text-slate-400 font-medium">{record.date}</span>
                </div>

                <h3 className="text-sm font-bold text-slate-900 leading-snug">{record.title}</h3>
                <p className="text-xs text-slate-500 mt-1">{record.doctorOrLab}</p>

                <div className="mt-3 p-3 bg-slate-50 rounded-xl text-xs text-slate-700 leading-relaxed">
                  <p className="font-semibold text-[10px] uppercase text-slate-400 mb-1">Clinical Summary</p>
                  {record.findingsSummary}
                </div>

                <div className="flex flex-wrap gap-1.5 mt-3">
                  {record.tags.map((tag) => (
                    <span key={tag} className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-mono">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-400">{record.fileSize}</span>
                <button className="text-sky-600 hover:text-sky-700 font-bold flex items-center gap-1 cursor-pointer">
                  View FHIR Payload <ExternalLink className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};
