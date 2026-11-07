import React, { useState, useRef, useEffect } from 'react';
import {
  Terminal,
  Download,
  Copy,
  Check,
  Search,
  Filter,
  ArrowDown,
  AlertCircle,
  CheckCircle,
} from 'lucide-react';
import { LogEntry } from '../types/build';

interface LogTerminalProps {
  logs: LogEntry[];
  buildId: string;
  projectName: string;
  isBuilding: boolean;
}

export const LogTerminal: React.FC<LogTerminalProps> = ({
  logs,
  buildId,
  projectName,
  isBuilding,
}) => {
  const [filter, setFilter] = useState<'all' | 'error' | 'task'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [autoScroll, setAutoScroll] = useState(true);
  const [copied, setCopied] = useState(false);
  const terminalEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll logic
  useEffect(() => {
    if (autoScroll && terminalEndRef.current) {
      terminalEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs, autoScroll]);

  const filteredLogs = logs.filter((l) => {
    if (filter === 'error' && l.type !== 'error') return false;
    if (filter === 'task' && l.type !== 'task' && l.type !== 'success') return false;
    if (searchTerm) {
      return l.text.toLowerCase().includes(searchTerm.toLowerCase());
    }
    return true;
  });

  const errorCount = logs.filter((l) => l.type === 'error').length;
  const taskCount = logs.filter((l) => l.type === 'task').length;

  const handleCopyLogs = () => {
    const raw = logs.map((l) => `[${l.timestamp}] [${l.type.toUpperCase()}] ${l.text}`).join('\n');
    navigator.clipboard.writeText(raw);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadLogFile = () => {
    // Direct link to the backend .txt file download
    window.location.href = `/api/build/${buildId}/download-log`;
  };

  return (
    <div className="border border-slate-800 rounded-2xl bg-slate-950 overflow-hidden shadow-2xl flex flex-col">
      {/* Terminal Toolbar */}
      <div className="bg-slate-900 border-b border-slate-800 px-4 py-3 flex flex-wrap items-center justify-between gap-3">
        {/* Left: Terminal Title & Stats */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block" />
            <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
            <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
          </div>
          <div className="flex items-center gap-2 text-slate-300 font-mono text-xs">
            <Terminal className="w-4 h-4 text-emerald-400" />
            <span className="font-semibold text-white">Gradle Build Console</span>
            <span className="text-slate-500">·</span>
            <span className="text-slate-400">{logs.length} lines</span>
            {errorCount > 0 && (
              <span className="text-rose-400 bg-rose-500/10 border border-rose-500/20 px-1.5 py-0.5 rounded text-[10px] font-bold">
                {errorCount} {errorCount === 1 ? 'Error' : 'Errors'}
              </span>
            )}
          </div>
        </div>

        {/* Center: Search & Filter Tabs */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Search Input */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="লগ খুঁজুন (Search)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 pr-3 py-1 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500 w-36 sm:w-44"
            />
          </div>

          {/* Filter Segmented Control */}
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs">
            <button
              onClick={() => setFilter('all')}
              className={`px-2 py-0.5 rounded transition-colors ${
                filter === 'all' ? 'bg-slate-800 text-white font-medium' : 'text-slate-400 hover:text-white'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilter('task')}
              className={`px-2 py-0.5 rounded transition-colors ${
                filter === 'task' ? 'bg-slate-800 text-sky-400 font-medium' : 'text-slate-400 hover:text-white'
              }`}
            >
              Tasks ({taskCount})
            </button>
            <button
              onClick={() => setFilter('error')}
              className={`px-2 py-0.5 rounded transition-colors ${
                filter === 'error' ? 'bg-rose-950 text-rose-300 font-medium' : 'text-slate-400 hover:text-white'
              }`}
            >
              Errors ({errorCount})
            </button>
          </div>
        </div>

        {/* Right: Actions (Download .txt & Copy) */}
        <div className="flex items-center gap-2">
          {/* Auto-scroll toggle */}
          <button
            onClick={() => setAutoScroll(!autoScroll)}
            title="Auto-scroll to bottom"
            className={`p-1.5 rounded-lg border text-xs transition-colors ${
              autoScroll
                ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <ArrowDown className="w-3.5 h-3.5" />
          </button>

          {/* Copy Button */}
          <button
            onClick={handleCopyLogs}
            className="px-2.5 py-1.5 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white text-xs font-medium transition-colors flex items-center gap-1.5"
            title="Copy logs to clipboard"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">{copied ? 'কপি হয়েছে' : 'কপি করুন'}</span>
          </button>

          {/* DIRECT LOG TXT DOWNLOAD BUTTON (User explicit requirement!) */}
          <button
            onClick={handleDownloadLogFile}
            className="px-3 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 hover:border-emerald-500/50 text-emerald-300 text-xs font-semibold transition-all flex items-center gap-1.5 shadow-sm active:scale-95"
            title="Download direct log .txt file"
          >
            <Download className="w-3.5 h-3.5 text-emerald-400" />
            <span>লগ ডাউনলোড (.txt)</span>
          </button>
        </div>
      </div>

      {/* Terminal Content Screen */}
      <div className="p-4 font-mono text-xs leading-relaxed overflow-y-auto max-h-[460px] min-h-[280px] bg-[#070b12] text-slate-300 select-text">
        {filteredLogs.length === 0 ? (
          <div className="py-12 text-center text-slate-400">
            {searchTerm ? 'কোনো লগ ম্যাচ করেনি (No matching log lines).' : 'লগের জন্য অপেক্ষা করা হচ্ছে...'}
          </div>
        ) : (
          <div className="space-y-1">
            {filteredLogs.map((log) => {
              let colorClass = 'text-slate-300';
              let badge = null;

              if (log.type === 'error') {
                colorClass = 'text-rose-400 bg-rose-500/10 px-1 py-0.5 rounded border border-rose-500/20';
                badge = <span className="text-rose-400 font-bold mr-1.5">[ERROR]</span>;
              } else if (log.type === 'warn') {
                colorClass = 'text-amber-300';
                badge = <span className="text-amber-400 font-bold mr-1.5">[WARN]</span>;
              } else if (log.type === 'success') {
                colorClass = 'text-emerald-300 font-semibold';
                badge = <span className="text-emerald-400 font-bold mr-1.5">[SUCCESS]</span>;
              } else if (log.type === 'task') {
                colorClass = 'text-sky-300';
              }

              return (
                <div key={log.id} className={`flex items-start gap-2.5 hover:bg-slate-900/40 px-1 rounded`}>
                  <span className="text-slate-400 select-none text-[11px] tabular-nums shrink-0 pt-0.5">
                    {String(log.id).padStart(3, '0')}
                  </span>
                  <div className={`break-all whitespace-pre-wrap ${colorClass}`}>
                    {badge}
                    {log.text}
                  </div>
                </div>
              );
            })}
            <div ref={terminalEndRef} />
          </div>
        )}
      </div>

      {/* Terminal Footer Info Bar */}
      <div className="bg-slate-900/90 border-t border-slate-800/80 px-4 py-2 flex items-center justify-between text-[11px] text-slate-400">
        <div className="flex items-center gap-3">
          <span>Target: {projectName}</span>
          <span>·</span>
          <span>Build: {buildId}</span>
        </div>
        <div className="flex items-center gap-2">
          {isBuilding && (
            <span className="flex items-center gap-1.5 text-sky-400">
              <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-ping" />
              লাইভ স্ট্রিমিং হচ্ছে...
            </span>
          )}
          {!isBuilding && errorCount === 0 && (
            <span className="text-emerald-400 flex items-center gap-1">
              <CheckCircle className="w-3.5 h-3.5" />
              লগ সফলভাবে সম্পন্ন
            </span>
          )}
          {!isBuilding && errorCount > 0 && (
            <span className="text-rose-400 flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5" />
              লগে এরর ধরা পড়েছে
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
