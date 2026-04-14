import React, { useState, useRef } from 'react';
import { PreviewTab } from '../types';

interface PreviewPanelProps {
  code: string;
  isGenerating: boolean;
}

const PreviewPanel: React.FC<PreviewPanelProps> = ({ code, isGenerating }) => {
  const [activeTab, setActiveTab] = useState<PreviewTab>('preview');
  const [copySuccess, setCopySuccess] = useState(false);
  const [previewKey, setPreviewKey] = useState(0);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const handleCopy = async () => {
    if (!code) return;
    try {
      await navigator.clipboard.writeText(code);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch {}
  };

  const handleDownload = () => {
    if (!code) return;
    const blob = new Blob([code], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'website-fahri.html';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleRefresh = () => {
    setPreviewKey((k) => k + 1);
  };

  const lineCount = code ? code.split('\n').length : 0;
  const charCount = code ? code.length : 0;

  return (
    <div className="flex flex-col h-full bg-[#0d1117]">
      {/* Header */}
      <div className="px-5 py-3 border-b border-white/[0.06] flex items-center gap-3 flex-shrink-0">
        {/* Tabs */}
        <div className="flex items-center gap-1 bg-white/[0.04] rounded-lg p-1">
          <button
            onClick={() => setActiveTab('preview')}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-150 ${
              activeTab === 'preview'
                ? 'bg-white/10 text-white shadow-sm'
                : 'text-white/40 hover:text-white/60'
            }`}
          >
            <span className="flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Preview
            </span>
          </button>
          <button
            onClick={() => setActiveTab('code')}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-150 ${
              activeTab === 'code'
                ? 'bg-white/10 text-white shadow-sm'
                : 'text-white/40 hover:text-white/60'
            }`}
          >
            <span className="flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
              </svg>
              Code
            </span>
          </button>
        </div>

        {/* Stats */}
        {code && (
          <div className="hidden sm:flex items-center gap-3 ml-2">
            <span className="text-white/20 text-[10px]">{lineCount} lines</span>
            <span className="text-white/20 text-[10px]">{(charCount / 1024).toFixed(1)}KB</span>
          </div>
        )}

        {/* Actions */}
        <div className="ml-auto flex items-center gap-2">
          {activeTab === 'preview' && code && (
            <button
              onClick={handleRefresh}
              className="p-2 rounded-lg text-white/40 hover:text-white/80 hover:bg-white/[0.06] transition-all duration-150"
              title="Refresh Preview"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
          )}
          {code && (
            <>
              <button
                onClick={handleCopy}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-150 ${
                  copySuccess
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    : 'bg-white/[0.05] text-white/50 hover:text-white/80 hover:bg-white/[0.08] border border-white/[0.06]'
                }`}
              >
                {copySuccess ? (
                  <>
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    Copied!
                  </>
                ) : (
                  <>
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    Copy
                  </>
                )}
              </button>
              <button
                onClick={handleDownload}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-violet-600/20 hover:bg-violet-600/30 border border-violet-500/20 hover:border-violet-500/40 text-violet-300 text-xs font-medium transition-all duration-150"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Download
              </button>
            </>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden relative">
        {!code && !isGenerating ? (
          /* Empty state */
          <div className="h-full flex flex-col items-center justify-center text-center px-8">
            <div className="relative mb-6">
              <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-violet-500/10 to-indigo-600/10 border border-violet-500/10 flex items-center justify-center">
                <svg className="w-12 h-12 text-violet-400/40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="absolute -top-2 -right-2 w-8 h-8 rounded-lg bg-violet-500/20 border border-violet-500/20 flex items-center justify-center">
                <svg className="w-4 h-4 text-violet-400/60" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
            </div>
            <h3 className="text-white/60 font-semibold text-base mb-2">Preview akan muncul di sini</h3>
            <p className="text-white/25 text-sm max-w-xs leading-relaxed">
              Mulai chat dengan AI untuk generate website pertama kamu. Hasilnya akan langsung tampil di sini.
            </p>
            <div className="mt-8 grid grid-cols-3 gap-3 w-full max-w-xs">
              {['Landing Page', 'Portfolio', 'Dashboard'].map((t) => (
                <div key={t} className="h-20 rounded-xl bg-white/[0.03] border border-white/[0.05] flex items-center justify-center">
                  <span className="text-white/20 text-[10px] font-medium">{t}</span>
                </div>
              ))}
            </div>
          </div>
        ) : isGenerating && !code ? (
          /* Loading state */
          <div className="h-full flex flex-col items-center justify-center">
            <div className="relative">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500/20 to-indigo-600/20 border border-violet-500/20 flex items-center justify-center">
                <svg className="w-8 h-8 text-violet-400 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </div>
            </div>
            <p className="text-white/50 text-sm mt-4 font-medium">Generating website...</p>
            <p className="text-white/25 text-xs mt-1">Mohon tunggu sebentar</p>
          </div>
        ) : (
          /* Code or Preview */
          <>
            {activeTab === 'preview' ? (
              <div className="h-full flex flex-col">
                {/* Browser chrome */}
                <div className="flex items-center gap-2 px-4 py-2 bg-[#1a1f2e] border-b border-white/[0.06]">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-500/60"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500/60"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500/60"></div>
                  </div>
                  <div className="flex-1 mx-3">
                    <div className="bg-white/[0.06] rounded-md px-3 py-1 text-white/30 text-[11px] flex items-center gap-2">
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                      fahri-create.preview
                    </div>
                  </div>
                  {isGenerating && (
                    <div className="flex items-center gap-1.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse"></div>
                      <span className="text-violet-400 text-[10px] font-medium">Updating...</span>
                    </div>
                  )}
                </div>
                <div className="flex-1 bg-white overflow-hidden">
                  <iframe
                    key={previewKey}
                    ref={iframeRef}
                    srcDoc={code}
                    className="w-full h-full border-0"
                    sandbox="allow-scripts allow-same-origin allow-forms"
                    title="Website Preview"
                  />
                </div>
              </div>
            ) : (
              <div className="h-full overflow-auto">
                {/* Code toolbar */}
                <div className="sticky top-0 z-10 flex items-center justify-between px-4 py-2 bg-[#161b27] border-b border-white/[0.06]">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-orange-400"></span>
                    <span className="text-white/40 text-xs font-mono">index.html</span>
                  </div>
                  <span className="text-white/20 text-[10px] font-mono">{lineCount} lines • HTML</span>
                </div>
                <div className="overflow-auto">
                  <pre className="p-5 text-xs leading-relaxed font-mono overflow-x-auto">
                    {code.split('\n').map((line, i) => (
                      <div key={i} className="flex">
                        <span className="text-white/15 w-10 flex-shrink-0 select-none text-right pr-4 text-[11px]">{i + 1}</span>
                        <span className="text-emerald-300/80 flex-1 whitespace-pre">{highlightLine(line)}</span>
                      </div>
                    ))}
                  </pre>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

function highlightLine(line: string): React.ReactNode {
  // Simple syntax highlighting
  if (!line.trim()) return line;

  // Comments
  if (line.trim().startsWith('<!--')) {
    return <span className="text-white/30 italic">{line}</span>;
  }

  // Detect HTML tags and style them
  const parts: React.ReactNode[] = [];
  const regex = /(<[^>]+>|"[^"]*"|'[^']*'|\/\*[\s\S]*?\*\/|\/\/.*$)/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(line)) !== null) {
    if (match.index > lastIndex) {
      parts.push(<span key={lastIndex} className="text-white/60">{line.slice(lastIndex, match.index)}</span>);
    }
    const token = match[0];
    if (token.startsWith('<')) {
      parts.push(<span key={match.index} className="text-blue-400/80">{token}</span>);
    } else if (token.startsWith('"') || token.startsWith("'")) {
      parts.push(<span key={match.index} className="text-amber-300/80">{token}</span>);
    } else {
      parts.push(<span key={match.index} className="text-white/30 italic">{token}</span>);
    }
    lastIndex = match.index + token.length;
  }
  if (lastIndex < line.length) {
    parts.push(<span key={lastIndex} className="text-white/60">{line.slice(lastIndex)}</span>);
  }

  return parts.length > 0 ? <>{parts}</> : <span className="text-white/60">{line}</span>;
}

export default PreviewPanel;
