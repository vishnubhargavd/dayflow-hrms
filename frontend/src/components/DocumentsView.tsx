import React from 'react';
import { motion } from 'framer-motion';
import { FileText, Download, ShieldCheck, Eye, Sparkles, Folder, FileCode, CheckCircle2 } from 'lucide-react';

export const DocumentsView: React.FC = () => {
  const companyPolicies = [
    { name: 'Dayflow Employee Handbook 2026', size: '2.4 MB', type: 'PDF', updated: 'Jan 2026' },
    { name: 'Statutory Leave & Attendance Policy', size: '1.1 MB', type: 'PDF', updated: 'Aug 2026' },
    { name: 'Code of Conduct & Data Security (NDA)', size: '850 KB', type: 'PDF', updated: 'Jan 2026' },
    { name: 'Health Insurance & Wellness Benefits', size: '3.2 MB', type: 'PDF', updated: 'Mar 2026' },
  ];

  const employeeDocs = [
    { name: 'Employment Offer Letter (Signed)', status: 'Verified', date: 'Apr 2022' },
    { name: 'Aadhaar / National ID Proof', status: 'Verified', date: 'Apr 2022' },
    { name: 'PAN Card Verification', status: 'Verified', date: 'Apr 2022' },
    { name: 'Academic & Degree Certificates', status: 'Verified', date: 'Apr 2022' },
    { name: 'Form 16 Tax Certificate (FY 2025-26)', status: 'Available', date: 'Jun 2026' },
  ];

  const handleDownload = (name: string) => {
    const text = `DAYFLOW HRMS DOCUMENT REPOSITORY\nDocument: ${name}\nStatus: Certified\nTimestamp: ${new Date().toISOString()}`;
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${name.replace(/[^a-zA-Z0-9]/g, '_')}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="w-full space-y-8">
      {/* Top Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-indigo-950/40 via-zinc-900 to-zinc-900 border border-indigo-500/20 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400 flex items-center gap-1.5 mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            Compliance & Document Vault
          </span>
          <h2 className="text-2xl font-bold text-white tracking-tight">Documents & Policies Repository</h2>
          <p className="text-xs text-zinc-400 mt-1 max-w-xl">
            Secure digital repository for verified employment contracts, tax forms, compliance policies, and HR handbooks.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Company Policies & Handbooks */}
        <div className="p-6 rounded-2xl bg-zinc-900/90 border border-zinc-800 space-y-4 shadow-lg">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Folder className="w-4 h-4 text-emerald-400" />
            <span>Organization Policies & Guidelines</span>
          </h3>

          <div className="space-y-3">
            {companyPolicies.map((doc, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-xl bg-zinc-950/80 border border-zinc-800/80 hover:border-zinc-700 flex items-center justify-between transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white group-hover:text-emerald-300 transition-colors">
                      {doc.name}
                    </h4>
                    <span className="text-[10px] text-zinc-500">
                      {doc.type} • {doc.size} • Last updated {doc.updated}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => handleDownload(doc.name)}
                  className="p-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white border border-zinc-800 transition-colors cursor-pointer"
                  title="Download Document"
                >
                  <Download className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* My Personal Verified Records */}
        <div className="p-6 rounded-2xl bg-zinc-900/90 border border-zinc-800 space-y-4 shadow-lg">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-indigo-400" />
            <span>Personal Verified Records & Tax Forms</span>
          </h3>

          <div className="space-y-3">
            {employeeDocs.map((doc, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-xl bg-zinc-950/80 border border-zinc-800/80 hover:border-zinc-700 flex items-center justify-between transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                    <FileCode className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white group-hover:text-indigo-300 transition-colors">
                      {doc.name}
                    </h4>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[10px] font-bold text-emerald-400 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        {doc.status}
                      </span>
                      <span className="text-[10px] text-zinc-500">• {doc.date}</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => handleDownload(doc.name)}
                  className="p-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white border border-zinc-800 transition-colors cursor-pointer"
                  title="Download File"
                >
                  <Download className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
