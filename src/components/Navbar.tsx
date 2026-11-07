import React from 'react';
import { Smartphone, History, HelpCircle, Sparkles, FolderArchive } from 'lucide-react';

interface NavbarProps {
  onNewBuild: () => void;
  onOpenHistory: () => void;
  onOpenHelp: () => void;
  buildCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  onNewBuild,
  onOpenHistory,
  onOpenHelp,
  buildCount,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800 bg-slate-950/80 backdrop-blur-md px-6 py-3.5">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-8">
        {/* Zone 1: Brand Wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <Smartphone className="w-5 h-5" />
          </div>
          <div>
            <span className="text-lg font-bold tracking-tight text-white flex items-center gap-2">
              CloudAPK <span className="text-emerald-400 font-normal">Studio</span>
            </span>
          </div>
        </div>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-400">
          <button
            onClick={onNewBuild}
            className="hover:text-white transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5"
          >
            <FolderArchive className="w-4 h-4 text-emerald-400" />
            <span>Compiler Studio</span>
          </button>
          <button
            onClick={onOpenHistory}
            className="hover:text-white transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5"
          >
            <History className="w-4 h-4 text-sky-400" />
            <span>Recent Builds ({buildCount})</span>
          </button>
          <button
            onClick={onOpenHelp}
            className="hover:text-white transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5"
          >
            <HelpCircle className="w-4 h-4 text-amber-400" />
            <span>ZIP Guide & Structure</span>
          </button>
        </nav>

        {/* Zone 3: Primary Action */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onNewBuild}
            className="px-4 py-2 text-xs font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>New APK Build</span>
          </button>
        </div>
      </div>
    </header>
  );
};
