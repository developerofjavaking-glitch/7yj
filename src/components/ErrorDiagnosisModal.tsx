import React, { useState } from 'react';
import {
  AlertTriangle,
  Sparkles,
  Download,
  Copy,
  Check,
  Code2,
  HelpCircle,
  Loader2,
  RefreshCw,
} from 'lucide-react';
import { BuildError, BuildState } from '../types/build';

interface ErrorDiagnosisModalProps {
  build: BuildState;
  onRetry: () => void;
}

export const ErrorDiagnosisModal: React.FC<ErrorDiagnosisModalProps> = ({ build, onRetry }) => {
  const [loadingAi, setLoadingAi] = useState(false);
  const [diagnosis, setDiagnosis] = useState(build.aiDiagnosis || null);
  const [copiedCode, setCopiedCode] = useState(false);

  const handleFetchAiDiagnosis = async () => {
    setLoadingAi(true);
    try {
      const res = await fetch(`/api/build/${build.id}/ai-diagnose`, {
        method: 'POST',
      });
      const data = await res.json();
      if (data.diagnosis) {
        setDiagnosis(data.diagnosis);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingAi(false);
    }
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="border border-rose-500/40 rounded-2xl bg-gradient-to-b from-rose-950/20 via-slate-900 to-slate-950 p-6 md:p-8 space-y-6 shadow-2xl">
      {/* Alert Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-rose-500/20">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 shrink-0">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">বিল্ড ব্যর্থ হয়েছে (Build Failed)</h3>
            <p className="text-xs text-rose-300">
              কমপাইলেশনে ত্রুটি (Error) ধরা পড়েছে। নিচে লগ পরীক্ষা করুন অথবা AI দিয়ে কারণ জেনে নিন:
            </p>
          </div>
        </div>

        {/* Quick Log Download & AI Fix Button */}
        <div className="flex items-center gap-2">
          <a
            href={`/api/build/${build.id}/download-log`}
            className="px-3.5 py-2 rounded-xl text-xs font-semibold text-rose-300 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 transition-colors flex items-center gap-1.5"
          >
            <Download className="w-4 h-4 text-rose-400" />
            <span>লগ ডাউনলোড (.txt)</span>
          </a>

          <button
            onClick={onRetry}
            className="px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 transition-colors flex items-center gap-1.5"
          >
            <RefreshCw className="w-4 h-4" />
            <span>নতুন বিল্ড করুন</span>
          </button>
        </div>
      </div>

      {/* Detected Errors Display */}
      {build.errors && build.errors.length > 0 && (
        <div className="space-y-3">
          <span className="text-xs font-semibold text-slate-300 block">শনাক্তকৃত এরর (Detected Error):</span>
          {build.errors.map((err, idx) => (
            <div key={idx} className="p-4 rounded-xl bg-slate-950/80 border border-rose-500/30 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-mono text-rose-400 font-semibold">{err.file}</span>
                <span className="text-slate-400 font-mono">লাইন: {err.line}</span>
              </div>
              <p className="text-sm font-mono text-slate-200">{err.message}</p>
              {err.snippet && (
                <div className="mt-2 p-2.5 rounded bg-black/50 border border-slate-800 font-mono text-xs text-rose-300 overflow-x-auto">
                  <pre>{err.snippet}</pre>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* AI Error Diagnosis Section */}
      <div className="p-5 rounded-xl border border-sky-500/30 bg-sky-950/10 space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-sky-400" />
            <div>
              <h4 className="text-sm font-bold text-white">AI এরর ডায়াগনসিস ও কোড সমাধান</h4>
              <p className="text-xs text-slate-400">
                Gemini AI বিল্ড লগের মূল কারণ বিশ্লেষণ করে সরাসরি সমাধান জানিয়ে দেবে
              </p>
            </div>
          </div>

          {!diagnosis && (
            <button
              onClick={handleFetchAiDiagnosis}
              disabled={loadingAi}
              className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-950 bg-sky-400 hover:bg-sky-300 transition-all flex items-center gap-2 shrink-0 active:scale-95 shadow-md shadow-sky-500/20"
            >
              {loadingAi ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>বিশ্লেষণ চলছে...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>AI দিয়ে কারণ ও সমাধান দেখুন</span>
                </>
              )}
            </button>
          )}
        </div>

        {diagnosis && (
          <div className="space-y-4 pt-3 border-t border-sky-500/20">
            {/* Headline */}
            <div>
              <span className="text-xs text-sky-400 font-semibold block uppercase tracking-wider">
                সমস্যা (Summary)
              </span>
              <p className="text-sm font-semibold text-white mt-0.5">{diagnosis.summary}</p>
            </div>

            {/* Cause in Bengali & English */}
            <div className="p-3.5 rounded-lg bg-slate-950/80 border border-slate-800 space-y-1">
              <span className="text-xs font-semibold text-slate-300 block">বিল্ড ফেইলের মূল কারণ (Root Cause):</span>
              <p className="text-xs text-slate-300 whitespace-pre-line leading-relaxed">
                {diagnosis.cause}
              </p>
            </div>

            {/* Solution Advice */}
            <div className="p-3.5 rounded-lg bg-slate-950/80 border border-slate-800 space-y-1">
              <span className="text-xs font-semibold text-emerald-400 block">কীভাবে সমাধান করবেন (Step-by-Step Fix):</span>
              <p className="text-xs text-slate-300 whitespace-pre-line leading-relaxed">
                {diagnosis.solution}
              </p>
            </div>

            {/* Code Fix */}
            {diagnosis.codeFix && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-sky-300 flex items-center gap-1.5">
                    <Code2 className="w-4 h-4" />
                    সংশোধিত কোড (Corrected Code):
                  </span>
                  <button
                    onClick={() => handleCopyCode(diagnosis.codeFix!)}
                    className="text-xs text-slate-400 hover:text-white flex items-center gap-1"
                  >
                    {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedCode ? 'কপি হয়েছে' : 'কোড কপি করুন'}</span>
                  </button>
                </div>
                <div className="p-3 rounded-lg bg-black/60 border border-slate-800 font-mono text-xs text-emerald-300 overflow-x-auto">
                  <pre>{diagnosis.codeFix}</pre>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
