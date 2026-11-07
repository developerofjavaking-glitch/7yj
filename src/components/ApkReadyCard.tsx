import React, { useState } from 'react';
import {
  Download,
  Smartphone,
  CheckCircle2,
  Copy,
  Check,
  ShieldCheck,
  QrCode,
  FileText,
  Share2,
} from 'lucide-react';
import { ApkMetadata } from '../types/build';

interface ApkReadyCardProps {
  apk: ApkMetadata;
  buildId: string;
}

export const ApkReadyCard: React.FC<ApkReadyCardProps> = ({ apk, buildId }) => {
  const [copiedHash, setCopiedHash] = useState(false);
  const [showQrModal, setShowQrModal] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const fullDownloadUrl = `${window.location.origin}${apk.downloadUrl}`;

  const handleCopyHash = () => {
    navigator.clipboard.writeText(apk.sha256);
    setCopiedHash(true);
    setTimeout(() => setCopiedHash(false), 2000);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(fullDownloadUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const formattedSize = (apk.size / 1024 / 1024).toFixed(2);

  // SVG QR Code generator for the full APK download URL
  const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(
    fullDownloadUrl
  )}`;

  return (
    <div className="border border-emerald-500/40 rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 p-6 md:p-8 shadow-2xl space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0 shadow-lg shadow-emerald-500/10">
            <Smartphone className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                APK প্রস্তুত (Build Successful)
              </span>
              <span className="text-xs text-slate-400">·</span>
              <span className="text-xs text-slate-400 font-mono">v{apk.versionName}</span>
            </div>
            <h2 className="text-2xl font-extrabold text-white mt-1">{apk.appName}</h2>
            <p className="text-xs text-slate-400 font-mono">{apk.packageName}</p>
          </div>
        </div>

        {/* PRIMARY DOWNLOAD BUTTON */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <a
            href={apk.downloadUrl}
            download={apk.fileName}
            className="w-full md:w-auto px-6 py-3.5 rounded-xl font-bold text-sm text-slate-950 bg-emerald-400 hover:bg-emerald-300 active:scale-[0.98] transition-all flex items-center justify-center gap-2.5 shadow-xl shadow-emerald-500/20"
          >
            <Download className="w-5 h-5" />
            <span>সরাসরি APK ডাউনলোড ({formattedSize} MB)</span>
          </a>

          <button
            onClick={() => setShowQrModal(true)}
            className="px-4 py-3.5 rounded-xl text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 transition-colors flex items-center gap-2"
            title="Scan QR to download on mobile"
          >
            <QrCode className="w-4 h-4 text-emerald-400" />
            <span className="hidden sm:inline">মোবাইল স্ক্যান (QR)</span>
          </button>
        </div>
      </div>

      {/* APK Metadata Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800">
          <span className="text-[11px] text-slate-400 block">ফাইল সাইজ (Size)</span>
          <span className="text-base font-bold text-white font-mono">{formattedSize} MB</span>
        </div>
        <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800">
          <span className="text-[11px] text-slate-400 block">টার্গেট SDK</span>
          <span className="text-base font-bold text-white font-mono">Android {apk.targetSdk}</span>
        </div>
        <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800">
          <span className="text-[11px] text-slate-400 block">ন্যূনতম SDK (Min)</span>
          <span className="text-base font-bold text-white font-mono">API {apk.minSdk}+</span>
        </div>
        <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800">
          <span className="text-[11px] text-slate-400 block">সাইন স্কিম (Signing)</span>
          <span className="text-base font-bold text-emerald-400 font-mono flex items-center gap-1">
            <ShieldCheck className="w-4 h-4" />
            Real v1+v2+v3
          </span>
        </div>
      </div>

      {/* Checksum & Direct Links */}
      <div className="p-4 rounded-xl bg-slate-950/90 border border-slate-800/80 space-y-3">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs">
          <span className="text-slate-400 font-mono">SHA-256 Checksum:</span>
          <div className="flex items-center gap-2 max-w-full">
            <code className="text-slate-300 font-mono text-[11px] truncate max-w-xs sm:max-w-md">
              {apk.sha256}
            </code>
            <button
              onClick={handleCopyHash}
              className="p-1 text-slate-400 hover:text-emerald-400 transition-colors shrink-0"
              title="Copy hash"
            >
              {copiedHash ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        <div className="pt-2 border-t border-slate-900 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyLink}
              className="text-slate-400 hover:text-white transition-colors flex items-center gap-1.5"
            >
              {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
              <span>{copiedLink ? 'ডাউনলোড লিঙ্ক কপি হয়েছে' : 'সরাসরি ডাউনলোড লিঙ্ক কপি করুন'}</span>
            </button>
          </div>

          <a
            href={apk.logUrl}
            className="text-emerald-400 hover:text-emerald-300 transition-colors flex items-center gap-1.5 font-medium"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>বিল্ড লগ টেক্সট ডাউনলোড (.txt)</span>
          </a>
        </div>
      </div>

      {/* Permissions List */}
      {apk.permissions && apk.permissions.length > 0 && (
        <div className="pt-1">
          <span className="text-xs text-slate-400 block mb-2">অনুমতিসমূহ (Declared Permissions):</span>
          <div className="flex flex-wrap gap-2">
            {apk.permissions.map((p) => (
              <span
                key={p}
                className="text-[11px] font-mono text-slate-300 bg-slate-800/80 px-2.5 py-1 rounded-lg border border-slate-700/60"
              >
                {p.replace('android.permission.', '')}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Mobile QR Modal */}
      {showQrModal && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setShowQrModal(false)}
        >
          <div
            className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-sm w-full space-y-4 text-center shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-white">মোবাইলে ডাউনলোড করতে স্ক্যান করুন</h3>
              <p className="text-xs text-slate-400">
                আপনার অ্যান্ড্রয়েড ফোনের ক্যামেরা বা কিউআর কোড স্ক্যানার দিয়ে স্ক্যান করুন:
              </p>
            </div>

            <div className="bg-white p-3 rounded-xl inline-block mx-auto shadow-inner">
              <img
                src={qrApiUrl}
                alt="APK Download QR Code"
                className="w-48 h-48 mx-auto"
                referrerPolicy="no-referrer"
              />
            </div>

            <div className="space-y-2">
              <p className="text-xs font-mono text-emerald-400 truncate">{apk.fileName}</p>
              <button
                onClick={() => setShowQrModal(false)}
                className="w-full py-2 bg-slate-800 hover:bg-slate-700 rounded-xl text-xs font-semibold text-white transition-colors"
              >
                বন্ধ করুন (Close)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
