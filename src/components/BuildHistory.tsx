import React from 'react';
import { History, Download, FileText, CheckCircle2, XCircle, ArrowRight, X } from 'lucide-react';
import { BuildState } from '../types/build';

interface BuildHistoryProps {
  builds: BuildState[];
  currentBuildId: string | null;
  isOpen: boolean;
  onClose: () => void;
  onSelectBuild: (build: BuildState) => void;
}

export const BuildHistory: React.FC<BuildHistoryProps> = ({
  builds,
  currentBuildId,
  isOpen,
  onClose,
  onSelectBuild,
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full max-h-[85vh] flex flex-col shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400">
              <History className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">বিল্ড হিস্ট্রি (Recent Builds)</h3>
              <p className="text-xs text-slate-400">আপনার বর্তমান সেশনের সকল বিল্ড রেকর্ড</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Build List */}
        <div className="p-4 overflow-y-auto space-y-3">
          {builds.length === 0 ? (
            <div className="py-12 text-center text-slate-400 text-xs">
              এখনো কোনো বিল্ড সম্পন্ন হয়নি।
            </div>
          ) : (
            builds.map((b) => {
              const isSelected = b.id === currentBuildId;
              const isCompleted = b.status === 'COMPLETED';
              const isFailed = b.status === 'FAILED';

              return (
                <div
                  key={b.id}
                  onClick={() => {
                    onSelectBuild(b);
                    onClose();
                  }}
                  className={`p-4 rounded-xl border transition-all cursor-pointer flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
                    isSelected
                      ? 'border-emerald-500/50 bg-slate-800/80'
                      : 'border-slate-800 bg-slate-950/60 hover:border-slate-700 hover:bg-slate-800/40'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-white">{b.projectName}</span>
                      {isCompleted && (
                        <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" />
                          সফল
                        </span>
                      )}
                      {isFailed && (
                        <span className="text-[10px] font-semibold text-rose-400 bg-rose-500/10 border border-rose-500/20 px-2 py-0.5 rounded-full flex items-center gap-1">
                          <XCircle className="w-3 h-3" />
                          ব্যর্থ
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-400 font-mono truncate max-w-xs sm:max-w-md">
                      {b.packageName} · {new Date(b.createdAt).toLocaleTimeString()}
                    </p>
                  </div>

                  <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                    {isCompleted && b.apkInfo && (
                      <a
                        href={b.apkInfo.downloadUrl}
                        download={b.apkInfo.fileName}
                        className="px-3 py-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>APK</span>
                      </a>
                    )}
                    <a
                      href={`/api/build/${b.id}/download-log`}
                      className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg text-xs font-medium transition-colors flex items-center gap-1"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>লগ</span>
                    </a>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
