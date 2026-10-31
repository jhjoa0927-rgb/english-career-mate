import React, { useState, useEffect, useRef } from 'react';
import { ChatMessage, StudentProfile } from '../types';
import { 
  MessageSquare, 
  X, 
  Send, 
  Sparkles, 
  RotateCcw, 
  Bot, 
  User, 
  Lightbulb, 
  AlertCircle 
} from 'lucide-react';

interface AICounselorDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  profile: StudentProfile;
  initialQuestion?: string;
  onClearInitialQuestion?: () => void;
}

export const AICounselorDrawer: React.FC<AICounselorDrawerProps> = ({
  isOpen,
  onClose,
  profile,
  initialQuestion,
  onClearInitialQuestion,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'assistant',
      content: `안녕하세요! 영어영문학과 학부생 전문 AI 커리어 멘토 **ENGLISH CAREER MATE**입니다. 
${profile.year} 재학 중 겪는 진로 고민, 복수전공 선택, 포트폴리오 제작, 어학 스펙 준비 등 무엇이든 편하게 물어보세요!`,
      timestamp: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const quickQuestions = [
    '영문과 전공인데 경영학 복수전공을 꼭 해야 할까요?',
    'UX 라이터 포트폴리오는 어떻게 구성하나요?',
    '영문과 수업에서 쓴 과제를 포트폴리오로 바꿀 수 있나요?',
    '토익과 오픽 중 어떤 시험을 먼저 준비해야 하나요?',
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  // If opened with an initial question (e.g. from follow-up question chip or career path)
  useEffect(() => {
    if (isOpen && initialQuestion) {
      sendMessage(initialQuestion);
      if (onClearInitialQuestion) {
        onClearInitialQuestion();
      }
    }
  }, [isOpen, initialQuestion]);

  const sendMessage = async (textToSend: string) => {
    if (!textToSend.trim() || isSending) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      content: textToSend.trim(),
      timestamp: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsSending(true);
    setErrorMsg(null);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: textToSend.trim(),
          history: [...messages, userMsg],
          profile,
        }),
      });

      if (!response.ok) {
        throw new Error('서버 응답 오류가 발생했습니다.');
      }

      const data = await response.json();
      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'assistant',
        content: data.reply || '답변을 생성하지 못했습니다.',
        timestamp: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err: any) {
      console.error('Chat error:', err);
      setErrorMsg('상담 연결에 일시적인 지연이 발생했습니다. 다시 시도해주세요.');
    } finally {
      setIsSending(false);
    }
  };

  const handleResetChat = () => {
    setMessages([
      {
        id: 'welcome-reset',
        sender: 'assistant',
        content: `대화가 초기화되었습니다. ${profile.year} 영문과 진로에 대해 새롭게 궁금한 점을 질문해주세요!`,
        timestamp: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-xs transition-opacity animate-in fade-in duration-200">
      <div 
        className="w-full max-w-lg bg-white h-full shadow-2xl flex flex-col border-l border-purple-100 animate-in slide-in-from-right duration-300"
        role="dialog"
      >
        {/* Drawer Header */}
        <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 text-white p-4 sm:p-5 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-purple-500/20 border border-purple-400/30 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-purple-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm sm:text-base">1:1 AI 진로 멘토링</span>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-400/30 font-medium">
                  실시간
                </span>
              </div>
              <p className="text-[11px] text-purple-200">
                {profile.year} 학생 프로필 연계 맞춤 조언
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={handleResetChat}
              className="p-1.5 rounded-lg text-purple-200 hover:text-white hover:bg-white/10 transition-colors"
              title="대화 초기화"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-purple-200 hover:text-white hover:bg-white/10 transition-colors"
              title="닫기"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Quick Question Chips */}
        <div className="bg-purple-50/70 p-2.5 border-b border-purple-100 overflow-x-auto shrink-0 flex items-center gap-1.5 no-scrollbar">
          <Lightbulb className="w-3.5 h-3.5 text-purple-600 shrink-0 ml-1" />
          <span className="text-[11px] text-purple-800 font-semibold shrink-0">추천 질문:</span>
          {quickQuestions.map((q, idx) => (
            <button
              key={idx}
              onClick={() => sendMessage(q)}
              disabled={isSending}
              className="text-[11px] whitespace-nowrap px-2.5 py-1 rounded-full bg-white hover:bg-purple-100 text-slate-700 hover:text-purple-900 border border-purple-200 transition-colors shrink-0"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Messages Container */}
        <div className="grow overflow-y-auto p-4 sm:p-5 space-y-4 bg-slate-50/50">
          {messages.map((msg) => {
            const isUser = msg.sender === 'user';
            return (
              <div
                key={msg.id}
                className={`flex items-start gap-2.5 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
              >
                <div
                  className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 text-xs font-bold ${
                    isUser
                      ? 'bg-purple-700 text-white'
                      : 'bg-indigo-900 text-purple-200'
                  }`}
                >
                  {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>

                <div
                  className={`max-w-[85%] rounded-2xl p-3.5 text-xs sm:text-sm leading-relaxed ${
                    isUser
                      ? 'bg-purple-700 text-white rounded-tr-none'
                      : 'bg-white text-slate-800 border border-purple-100 shadow-xs rounded-tl-none whitespace-pre-wrap'
                  }`}
                >
                  {msg.content}
                  <div
                    className={`text-[10px] mt-1.5 ${
                      isUser ? 'text-purple-200 text-right' : 'text-slate-400 text-left'
                    }`}
                  >
                    {msg.timestamp}
                  </div>
                </div>
              </div>
            );
          })}

          {isSending && (
            <div className="flex items-start gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-indigo-900 text-purple-200 flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4" />
              </div>
              <div className="bg-white text-slate-700 border border-purple-100 rounded-2xl rounded-tl-none p-3 shadow-xs flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-purple-600 animate-bounce" />
                <div className="w-2 h-2 rounded-full bg-purple-600 animate-bounce [animation-delay:0.2s]" />
                <div className="w-2 h-2 rounded-full bg-purple-600 animate-bounce [animation-delay:0.4s]" />
                <span className="text-xs text-slate-400 ml-1">답변 작성 중...</span>
              </div>
            </div>
          )}

          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Form */}
        <div className="p-3 sm:p-4 bg-white border-t border-purple-100 shrink-0">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              sendMessage(inputText);
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="영문과 진로에 대해 궁금한 점을 물어보세요..."
              disabled={isSending}
              className="grow px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500"
            />
            <button
              type="submit"
              disabled={!inputText.trim() || isSending}
              className={`p-2.5 rounded-xl bg-purple-700 hover:bg-purple-800 text-white transition-colors shrink-0 ${
                !inputText.trim() || isSending ? 'opacity-40 cursor-not-allowed' : 'active:scale-95'
              }`}
              title="전송"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
          <div className="text-[10px] text-slate-400 text-center mt-1.5">
            Gemini 3.8 Flash 기반 서버 사이드 AI 멘토링
          </div>
        </div>
      </div>
    </div>
  );
};
