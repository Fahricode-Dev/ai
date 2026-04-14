import React from 'react';

interface SidebarProps {
  onNewChat: () => void;
  chatHistory: Array<{ id: string; title: string; date: string }>;
  activeId: string;
  onSelectChat: (id: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onNewChat, chatHistory, activeId, onSelectChat }) => {
  return (
    <aside className="w-64 flex-shrink-0 bg-[#0d1117] border-r border-white/[0.06] flex flex-col h-full">
      {/* Logo */}
      <div className="p-5 border-b border-white/[0.06]">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-500/20 flex-shrink-0">
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <div>
            <h1 className="text-white font-bold text-sm leading-tight">Fahri Create</h1>
            <p className="text-white/40 text-[10px] font-medium tracking-wider uppercase">Website AI</p>
          </div>
        </div>
      </div>

      {/* New Chat Button */}
      <div className="p-3">
        <button
          onClick={onNewChat}
          className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg bg-violet-600/20 hover:bg-violet-600/30 border border-violet-500/20 hover:border-violet-500/40 text-violet-300 text-sm font-medium transition-all duration-200 group"
        >
          <svg className="w-4 h-4 group-hover:rotate-90 transition-transform duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          New Project
        </button>
      </div>

      {/* Chat History */}
      <div className="flex-1 overflow-y-auto px-3 pb-3 space-y-1">
        {chatHistory.length > 0 && (
          <p className="text-white/30 text-[10px] font-semibold uppercase tracking-wider px-2 py-2">Recent Projects</p>
        )}
        {chatHistory.map((chat) => (
          <button
            key={chat.id}
            onClick={() => onSelectChat(chat.id)}
            className={`w-full text-left px-3 py-2.5 rounded-lg text-sm transition-all duration-150 group flex items-start gap-2 ${
              activeId === chat.id
                ? 'bg-white/10 text-white'
                : 'text-white/50 hover:bg-white/5 hover:text-white/80'
            }`}
          >
            <svg className="w-3.5 h-3.5 mt-0.5 flex-shrink-0 opacity-60" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <div className="flex-1 min-w-0">
              <p className="truncate text-xs font-medium">{chat.title}</p>
              <p className="text-white/30 text-[10px] mt-0.5">{chat.date}</p>
            </div>
          </button>
        ))}
        {chatHistory.length === 0 && (
          <div className="text-center py-8 px-4">
            <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center mx-auto mb-3">
              <svg className="w-6 h-6 text-white/20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
              </svg>
            </div>
            <p className="text-white/25 text-xs">No projects yet.<br/>Start building!</p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-white/[0.06]">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-400 to-indigo-500 flex items-center justify-center flex-shrink-0">
            <span className="text-white text-xs font-bold">F</span>
          </div>
          <div>
            <p className="text-white text-xs font-semibold">Fahri Dev</p>
            <p className="text-white/30 text-[10px]">claude-sonnet-4-6</p>
          </div>
          <div className="ml-auto w-2 h-2 rounded-full bg-emerald-400 shadow-sm shadow-emerald-400/50"></div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
