import React from 'react';
import {
  FileText,
  Layers,
  Code2,
  Package,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Loader2,
  FileArchive,
} from 'lucide-react';
import { BuildState } from '../types/build';

interface BuildProgressProps {
  build: BuildState;
}

const STAGES = [
  { id: 1, name: 'Archive Extraction', icon: FileArchive, threshold: 10 },
  { id: 2, name: 'Manifest & Gradle', icon: FileText, threshold: 25 },
  { id: 3, name: 'Dependencies', icon: Layers, threshold: 45 },
  { id: 4, name: 'Compile Kotlin/Java', icon: Code2, threshold: 65 },
  { id: 5, name: 'DEX & Packaging', icon: Package, threshold: 80 },
  { id: 6, name: 'Keystore Signing', icon: ShieldCheck, threshold: 92 },
  { id: 7, name: 'Ready / Verify', icon: CheckCircle2, threshold: 100 },
];

export const BuildProgress: React.FC<BuildProgressProps> = ({ build }) => {
  const isFailed = build.status === 'FAILED';
  const isCompleted = build.status === 'COMPLETED';
  const isBuilding = build.status === 'BUILDING' || build.status === 'ANALYZING' || build.status === 'QUEUED';

  return (
    <div className="border border-slate-800 rounded-2xl bg-slate-900/70 p-6 space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono uppercase tracking-wider text-slate-400">
              বিল্ড প্রসেস (Build Session)
            </span>
            <span className="text-slate-600">·</span>
            <span className="text-xs font-mono text-emerald-400">{build.id}</span>
          </div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span>{build.projectName}</span>
            {isBuilding && <Loader2 className="w-5 h-5 text-emerald-400 animate-spin" />}
            {isCompleted && <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
            {isFailed && <XCircle className="w-5 h-5 text-rose-400" />}
          </h2>
        </div>

        {/* Status Pill */}
        <div className="flex items-center gap-3">
          {isBuilding && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-sky-500/10 text-sky-400 border border-sky-500/20">
              <span className="w-2 h-2 rounded-full bg-sky-400 animate-pulse" />
              কমপাইল হচ্ছে ({build.progress}%)
            </span>
          )}
          {isCompleted && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <CheckCircle2 className="w-3.5 h-3.5" />
              বিল্ড সফল (Build Succeeded)
            </span>
          )}
          {isFailed && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/20">
              <XCircle className="w-3.5 h-3.5" />
              বিল্ড ব্যর্থ (Build Failed)
            </span>
          )}
        </div>
      </div>

      {/* Progress Bar Container */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-medium">
          <div className="flex items-center gap-2 truncate">
            <span className="text-slate-400">বর্তমান স্টেজ:</span>
            <span className="text-white font-mono truncate">{build.stageName || 'প্রস্তুতি'}</span>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <span className="font-mono text-xs text-slate-400">Task:</span>
            <span className="font-mono text-xs text-emerald-300 max-w-xs truncate">
              {build.currentTask}
            </span>
            <span className="font-mono text-sm font-bold text-emerald-400 tabular-nums">
              {build.progress}%
            </span>
          </div>
        </div>

        <div className="h-3 w-full bg-slate-950 rounded-full overflow-hidden border border-slate-800 p-0.5">
          <div
            className={`h-full rounded-full transition-all duration-300 ${
              isFailed
                ? 'bg-rose-500'
                : isCompleted
                ? 'bg-emerald-400'
                : 'bg-gradient-to-r from-emerald-500 to-teal-400'
            }`}
            style={{ width: `${Math.max(5, build.progress)}%` }}
          />
        </div>
      </div>

      {/* 7-Stage Visual Step Indicators */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2 pt-2">
        {STAGES.map((s) => {
          const Icon = s.icon;
          const isPassed = build.progress >= s.threshold && !isFailed;
          const isCurrent =
            build.progress < s.threshold &&
            (STAGES.findIndex((x) => x.id === s.id) === 0 ||
              build.progress >= STAGES[STAGES.findIndex((x) => x.id === s.id) - 1].threshold) &&
            !isFailed &&
            !isCompleted;
          const isStageFailed = isFailed && build.progress < s.threshold && isCurrent;

          return (
            <div
              key={s.id}
              className={`p-3 rounded-xl border transition-all flex flex-col items-center text-center space-y-1.5 ${
                isPassed
                  ? 'border-emerald-500/30 bg-emerald-500/5 text-emerald-300'
                  : isStageFailed
                  ? 'border-rose-500/40 bg-rose-500/5 text-rose-400'
                  : isCurrent
                  ? 'border-sky-500/40 bg-sky-500/10 text-sky-300'
                  : 'border-slate-800/80 bg-slate-950/40 text-slate-400'
              }`}
            >
              <div
                className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                  isPassed
                    ? 'bg-emerald-500/20 text-emerald-400'
                    : isStageFailed
                    ? 'bg-rose-500/20 text-rose-400'
                    : isCurrent
                    ? 'bg-sky-500/20 text-sky-400'
                    : 'bg-slate-800 text-slate-400'
                }`}
              >
                {isCurrent && isBuilding ? (
                  <Loader2 className="w-4 h-4 animate-spin text-sky-400" />
                ) : (
                  <Icon className="w-4 h-4" />
                )}
              </div>
              <span className="text-[11px] font-semibold tracking-tight leading-tight line-clamp-1">
                {s.name}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
