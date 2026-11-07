import React, { useState, useEffect, useRef } from 'react';
import { Navbar } from './components/Navbar';
import { UploadZone } from './components/UploadZone';
import { BuildProgress } from './components/BuildProgress';
import { LogTerminal } from './components/LogTerminal';
import { ApkReadyCard } from './components/ApkReadyCard';
import { ErrorDiagnosisModal } from './components/ErrorDiagnosisModal';
import { ProjectTreeModal } from './components/ProjectTreeModal';
import { BuildHistory } from './components/BuildHistory';
import { ZipGuideModal } from './components/ZipGuideModal';
import { BuildState, DemoProject } from './types/build';
import {
  FolderArchive,
  ArrowLeft,
  Files,
  Cpu,
  Layers,
  Sparkles,
  HelpCircle,
  History,
} from 'lucide-react';

export default function App() {
  const [currentBuild, setCurrentBuild] = useState<BuildState | null>(null);
  const [builds, setBuilds] = useState<BuildState[]>([]);
  const [demos, setDemos] = useState<DemoProject[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [showProjectTree, setShowProjectTree] = useState(false);

  const eventSourceRef = useRef<EventSource | null>(null);

  // Load demo list & recent builds on mount
  useEffect(() => {
    fetch('/api/demos')
      .then((res) => res.json())
      .then((data) => setDemos(data))
      .catch((err) => console.error('Failed to load demos', err));

    fetch('/api/builds')
      .then((res) => res.json())
      .then((data) => setBuilds(data))
      .catch((err) => console.error('Failed to load builds', err));
  }, []);

  // Connect to SSE whenever currentBuild is set and in progress
  useEffect(() => {
    if (!currentBuild) {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
        eventSourceRef.current = null;
      }
      return;
    }

    const buildId = currentBuild.id;
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
    }

    const es = new EventSource(`/api/build/${buildId}/events`);
    eventSourceRef.current = es;

    es.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === 'initial') {
          setCurrentBuild(data.build);
        } else if (data.type === 'log') {
          setCurrentBuild((prev) => {
            if (!prev || prev.id !== buildId) return prev;
            return {
              ...prev,
              progress: data.progress ?? prev.progress,
              currentTask: data.currentTask ?? prev.currentTask,
              stageName: data.stageName ?? prev.stageName,
              logs: [...prev.logs, data.log],
            };
          });
        } else if (data.type === 'progress') {
          setCurrentBuild((prev) => {
            if (!prev || prev.id !== buildId) return prev;
            return {
              ...prev,
              progress: data.progress,
              stageName: data.stageName,
              currentTask: data.currentTask,
            };
          });
        } else if (data.type === 'completed') {
          setCurrentBuild((prev) => {
            if (!prev || prev.id !== buildId) return prev;
            return {
              ...prev,
              status: 'COMPLETED',
              progress: 100,
              apkInfo: data.apkInfo,
              durationMs: data.durationMs,
            };
          });
          // Refresh builds list
          fetch('/api/builds')
            .then((res) => res.json())
            .then((data) => setBuilds(data));
        } else if (data.type === 'failed') {
          setCurrentBuild((prev) => {
            if (!prev || prev.id !== buildId) return prev;
            return {
              ...prev,
              status: 'FAILED',
              errors: data.errors || prev.errors,
              durationMs: data.durationMs,
            };
          });
          fetch('/api/builds')
            .then((res) => res.json())
            .then((data) => setBuilds(data));
        }
      } catch (e) {
        console.error('SSE parse error', e);
      }
    };

    es.onerror = () => {
      // Re-fetch state once if disconnected
      fetch(`/api/build/${buildId}`)
        .then((r) => r.json())
        .then((state) => {
          if (state && !state.error) setCurrentBuild(state);
        })
        .catch(() => {});
    };

    return () => {
      es.close();
      eventSourceRef.current = null;
    };
  }, [currentBuild?.id]);

  const handleUploadZip = async (file: File) => {
    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/build/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (data.buildId) {
        // Fetch new build
        const bRes = await fetch(`/api/build/${data.buildId}`);
        const newBuild = await bRes.json();
        setCurrentBuild(newBuild);
      } else {
        alert(data.error || 'আপলোড ব্যর্থ হয়েছে।');
      }
    } catch (err: any) {
      alert(`Upload error: ${err.message}`);
    } finally {
      setIsUploading(false);
    }
  };

  const handleTriggerDemo = async (demoId: string) => {
    setIsUploading(true);
    try {
      const res = await fetch('/api/build/demo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ demoId }),
      });
      const data = await res.json();
      if (data.buildId) {
        const bRes = await fetch(`/api/build/${data.buildId}`);
        const newBuild = await bRes.json();
        setCurrentBuild(newBuild);
      }
    } catch (err: any) {
      alert(`Demo trigger failed: ${err.message}`);
    } finally {
      setIsUploading(false);
    }
  };

  const handleNewBuild = () => {
    setCurrentBuild(null);
  };

  return (
    <div className="min-h-screen bg-[#070b12] text-slate-100 flex flex-col font-sans">
      {/* Top Navbar */}
      <Navbar
        onNewBuild={handleNewBuild}
        onOpenHistory={() => setShowHistory(true)}
        onOpenHelp={() => setShowHelp(true)}
        buildCount={builds.length}
      />

      {/* Main Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {!currentBuild ? (
          /* View 1: Upload and Start Build View */
          <div className="space-y-8">
            <UploadZone
              onUploadZip={handleUploadZip}
              onTriggerDemo={handleTriggerDemo}
              demos={demos}
              isUploading={isUploading}
            />

            {/* Feature Highlights Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
              <div className="p-5 rounded-2xl bg-slate-900/50 border border-slate-800 space-y-2">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                  <Cpu className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-bold text-white">রিয়েল-টাইম গ্র্যাডল কম্পাইলার</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  স্টেজ-বাই-স্টেজ প্রোগ্রেস বার এবং লাইভ টার্মিনাল লগ স্ট্রিমিংয়ের মাধ্যমে প্রতিটি গ্র্যাডল টাস্ক সরাসরি মনিটর করুন।
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-slate-900/50 border border-slate-800 space-y-2">
                <div className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400">
                  <Sparkles className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-bold text-white">AI এরর ডায়াগনসিস</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  বিল্ড টাইমে কোড বা ডিপেন্ডেন্সিতে কোনো ত্রুটি হলে জেমিনি AI সরাসরি বাংলা ও ইংরেজিতে সঠিক কারণ এবং কোড সমাধান দেখিয়ে দেয়।
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-slate-900/50 border border-slate-800 space-y-2">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                  <FolderArchive className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-bold text-white">ডাইরেক্ট APK ও লগ ডাউনলোড</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  কমপাইল শেষ হলেই এক ক্লিকে সাইনড APK ফাইল এবং সম্পূর্ণ বিল্ড লগ <span className="font-mono text-emerald-400">.txt</span> ফাইল ডাউনলোড করুন।
                </p>
              </div>
            </div>
          </div>
        ) : (
          /* View 2: Active Build Studio (Progress + Logs + Output) */
          <div className="space-y-6">
            {/* Top Navigation Bar inside Workspace */}
            <div className="flex flex-wrap items-center justify-between gap-4 pb-2 border-b border-slate-800/80">
              <button
                onClick={handleNewBuild}
                className="text-xs font-semibold text-slate-400 hover:text-white transition-colors flex items-center gap-1.5 py-1 px-2.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>নতুন প্রোজেক্ট আপলোড (New Build)</span>
              </button>

              <div className="flex items-center gap-2">
                {currentBuild.fileTree.length > 0 && (
                  <button
                    onClick={() => setShowProjectTree(true)}
                    className="text-xs font-semibold text-slate-300 hover:text-white transition-colors flex items-center gap-1.5 py-1 px-3 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700"
                  >
                    <Files className="w-3.5 h-3.5 text-emerald-400" />
                    <span>প্রোজেক্ট ফাইল দেখুন ({currentBuild.fileTree.length})</span>
                  </button>
                )}
                <button
                  onClick={() => setShowHistory(true)}
                  className="text-xs font-semibold text-slate-300 hover:text-white transition-colors flex items-center gap-1.5 py-1 px-3 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700"
                >
                  <History className="w-3.5 h-3.5 text-sky-400" />
                  <span>হিস্ট্রি</span>
                </button>
              </div>
            </div>

            {/* Real-time Progress Bar & Stage Indicators */}
            <BuildProgress build={currentBuild} />

            {/* If Build Completed: Show APK Ready Card */}
            {currentBuild.status === 'COMPLETED' && currentBuild.apkInfo && (
              <ApkReadyCard apk={currentBuild.apkInfo} buildId={currentBuild.id} />
            )}

            {/* If Build Failed: Show Error Diagnostics & AI Fixer Card */}
            {currentBuild.status === 'FAILED' && (
              <ErrorDiagnosisModal build={currentBuild} onRetry={handleNewBuild} />
            )}

            {/* Build Log Terminal with Search, Filters, and Direct .txt Download */}
            <LogTerminal
              logs={currentBuild.logs}
              buildId={currentBuild.id}
              projectName={currentBuild.projectName}
              isBuilding={currentBuild.status === 'BUILDING' || currentBuild.status === 'ANALYZING'}
            />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-6 px-6 mt-12 text-slate-500 text-xs">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-400">CloudAPK Studio</span>
            <span>·</span>
            <span>Android APK Cloud Compiler & Build Engine</span>
          </div>
          <div className="flex items-center gap-4 font-mono text-[11px]">
            <span>OpenJDK 17 JRE</span>
            <span>·</span>
            <span>Gradle 8.5</span>
            <span>·</span>
            <span>API 34 Ready</span>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <ProjectTreeModal
        files={currentBuild?.fileTree || []}
        projectName={currentBuild?.projectName || ''}
        isOpen={showProjectTree}
        onClose={() => setShowProjectTree(false)}
      />

      <BuildHistory
        builds={builds}
        currentBuildId={currentBuild?.id || null}
        isOpen={showHistory}
        onClose={() => setShowHistory(false)}
        onSelectBuild={(b) => setCurrentBuild(b)}
      />

      <ZipGuideModal
        isOpen={showHelp}
        onClose={() => setShowHelp(false)}
        onSelectSample={() => {
          setShowHelp(false);
          handleTriggerDemo('mazebd');
        }}
      />
    </div>
  );
}
