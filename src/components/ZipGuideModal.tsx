import React from 'react';
import { HelpCircle, Check, X, FileArchive, Folder, ArrowRight } from 'lucide-react';

interface ZipGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectSample: () => void;
}

export const ZipGuideModal: React.FC<ZipGuideModalProps> = ({ isOpen, onClose, onSelectSample }) => {
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
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">ZIP ফাইল ফরম্যাট ও নির্দেশিকা</h3>
              <p className="text-xs text-slate-400">Android Studio প্রোজেক্ট কীভাবে জিপ করে আপলোড করবেন</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs text-slate-300 leading-relaxed">
          <div className="space-y-2">
            <h4 className="text-sm font-bold text-white">১. প্রয়োজনীয় ফাইল ও ফোল্ডার (Required Structure)</h4>
            <p className="text-slate-400">
              আপনার আপলোড করা <span className="text-emerald-400 font-mono">.zip</span> ফাইলের ভেতরে নিচের ফাইল ও ফোল্ডারগুলো থাকা আবশ্যক (আপনার দেওয়া ZArchiver স্ক্রিনশটের মতো):
            </p>
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 font-mono space-y-1 text-slate-300">
              <div className="text-amber-400 flex items-center gap-2">
                <Folder className="w-3.5 h-3.5" /> app/ (সোর্স কোড ও রিসোর্স)
              </div>
              <div className="text-amber-400 flex items-center gap-2">
                <Folder className="w-3.5 h-3.5" /> gradle/wrapper/ (গ্র্যাডল র‍্যাপার)
              </div>
              <div className="text-emerald-400 flex items-center gap-2">
                <FileArchive className="w-3.5 h-3.5" /> build.gradle.kts বা build.gradle
              </div>
              <div className="text-emerald-400 flex items-center gap-2">
                <FileArchive className="w-3.5 h-3.5" /> settings.gradle.kts বা settings.gradle
              </div>
              <div className="text-slate-400 flex items-center gap-2">
                <FileArchive className="w-3.5 h-3.5" /> gradlew এবং gradlew.bat
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="text-sm font-bold text-white">২. মোবাইলে ZArchiver দিয়ে যেভাবে জিপ করবেন</h4>
            <ol className="list-decimal list-inside space-y-1.5 text-slate-400 pl-1">
              <li>ZArchiver অ্যাপ ওপেন করে আপনার Android Studio প্রজেক্ট ফোল্ডারে যান।</li>
              <li>সবগুলো ফাইল ও ফোল্ডার সিলেক্ট করে <span className="text-white font-semibold">Compress to .zip</span> দিন।</li>
              <li>তারপর এই ওয়েবসাইটে এসে ফাইলটি আপলোড বাটনে দিন।</li>
            </ol>
          </div>

          <div className="space-y-2">
            <h4 className="text-sm font-bold text-white">৩. কী কী ফাইল জিপ করার প্রয়োজন নেই?</h4>
            <p className="text-slate-400">
              <span className="text-rose-400 font-mono">.idea/</span>, <span className="text-rose-400 font-mono">.gradle/</span>, এবং <span className="text-rose-400 font-mono">build/</span> ফোল্ডার বাদ দিয়ে দিলে জিপের সাইজ অনেক ছোট হয় এবং দ্রুত আপলোড হয়।
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-800 bg-slate-950/60 flex items-center justify-between">
          <button
            onClick={() => {
              onClose();
              onSelectSample();
            }}
            className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 transition-colors flex items-center gap-1.5"
          >
            <span>Build MazeBD Creator Project</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-semibold transition-colors"
          >
            বুঝেছি (Got it)
          </button>
        </div>
      </div>
    </div>
  );
};
