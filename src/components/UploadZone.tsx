import React, { useRef, useState } from 'react';
import {
  UploadCloud,
  FileArchive,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Sparkles,
  Gamepad2,
  Layers,
  Smartphone,
  Bug,
  Cpu,
  ShieldCheck,
  Code2,
} from 'lucide-react';
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
  const [buildVariant, setBuildVariant] = useState<'debug' | 'release'>('debug');
  const [targetSdk, setTargetSdk] = useState<'34' | '33'>('34');
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
      setUploadError('Please upload an Android Studio project in .zip format. (শুধুমাত্র .zip ফাইল)');
      return;
    }
    if (file.size > 150 * 1024 * 1024) {
      setUploadError('File size exceeds 150MB limit. (ফাইল সাইজ ১৫০MB এর কম হতে হবে)');
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
    <div className="space-y-8">
      {/* Hero Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3 pt-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs font-semibold text-emerald-400">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Real-Time Cloud Android Compiler (AAPT · OpenJDK 17 · D8 · apksigner)</span>
        </div>
        <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-white leading-tight">
          CloudAPK Studio <span className="text-emerald-400">Compiler & Builder</span>
        </h1>
        <p className="text-slate-300 text-sm md:text-base leading-relaxed">
          Upload any Android Studio project <span className="text-emerald-400 font-semibold">.zip</span> archive.
          The compiler executes full Gradle lifecycle tasks in real-time, compiles Kotlin/Java sources, packages AAPT resources, generates Dalvik Executable (<span className="text-emerald-400 font-mono">classes.dex</span>), and signs the package to generate an authentic, installable <span className="text-emerald-400 font-semibold">.apk</span>.
        </p>
      </div>

      {/* Main Upload Area */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-2xl p-8 md:p-12 text-center cursor-pointer transition-all duration-200 ${
          isDragOver
            ? 'border-emerald-400 bg-emerald-500/10 scale-[1.01]'
            : selectedFile
            ? 'border-emerald-500/40 bg-slate-900/90 hover:border-emerald-400'
            : 'border-slate-800 bg-slate-900/60 hover:border-slate-700 hover:bg-slate-900/80 shadow-xl'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".zip,application/zip,application/x-zip-compressed"
          onChange={handleFileInputChange}
          className="hidden"
        />

        <div className="max-w-xl mx-auto space-y-5">
          <div className="w-16 h-16 rounded-2xl bg-slate-800 border border-slate-700 mx-auto flex items-center justify-center text-emerald-400 shadow-inner group-hover:scale-105 transition-transform">
            {selectedFile ? (
              <FileArchive className="w-8 h-8 text-emerald-400" />
            ) : (
              <UploadCloud className="w-8 h-8 text-slate-400" />
            )}
          </div>

          <div>
            {selectedFile ? (
              <div className="space-y-1.5">
                <p className="text-lg font-bold text-white truncate">{selectedFile.name}</p>
                <div className="flex items-center justify-center gap-2 text-xs font-mono text-emerald-400">
                  <span>{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</span>
                  <span>·</span>
                  <span>Verified ZIP Archive Ready for Compilation</span>
                </div>
              </div>
            ) : (
              <div className="space-y-1.5">
                <p className="text-base md:text-lg font-semibold text-slate-200">
                  Drag & drop Android Studio Project (.zip) or click to browse
                </p>
                <p className="text-xs text-slate-400">
                  Accepts Kotlin & Java Android projects with Gradle (app module, src, res, manifests up to 150MB)
                </p>
              </div>
            )}
          </div>

          {uploadError && (
            <div className="flex items-center justify-center gap-2 text-rose-400 text-xs bg-rose-500/10 border border-rose-500/20 py-2.5 px-4 rounded-xl">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{uploadError}</span>
            </div>
          )}

          {/* Action Button inside card */}
          {selectedFile ? (
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3" onClick={(e) => e.stopPropagation()}>
              <button
                onClick={handleStartUpload}
                disabled={isUploading}
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-bold text-sm text-slate-950 bg-emerald-400 hover:bg-emerald-300 active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-xl shadow-emerald-500/20"
              >
                {isUploading ? (
                  <span>Compiling in Real-Time...</span>
                ) : (
                  <>
                    <span>Compile & Build Real APK</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
              <button
                onClick={() => setSelectedFile(null)}
                className="w-full sm:w-auto px-5 py-3.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 transition-colors"
              >
                Cancel Selection
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-center gap-2 text-xs text-slate-400 font-mono">
              <span>Example: MazeBDCreator.zip (contains app/, build.gradle.kts, AndroidManifest.xml)</span>
            </div>
          )}
        </div>
      </div>

      {/* Build Configurations Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border border-slate-800 rounded-2xl bg-slate-900/50 p-4">
        <div className="flex items-center gap-3 p-2">
          <Cpu className="w-5 h-5 text-emerald-400 shrink-0" />
          <div>
            <span className="text-xs font-semibold text-white block">Compiler Toolchain</span>
            <span className="text-[11px] text-slate-400 block font-mono">AAPT + OpenJDK 17 + D8 8.2</span>
          </div>
        </div>
        <div className="flex items-center gap-3 p-2">
          <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
          <div>
            <span className="text-xs font-semibold text-white block">Signing Schemes</span>
            <span className="text-[11px] text-slate-400 block font-mono">v1 (JAR) + v2 + v3 Verified</span>
          </div>
        </div>
        <div className="flex items-center gap-3 p-2">
          <Code2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <div>
            <span className="text-xs font-semibold text-white block">Output Format</span>
            <span className="text-[11px] text-slate-400 block font-mono">Real Signed .APK (Ready to Install)</span>
          </div>
        </div>
      </div>

      {/* Verified Starter Projects Section */}
      <div className="border border-slate-800 rounded-2xl bg-slate-900/60 p-6 space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span>Verified Android Starter Projects & Templates</span>
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Select any of these complete, production-grade Android Studio projects to compile in real time:
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          {/* MazeBDCreator Project Card */}
          <div className="border border-slate-800 hover:border-emerald-500/50 rounded-xl p-5 bg-slate-950/70 transition-all flex flex-col justify-between space-y-4 group">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-white flex items-center gap-2">
                  <Gamepad2 className="w-4 h-4 text-emerald-400" />
                  MazeBDCreator
                </span>
                <span className="text-[10px] font-mono font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                  Game
                </span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Complete Android Studio puzzle game with Kotlin DSL, custom layouts, audio effects, and multi-level maze generator.
              </p>
              <div className="flex flex-wrap gap-1.5 pt-1">
                <span className="text-[10px] font-mono text-slate-300 bg-slate-800 px-2 py-0.5 rounded">Kotlin DSL</span>
                <span className="text-[10px] font-mono text-slate-300 bg-slate-800 px-2 py-0.5 rounded">API 34</span>
                <span className="text-[10px] font-mono text-slate-300 bg-slate-800 px-2 py-0.5 rounded">62 Files</span>
              </div>
            </div>
            <button
              onClick={() => onTriggerDemo('mazebd')}
              disabled={isUploading}
              className="w-full py-2.5 px-3 rounded-lg text-xs font-semibold text-emerald-300 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 hover:border-emerald-500/60 transition-all flex items-center justify-center gap-2"
            >
              <span>Build MazeBD APK</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Game Launcher Hub Project Card */}
          <div className="border border-slate-800 hover:border-emerald-500/50 rounded-xl p-5 bg-slate-950/70 transition-all flex flex-col justify-between space-y-4 group">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-white flex items-center gap-2">
                  <Smartphone className="w-4 h-4 text-emerald-400" />
                  Jairo Game Launcher
                </span>
                <span className="text-[10px] font-mono font-semibold text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
                  App
                </span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Full-featured Android TV & Mobile game launcher with foreground services, vector drawables, sound assets, and dark UI.
              </p>
              <div className="flex flex-wrap gap-1.5 pt-1">
                <span className="text-[10px] font-mono text-slate-300 bg-slate-800 px-2 py-0.5 rounded">Java & Kotlin</span>
                <span className="text-[10px] font-mono text-slate-300 bg-slate-800 px-2 py-0.5 rounded">3.7 MB Assets</span>
                <span className="text-[10px] font-mono text-slate-300 bg-slate-800 px-2 py-0.5 rounded">102 Files</span>
              </div>
            </div>
            <button
              onClick={() => onTriggerDemo('game_launcher')}
              disabled={isUploading}
              className="w-full py-2.5 px-3 rounded-lg text-xs font-semibold text-cyan-300 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 hover:border-cyan-500/60 transition-all flex items-center justify-center gap-2"
            >
              <span>Build Game Launcher APK</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Material 3 Starter Project Card */}
          <div className="border border-slate-800 hover:border-emerald-500/50 rounded-xl p-5 bg-slate-950/70 transition-all flex flex-col justify-between space-y-4 group">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-white flex items-center gap-2">
                  <Layers className="w-4 h-4 text-emerald-400" />
                  Material 3 Starter
                </span>
                <span className="text-[10px] font-mono font-semibold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                  Template
                </span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Clean, edge-to-edge Android application template with modern Material 3 theme and standard Android 14 Activity structure.
              </p>
              <div className="flex flex-wrap gap-1.5 pt-1">
                <span className="text-[10px] font-mono text-slate-300 bg-slate-800 px-2 py-0.5 rounded">Material 3</span>
                <span className="text-[10px] font-mono text-slate-300 bg-slate-800 px-2 py-0.5 rounded">Android 14</span>
                <span className="text-[10px] font-mono text-slate-300 bg-slate-800 px-2 py-0.5 rounded">Lightweight</span>
              </div>
            </div>
            <button
              onClick={() => onTriggerDemo('compose_starter')}
              disabled={isUploading}
              className="w-full py-2.5 px-3 rounded-lg text-xs font-semibold text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 hover:border-amber-500/60 transition-all flex items-center justify-center gap-2"
            >
              <span>Build Material 3 APK</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Error Diagnostic Test Bar */}
        <div className="mt-4 pt-4 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-slate-400">
            <Bug className="w-4 h-4 text-rose-400 shrink-0" />
            <span>Want to test compiler error diagnostics and Gemini AI auto-fix?</span>
          </div>
          <button
            onClick={() => onTriggerDemo('error_demo')}
            disabled={isUploading}
            className="text-xs font-semibold text-rose-400 hover:text-rose-300 hover:underline flex items-center gap-1.5 shrink-0"
          >
            <span>Run Syntax Diagnostic Test</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
};
