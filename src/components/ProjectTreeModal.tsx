import React, { useState } from 'react';
import { Folder, FileCode, FileText, ChevronRight, ChevronDown, Check, X } from 'lucide-react';

interface ProjectTreeModalProps {
  files: string[];
  projectName: string;
  isOpen: boolean;
  onClose: () => void;
}

export const ProjectTreeModal: React.FC<ProjectTreeModalProps> = ({
  files,
  projectName,
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full max-h-[80vh] flex flex-col shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Folder className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">{projectName} - ফাইল কাঠামো</h3>
              <p className="text-xs text-slate-400 font-mono">{files.length} টি ফাইল এক্সট্র্যাক্ট হয়েছে</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* File List (ZArchiver style view) */}
        <div className="p-4 overflow-y-auto space-y-1 font-mono text-xs">
          {files.map((filePath, idx) => {
            const isGradle = filePath.endsWith('.gradle') || filePath.endsWith('.gradle.kts');
            const isKt = filePath.endsWith('.kt') || filePath.endsWith('.java');
            const isXml = filePath.endsWith('.xml');

            return (
              <div
                key={idx}
                className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg hover:bg-slate-800/60 transition-colors text-slate-300"
              >
                {isGradle ? (
                  <FileCode className="w-4 h-4 text-emerald-400 shrink-0" />
                ) : isKt ? (
                  <FileCode className="w-4 h-4 text-sky-400 shrink-0" />
                ) : isXml ? (
                  <FileText className="w-4 h-4 text-amber-400 shrink-0" />
                ) : (
                  <FileText className="w-4 h-4 text-slate-400 shrink-0" />
                )}
                <span className="truncate">{filePath}</span>
              </div>
            );
          })}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 border-t border-slate-800 bg-slate-950/60 flex items-center justify-between">
          <span className="text-xs text-slate-400">Android Studio Project Structure</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-semibold transition-colors"
          >
            বন্ধ করুন (Close)
          </button>
        </div>
      </div>
    </div>
  );
};
