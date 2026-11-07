import React, { useRef, useState } from 'react';
import { UploadCloud, FileArchive, CheckCircle2, AlertTriangle, ArrowRight, Sparkles, Bug } from 'lucide-react';
import { DemoProject } from '../types/build';

interface UploadZoneProps {
  onUploadZip: (file: File) => void;
  onTriggerDemo: (demoId: string) => void;
  demos: DemoProject[];
  isUploading: boolean;
}

export const UploadZone: React.FC<UploadZoneProps> = ({
  onUploadZip,
  onTriggerDemo,
  demos,
  isUploading,
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const validateAndSetFile = (file: File) => {
    setUploadError(null);
    if (!file.name.toLowerCase().endsWith('.zip')) {
      setUploadError('অনুগ্রহ করে শুধুমাত্র অ্যান্ড্রয়েড স্টুডিও প্রোজেক্টের .zip ফাইল আপলোড করুন। (Only .zip archives accepted)');
      return;
    }
    if (file.size > 150 * 1024 * 1024) {
      setUploadError('ফাইল সাইজ ১৫০ মেগাবাইটের কম হতে হবে। (File exceeds 150MB)');
      return;
    }
    setSelectedFile(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const handleStartUpload = () => {
    if (selectedFile) {
      onUploadZip(selectedFile);
    }
  };

  return (
    <div className="space-y-6">
      {/* Hero Title & Bengali explanation */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white">
          Android Studio <span className="text-emerald-400">Online APK Compiler</span>
        </h1>
        <p className="text-slate-300 text-sm md:text-base leading-relaxed">
          আপনার Android Studio প্রোজেক্টের সোর্স কোড <span className="text-emerald-400 font-semibold">.zip</span> ফরম্যাটে আপলোড করুন। ক্লাউড সার্ভার স্বয়ংক্রিয়ভাবে Gradle ও Kotlin কোড কমপাইল করে রিয়েল-টাইমে লগ দেখাবে এবং সরাসরি ইনস্টলযোগ্য <span className="text-emerald-400 font-semibold">.apk</span> ফাইল ডাউনলোড করতে দেবে।
        </p>
      </div>

      {/* Upload Box */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-2xl p-8 md:p-12 text-center cursor-pointer transition-all duration-200 ${
          isDragOver
            ? 'border-emerald-400 bg-emerald-500/10 scale-[1.01]'
            : selectedFile
            ? 'border-emerald-500/40 bg-slate-900/80 hover:border-emerald-400'
            : 'border-slate-800 bg-slate-900/50 hover:border-slate-700 hover:bg-slate-900/80'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".zip,application/zip,application/x-zip-compressed"
          onChange={handleFileInputChange}
          className="hidden"
        />

        <div className="max-w-md mx-auto space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-slate-800 border border-slate-700 mx-auto flex items-center justify-center text-emerald-400 shadow-inner">
            {selectedFile ? (
              <FileArchive className="w-8 h-8 text-emerald-400" />
            ) : (
              <UploadCloud className="w-8 h-8 text-slate-400 group-hover:text-emerald-400" />
            )}
          </div>

          <div>
            {selectedFile ? (
              <div className="space-y-1">
                <p className="text-base font-semibold text-white truncate">{selectedFile.name}</p>
                <p className="text-xs text-emerald-400 font-mono">
                  {(selectedFile.size / 1024 / 1024).toFixed(2)} MB · প্রস্তুত কমপাইল করার জন্য
                </p>
              </div>
            ) : (
              <div className="space-y-1">
                <p className="text-base font-semibold text-slate-200">
                  Android Studio Project ZIP ড্র্যাগ করুন অথবা ক্লিক করে নির্বাচন করুন
                </p>
                <p className="text-xs text-slate-400">
                  Supports Kotlin & Java Android projects with Gradle (Max 150MB)
                </p>
              </div>
            )}
          </div>

          {uploadError && (
            <div className="flex items-center justify-center gap-2 text-rose-400 text-xs bg-rose-500/10 border border-rose-500/20 py-2 px-3 rounded-lg">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{uploadError}</span>
            </div>
          )}

          {/* Action Button inside card */}
          {selectedFile ? (
            <div className="pt-2 flex items-center justify-center gap-3" onClick={(e) => e.stopPropagation()}>
              <button
                onClick={handleStartUpload}
                disabled={isUploading}
                className="px-6 py-2.5 rounded-xl font-semibold text-sm text-slate-950 bg-emerald-400 hover:bg-emerald-300 active:scale-[0.98] transition-all flex items-center gap-2 shadow-lg shadow-emerald-500/20"
              >
                {isUploading ? (
                  <span>আপলোড ও কমপাইল শুরু হচ্ছে...</span>
                ) : (
                  <>
                    <span>কমপাইল শুরু করুন (Compile APK)</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
              <button
                onClick={() => setSelectedFile(null)}
                className="px-4 py-2.5 rounded-xl text-xs font-medium text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 transition-colors"
              >
                বাতিল করুন
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-center gap-2 text-xs text-slate-400">
              <span>যেমন: MazeBDCreator.zip (app, build.gradle.kts, gradlew ইত্যাদি সহ)</span>
            </div>
          )}
        </div>
      </div>

      {/* Demo Projects Quick Launch Strip */}
      <div className="border border-slate-800 rounded-2xl bg-slate-900/60 p-5">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span>টেস্ট করার জন্য রেডিমেড ডেমো প্রোজেক্ট (Quick Test Demos)</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              আপনার কাছে জিপ না থাকলে এক ক্লিকেই নিচের যেকোনো স্যাম্পল দিয়ে টেস্ট করে দেখতে পারেন:
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
          {/* MazeBDCreator Demo Card (matching screenshot) */}
          <div className="border border-slate-800 hover:border-emerald-500/40 rounded-xl p-4 bg-slate-950/60 transition-colors flex flex-col justify-between space-y-3">
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-white flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  MazeBDCreator.zip
                </span>
                <span className="text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                  সফল বিল্ড
                </span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                আপনার স্ক্রিনশটের মতো বাস্তবধর্মী অ্যান্ড্রয়েড স্টুডিও প্রোজেক্ট (Kotlin DSL, compileSdk 34, AndroidManifest, Gradle 8.5)।
              </p>
            </div>
            <button
              onClick={() => onTriggerDemo('mazebd')}
              disabled={isUploading}
              className="w-full py-2 px-3 rounded-lg text-xs font-semibold text-emerald-300 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 hover:border-emerald-500/40 transition-all flex items-center justify-center gap-1.5"
            >
              <span>এই স্যাম্পল দিয়ে টেস্ট করুন (Test MazeBDCreator)</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Broken App Demo Card (to test error display & AI fix) */}
          <div className="border border-slate-800 hover:border-rose-500/40 rounded-xl p-4 bg-slate-950/60 transition-colors flex flex-col justify-between space-y-3">
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-white flex items-center gap-1.5">
                  <Bug className="w-4 h-4 text-rose-400" />
                  BrokenAppProject.zip
                </span>
                <span className="text-[11px] font-mono text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20">
                  এরর ও AI ফিক্স টেস্ট
                </span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                কোডে ভুল সিনট্যাক্স থাকলে বিল্ড এরর কীভাবে ধরা পড়ে, সরাসরি এরর লগ কীভাবে পাওয়া যায় এবং AI দিয়ে কীভাবে ফিক্স করবেন তা পরীক্ষা করুন।
              </p>
            </div>
            <button
              onClick={() => onTriggerDemo('error_demo')}
              disabled={isUploading}
              className="w-full py-2 px-3 rounded-lg text-xs font-semibold text-rose-300 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 hover:border-rose-500/40 transition-all flex items-center justify-center gap-1.5"
            >
              <span>এরর হ্যান্ডলিং ও লগ টেস্ট করুন (Test Error Demo)</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
