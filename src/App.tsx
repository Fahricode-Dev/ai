import { useState, useCallback, useRef } from 'react';
import Sidebar from './components/Sidebar';
import ChatPanel from './components/ChatPanel';
import PreviewPanel from './components/PreviewPanel';
import { Message } from './types';
import { sendMessage, extractCode } from './api/claude';

interface ChatSession {
  id: string;
  title: string;
  date: string;
  messages: Message[];
  code: string;
}

function generateId(): string {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

function formatDate(d: Date): string {
  return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
}

export default function App() {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [streamingCode, setStreamingCode] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const streamingMessageRef = useRef<string>('');

  const activeSession = sessions.find((s) => s.id === activeSessionId);
  const messages = activeSession?.messages ?? [];
  const currentCode = activeSession?.code ?? '';

  const createNewSession = useCallback(() => {
    const id = generateId();
    const newSession: ChatSession = {
      id,
      title: 'New Project',
      date: formatDate(new Date()),
      messages: [],
      code: '',
    };
    setSessions((prev) => [newSession, ...prev]);
    setActiveSessionId(id);
    setStreamingCode('');
    streamingMessageRef.current = '';
  }, []);

  const handleSelectSession = useCallback((id: string) => {
    setActiveSessionId(id);
    const session = sessions.find((s) => s.id === id);
    if (session) {
      setStreamingCode(session.code);
    }
  }, [sessions]);

  const handleSend = useCallback(async (userMessage: string) => {
    // Create session if none exists
    let sessionId = activeSessionId;
    let currentMessages: Message[] = messages;

    if (!activeSessionId) {
      const id = generateId();
      const title = userMessage.length > 40 ? userMessage.slice(0, 40) + '...' : userMessage;
      const newSession: ChatSession = {
        id,
        title,
        date: formatDate(new Date()),
        messages: [],
        code: '',
      };
      setSessions((prev) => [newSession, ...prev]);
      setActiveSessionId(id);
      sessionId = id;
      currentMessages = [];
    }

    const userMsg: Message = {
      id: generateId(),
      role: 'user',
      content: userMessage,
      timestamp: new Date(),
    };

    const newMessages = [...currentMessages, userMsg];

    // Update session title from first message
    setSessions((prev) =>
      prev.map((s) => {
        if (s.id === sessionId) {
          const title = userMessage.length > 40 ? userMessage.slice(0, 40) + '...' : userMessage;
          return { ...s, messages: newMessages, title: s.messages.length === 0 ? title : s.title };
        }
        return s;
      })
    );

    setIsLoading(true);
    streamingMessageRef.current = '';

    const assistantMsgId = generateId();
    const assistantMsg: Message = {
      id: assistantMsgId,
      role: 'assistant',
      content: '',
      timestamp: new Date(),
    };

    // Add assistant placeholder
    setSessions((prev) =>
      prev.map((s) =>
        s.id === sessionId ? { ...s, messages: [...newMessages, assistantMsg] } : s
      )
    );

    await sendMessage(
      newMessages,
      // onChunk
      (chunk) => {
        streamingMessageRef.current += chunk;
        const accumulated = streamingMessageRef.current;

        // Extract and show code live
        const extractedCode = extractCode(accumulated);
        if (extractedCode) {
          setStreamingCode(extractedCode);
        }

        // Update assistant message
        setSessions((prev) =>
          prev.map((s) =>
            s.id === sessionId
              ? {
                  ...s,
                  messages: s.messages.map((m) =>
                    m.id === assistantMsgId ? { ...m, content: accumulated } : m
                  ),
                }
              : s
          )
        );
      },
      // onDone
      () => {
        const finalContent = streamingMessageRef.current;
        const finalCode = extractCode(finalContent);

        setSessions((prev) =>
          prev.map((s) =>
            s.id === sessionId
              ? {
                  ...s,
                  code: finalCode || s.code,
                  messages: s.messages.map((m) =>
                    m.id === assistantMsgId ? { ...m, content: finalContent } : m
                  ),
                }
              : s
          )
        );
        if (finalCode) setStreamingCode(finalCode);
        setIsLoading(false);
        streamingMessageRef.current = '';
      },
      // onError
      (error) => {
        const errorMsg = `❌ Error: ${error}\n\nSilakan coba lagi atau periksa koneksi internet kamu.`;
        setSessions((prev) =>
          prev.map((s) =>
            s.id === sessionId
              ? {
                  ...s,
                  messages: s.messages.map((m) =>
                    m.id === assistantMsgId ? { ...m, content: errorMsg } : m
                  ),
                }
              : s
          )
        );
        setIsLoading(false);
        streamingMessageRef.current = '';
      }
    );
  }, [activeSessionId, messages]);

  const chatHistory = sessions.map((s) => ({
    id: s.id,
    title: s.title,
    date: s.date,
  }));

  // The live code to show - use streaming code during generation, otherwise session code
  const displayCode = isLoading && streamingCode ? streamingCode : currentCode;

  return (
    <div className="flex h-screen w-screen bg-[#0d1117] overflow-hidden font-inter">
      {/* Sidebar */}
      <div className={`transition-all duration-300 flex-shrink-0 ${sidebarOpen ? 'w-64' : 'w-0 overflow-hidden'}`}>
        {sidebarOpen && (
          <Sidebar
            onNewChat={createNewSession}
            chatHistory={chatHistory}
            activeId={activeSessionId}
            onSelectChat={handleSelectSession}
          />
        )}
      </div>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="h-12 flex-shrink-0 flex items-center gap-3 px-4 border-b border-white/[0.06] bg-[#0d1117]/80 backdrop-blur-sm z-10">
          <button
            onClick={() => setSidebarOpen((v) => !v)}
            className="p-1.5 rounded-lg text-white/40 hover:text-white/70 hover:bg-white/[0.06] transition-all duration-150"
            title="Toggle Sidebar"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-md bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center">
              <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <span className="text-white font-bold text-sm">Fahri Create Website</span>
            <span className="hidden sm:inline text-white/20 text-xs">— AI Website Builder</span>
          </div>

          <div className="ml-auto flex items-center gap-4">
            {/* Status */}
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></div>
              <span className="text-emerald-400 text-[11px] font-medium">API Connected</span>
            </div>

            {/* Model badge */}
            <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-violet-500/10 border border-violet-500/20">
              <svg className="w-3 h-3 text-violet-400" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z"/>
              </svg>
              <span className="text-violet-300 text-[11px] font-medium">claude-sonnet-4-6</span>
            </div>
          </div>
        </header>

        {/* Content area */}
        <div className="flex-1 flex overflow-hidden">
          {/* Chat Panel */}
          <div className="w-[380px] flex-shrink-0 border-r border-white/[0.06] flex flex-col">
            <ChatPanel
              messages={messages}
              isLoading={isLoading}
              onSend={handleSend}
              hasCode={!!currentCode}
            />
          </div>

          {/* Preview Panel */}
          <div className="flex-1 min-w-0 flex flex-col">
            <PreviewPanel
              code={displayCode}
              isGenerating={isLoading}
            />
          </div>
        </div>
      </div>

      {/* Global styles */}
      <style>{`
        * { font-family: 'Inter', system-ui, sans-serif; }
        .font-mono, pre, code { font-family: 'JetBrains Mono', 'Fira Code', monospace; }
        ::-webkit-scrollbar { width: 5px; height: 5px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; }
        ::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.2); }
      `}</style>
    </div>
  );
}
