import React, { useState, useRef, useEffect } from 'react';
import { 
  CareerCounselingResult, 
  StudentProfile, 
  CareerPath,
  ChatMessage,
  AcademicCompetencyInsight
} from '../types';
import { 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  MessageSquare, 
  TrendingUp, 
  Compass, 
  BookmarkCheck, 
  Target, 
  Briefcase,
  HelpCircle,
  Lightbulb,
  ShieldCheck,
  Send,
  User,
  Bot,
  RotateCcw,
  BookOpen,
  Scale,
  AlertCircle,
  Info
} from 'lucide-react';

interface CareerCounselingViewProps {
  counseling: CareerCounselingResult;
  profile: StudentProfile;
  onNavigateToDiagnosis: () => void;
  onNavigateToRoadmap: () => void;
  onAskQuestionInChat?: (question: string) => void;
}

export const CareerCounselingView: React.FC<CareerCounselingViewProps> = ({
  counseling,
  profile,
  onNavigateToDiagnosis,
  onNavigateToRoadmap,
}) => {
  const [selectedPathId, setSelectedPathId] = useState<string>(counseling.recommendedPaths[0]?.id || 'path-1');
  
  // Interactive Live Chat state directly within Career Counseling
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'init-1',
      sender: 'assistant',
      content: `반갑습니다, ${profile.year} 영문과 학우님! 
학우님의 관심사('${profile.interests.slice(0, 2).join(', ')}')와 강점('${profile.strengths.slice(0, 2).join(', ')}')을 영문학 전공의 5대 핵심 영역(문학 분석, 독해·작문, 번역·통역, 언어학, 문화 연구)과 매핑하여 **3대 맞춤 직무**를 도출했습니다.

아래 추천 직무와 역량 비교표를 살펴보시고, 추가적인 취업 준비나 포트폴리오, 복수전공 등 궁금한 점을 대화로 편하게 질문해 주세요!`,
      timestamp: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }),
    }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [chatError, setChatError] = useState<string | null>(null);

  const chatBottomRef = useRef<HTMLDivElement>(null);

  const selectedPath = counseling.recommendedPaths.find(p => p.id === selectedPathId) || counseling.recommendedPaths[0];

  const handleSendChatMessage = async (textToSend: string, targetPathTitle?: string) => {
    if (!textToSend.trim() || isSending) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      content: textToSend.trim(),
      timestamp: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => [...prev, userMsg]);
    setChatInput('');
    setIsSending(true);
    setChatError(null);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: textToSend.trim(),
          history: [...messages, userMsg],
          profile,
          selectedPathTitle: targetPathTitle || selectedPath?.title
        }),
      });

      if (!response.ok) {
        throw new Error('AI 진로 상담 서버 응답에 문제가 발생했습니다.');
      }

      const data = await response.json();
      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'assistant',
        content: data.reply || '답변을 생성하지 못했습니다.',
        timestamp: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages(prev => [...prev, botMsg]);
    } catch (err: any) {
      console.error('Chat error:', err);
      setChatError('일시적인 네트워크 지연이 발생했습니다. 다시 질문해 주시거나 잠시 후 재시도해 주세요.');
    } finally {
      setIsSending(false);
    }
  };

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isSending]);

  const handleSelectPathForChat = (path: CareerPath) => {
    setSelectedPathId(path.id);
    const prompt = `'${path.title}'(${path.fieldCategory}) 직무의 전공 연계 이유와 필요 역량을 보았습니다. 영문과 ${profile.year} 학생으로서 이 직무를 위해 지금 당장 시작해야 할 구체적인 포트폴리오 준비법을 알려주세요.`;
    handleSendChatMessage(prompt, path.title);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-12">
      
      {/* 1. Header Banner: Profile Context & Overall Evaluation */}
      <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-purple-950 rounded-3xl p-6 sm:p-10 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="px-3 py-1 rounded-full bg-purple-500/20 text-purple-200 border border-purple-400/30 text-xs font-semibold">
              {profile.year} 영문과 진로 정밀 진단
            </span>
            <span className="text-xs text-purple-300">
              분석 완료: {new Date(counseling.generatedAt).toLocaleDateString('ko-KR')}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight mb-4">
            AI 맞춤형 진로 상담 & 직무 역량 분석
          </h1>

          {/* Student Profile Quick Tags */}
          <div className="flex flex-wrap items-center gap-2 mb-6 text-xs">
            <span className="text-slate-400">보유 강점:</span>
            {profile.strengths.slice(0, 3).map((st, i) => (
              <span key={i} className="bg-white/10 px-2.5 py-1 rounded-lg text-purple-200">
                {st}
              </span>
            ))}
            <span className="text-slate-400 ml-2">주요 관심사:</span>
            {profile.interests.slice(0, 3).map((it, i) => (
              <span key={i} className="bg-white/10 px-2.5 py-1 rounded-lg text-indigo-200">
                {it}
              </span>
            ))}
          </div>

          {/* AI Comprehensive Evaluation Box */}
          <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-5 sm:p-6 text-purple-50 text-sm sm:text-base leading-relaxed">
            <div className="flex items-center gap-2 font-bold text-purple-300 text-xs sm:text-sm uppercase tracking-wider mb-2">
              <Sparkles className="w-4 h-4 text-purple-300" />
              <span>수석 커리어 컨설턴트 종합 코멘트</span>
            </div>
            <p className="leading-relaxed">
              {counseling.overallEvaluation}
            </p>
          </div>
        </div>
      </div>

      {/* 2. English Lit 5 Academic Pillars Mapping Section */}
      <div className="bg-white rounded-3xl border border-purple-100 p-6 sm:p-8 shadow-sm">
        <div className="flex items-center gap-2 mb-2">
          <BookOpen className="w-5 h-5 text-purple-700" />
          <h2 className="text-xl font-bold text-slate-900">
            영어영문학 5대 전공 영역과 산업계 실무 치환 역량
          </h2>
        </div>
        <p className="text-xs sm:text-sm text-slate-500 mb-6">
          영문과 학부 과정에서 학습하는 문학 비평, 영작문, 번역, 언어학, 문화 연구는 현대 기업 실무에서 다음과 같은 독보적인 가치로 치환됩니다.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
          {(counseling.academicInsights || []).map((ins, idx) => (
            <div key={idx} className="p-4 rounded-2xl bg-purple-50/50 border border-purple-100 flex flex-col justify-between">
              <div>
                <span className="text-[11px] font-extrabold px-2 py-0.5 rounded-md bg-purple-100 text-purple-800 inline-block mb-2">
                  {ins.academicArea}
                </span>
                <div className="font-bold text-xs text-slate-900 mb-1">
                  {ins.coreSkill}
                </div>
                <div className="text-[11px] text-purple-900 font-semibold mb-2">
                  실무 치환: {ins.industryTranslation}
                </div>
              </div>
              <p className="text-[11px] text-slate-600 leading-snug pt-2 border-t border-purple-100/80">
                {ins.studentApplication}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Recommended Career Paths Section with Detailed Reasoning & Competency Comparison */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-purple-700 bg-purple-100 px-3 py-1 rounded-full mb-1">
              <Compass className="w-3.5 h-3.5" />
              <span>Recommended Career Paths</span>
            </div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">
              영문과 맞춤형 3대 추천 직무 & 역량 비교 분석
            </h2>
            <p className="text-slate-600 text-sm">
              출판·편집, 번역·로컬라이제이션, 콘텐츠 기획, 마케팅, 교육 등 영문과 전공자가 가장 빛날 수 있는 직무입니다.
            </p>
          </div>

          <div className="text-xs text-slate-500 font-medium">
            * 각 직무의 상세 추천 이유와 역량 비교표를 확인하세요.
          </div>
        </div>

        {/* 3 Career Path Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          {counseling.recommendedPaths.map((path: CareerPath, index: number) => {
            const isSelected = path.id === selectedPathId;

            return (
              <div 
                key={path.id || index}
                className={`bg-white rounded-3xl border transition-all flex flex-col justify-between overflow-hidden relative ${
                  isSelected 
                    ? 'border-purple-600 ring-2 ring-purple-600/20 shadow-lg' 
                    : 'border-purple-100 hover:border-purple-300 shadow-sm'
                }`}
              >
                {/* Top Header */}
                <div className="p-6 bg-gradient-to-b from-purple-50/70 to-transparent border-b border-purple-50">
                  <div className="flex items-center justify-between gap-2 mb-2.5">
                    <span className="text-[11px] font-extrabold text-purple-700 bg-purple-100 px-2.5 py-1 rounded-lg">
                      {path.fieldCategory}
                    </span>
                    <div className="flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                      <span>적합도 {path.matchScore}%</span>
                    </div>
                  </div>

                  <h3 className="text-lg font-extrabold text-slate-900 mb-1">
                    {path.title}
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">
                    {path.tagline}
                  </p>
                </div>

                {/* Card Body */}
                <div className="p-6 space-y-5 grow">
                  
                  {/* Detailed Reasoning Explanation */}
                  <div className="space-y-2">
                    <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                      <BookmarkCheck className="w-3.5 h-3.5 text-purple-600" />
                      <span>추천 이유 상세 설명</span>
                    </div>
                    
                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/60 space-y-1.5 text-xs">
                      <div>
                        <span className="font-semibold text-purple-900">관심 분야 연계: </span>
                        <span className="text-slate-600">{path.reasoning?.interestsConnection || path.englishLitAdvantage}</span>
                      </div>
                      <div>
                        <span className="font-semibold text-indigo-900">보유 강점 연계: </span>
                        <span className="text-slate-600">{path.reasoning?.strengthsConnection || path.englishLitAdvantage}</span>
                      </div>
                      <div>
                        <span className="font-semibold text-slate-800">전공 학업 연계: </span>
                        <span className="text-slate-600">{path.reasoning?.majorExperienceConnection || path.englishLitAdvantage}</span>
                      </div>
                    </div>
                  </div>

                  {/* Competency Comparison (Required vs Current vs Gap) */}
                  <div className="space-y-2">
                    <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                      <Scale className="w-3.5 h-3.5 text-indigo-600" />
                      <span>역량 비교 분석 (필요 vs 보유 vs 갭)</span>
                    </div>

                    <div className="space-y-2 text-xs">
                      <div className="bg-emerald-50/60 p-2.5 rounded-lg border border-emerald-100">
                        <span className="font-bold text-emerald-800 block text-[11px] mb-1">
                          ✓ 학생이 이미 갖춘 전공 역량
                        </span>
                        <div className="flex flex-wrap gap-1">
                          {path.competencyComparison?.matchedStudentCompetencies?.map((c, i) => (
                            <span key={i} className="bg-white px-2 py-0.5 rounded text-[11px] text-emerald-800 border border-emerald-200">
                              {c}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="bg-amber-50/60 p-2.5 rounded-lg border border-amber-100">
                        <span className="font-bold text-amber-900 block text-[11px] mb-1">
                          ! 실무 준비를 위해 보완할 역량 갭
                        </span>
                        <div className="flex flex-wrap gap-1">
                          {path.competencyComparison?.gapCompetencies?.map((c, i) => (
                            <span key={i} className="bg-white px-2 py-0.5 rounded text-[11px] text-amber-900 border border-amber-200">
                              {c}
                            </span>
                          ))}
                        </div>
                      </div>

                      {path.competencyComparison?.analysisSummary && (
                        <p className="text-[11px] text-slate-500 leading-snug px-1">
                          {path.competencyComparison.analysisSummary}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* First Step Action */}
                  <div className="bg-purple-50/60 border border-purple-100 rounded-xl p-3 text-xs">
                    <div className="font-bold text-purple-900 flex items-center gap-1 mb-1">
                      <Lightbulb className="w-3.5 h-3.5 text-purple-600" />
                      <span>지금 당장 시작할 첫 액션</span>
                    </div>
                    <p className="text-purple-800 leading-snug">{path.firstStepAction}</p>
                  </div>

                  {/* Reliability Note */}
                  <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-2.5 text-[11px] text-slate-500 flex items-start gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                    <span>{path.reliabilityNote}</span>
                  </div>

                </div>

                {/* Card Action */}
                <div className="p-6 pt-0">
                  <button
                    onClick={() => handleSelectPathForChat(path)}
                    className="w-full py-2.5 rounded-xl border border-purple-200 bg-purple-50 hover:bg-purple-100 text-purple-900 text-xs font-bold transition-all flex items-center justify-center gap-1.5"
                  >
                    <MessageSquare className="w-3.5 h-3.5 text-purple-700" />
                    <span>이 직무에 대해 대화로 심층 상담하기</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. Live Interactive AI Counseling Chat Session */}
      <div className="bg-white rounded-3xl border border-purple-200/80 shadow-md p-6 sm:p-8 space-y-6">
        
        {/* Chat Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-purple-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-700 text-white flex items-center justify-center">
              <Bot className="w-5 h-5 text-purple-200" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-base sm:text-lg text-slate-900">
                  AI 전담 진로 상담사와의 실시간 대화
                </h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                  Gemini 연동
                </span>
              </div>
              <p className="text-xs text-slate-500">
                {profile.year} 학생 프로필과 3대 추천 직무를 바탕으로 구체적인 진로 방향을 묻고 답해보세요.
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              setMessages([
                {
                  id: `welcome-${Date.now()}`,
                  sender: 'assistant',
                  content: `대화가 새로 시작되었습니다. ${profile.year} 영문과 재학 중 직무 준비나 포트폴리오, 어학 시험에 대해 궁금한 점을 질문해 주세요!`,
                  timestamp: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }),
                }
              ]);
            }}
            className="self-start sm:self-auto text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>상담 대화 초기화</span>
          </button>
        </div>

        {/* Suggested Follow-up Questions from AI (If information is sparse or to refine path) */}
        <div className="bg-purple-50/60 rounded-2xl p-4 border border-purple-100 space-y-2">
          <div className="flex items-center gap-1.5 text-xs font-bold text-purple-900">
            <HelpCircle className="w-4 h-4 text-purple-700" />
            <span>AI 추천 후속 질문 (클릭 시 상담사에게 즉시 질의)</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {counseling.suggestedFollowUpQuestions.map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleSendChatMessage(q)}
                disabled={isSending}
                className="text-left text-xs p-2.5 rounded-xl bg-white hover:bg-purple-100/70 border border-purple-200/70 text-slate-800 font-medium transition-colors flex items-center justify-between gap-2 shadow-xs group"
              >
                <span className="truncate">"{q}"</span>
                <ArrowRight className="w-3.5 h-3.5 text-purple-600 shrink-0 group-hover:translate-x-0.5 transition-transform" />
              </button>
            ))}
          </div>
        </div>

        {/* Messages Stream Container */}
        <div className="space-y-4 max-h-[460px] overflow-y-auto p-4 rounded-2xl bg-slate-50/70 border border-slate-200/80">
          {messages.map((msg) => {
            const isUser = msg.sender === 'user';

            return (
              <div 
                key={msg.id}
                className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
              >
                {/* Avatar Icon */}
                <div 
                  className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-xs font-bold shadow-xs ${
                    isUser
                      ? 'bg-purple-700 text-white'
                      : 'bg-indigo-950 text-purple-200'
                  }`}
                >
                  {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>

                {/* Message Bubble */}
                <div className={`max-w-[85%] sm:max-w-[75%] space-y-1`}>
                  <div className={`text-[10px] font-semibold ${isUser ? 'text-right text-purple-900' : 'text-left text-slate-500'}`}>
                    {isUser ? '나 (학생)' : 'ENGLISH CAREER MATE 진로 상담사'}
                  </div>

                  <div 
                    className={`rounded-2xl p-4 text-xs sm:text-sm leading-relaxed whitespace-pre-wrap shadow-xs ${
                      isUser
                        ? 'bg-purple-700 text-white rounded-tr-none'
                        : 'bg-white text-slate-800 border border-purple-100 rounded-tl-none font-normal'
                    }`}
                  >
                    {msg.content}
                  </div>

                  <div className={`text-[10px] text-slate-400 ${isUser ? 'text-right' : 'text-left'}`}>
                    {msg.timestamp}
                  </div>
                </div>
              </div>
            );
          })}

          {/* Typing Loading Indicator */}
          {isSending && (
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-indigo-950 text-purple-200 flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4" />
              </div>
              <div className="bg-white border border-purple-100 rounded-2xl rounded-tl-none p-3.5 shadow-xs flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-purple-600 animate-bounce" />
                <div className="w-2 h-2 rounded-full bg-purple-600 animate-bounce [animation-delay:0.2s]" />
                <div className="w-2 h-2 rounded-full bg-purple-600 animate-bounce [animation-delay:0.4s]" />
                <span className="text-xs text-slate-500 ml-1">AI 상담사가 답변을 정리하고 있습니다...</span>
              </div>
            </div>
          )}

          {/* Chat Error Notice */}
          {chatError && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{chatError}</span>
              </div>
              <button
                onClick={() => setChatError(null)}
                className="text-[11px] underline font-semibold text-rose-900"
              >
                닫기
              </button>
            </div>
          )}

          <div ref={chatBottomRef} />
        </div>

        {/* Input Form */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendChatMessage(chatInput);
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            disabled={isSending}
            placeholder="상담사에게 질문하기 (예: 출판 에디터 포트폴리오는 어떻게 만드나요?, 외국계 기업은 어떤 스펙을 보나요?)"
            className="grow px-4 py-3 text-xs sm:text-sm rounded-xl border border-slate-200 bg-slate-50/70 focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500"
          />
          <button
            type="submit"
            disabled={!chatInput.trim() || isSending}
            className={`px-5 py-3 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs sm:text-sm transition-all flex items-center gap-1.5 shadow-sm shrink-0 ${
              !chatInput.trim() || isSending ? 'opacity-40 cursor-not-allowed' : 'active:scale-95'
            }`}
          >
            <span>전송</span>
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>

        {/* Reliability Disclaimer Banner */}
        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 text-[11px] text-slate-500 flex items-start gap-2">
          <Info className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold text-slate-700">취업 정보 신뢰성 안내: </span>
            {counseling.reliabilityNotice || '본 상담은 영문과 학부생의 진로 탐색 및 학업 계획 수립을 돕기 위한 전문 조언이며, 임의의 취업률이나 비공식 연봉 정보를 보증하지 않습니다. 세부적인 채용 기준과 지원 자격은 기업 공식 채용 사이트를 확인하시기 바랍니다.'}
          </div>
        </div>

      </div>

      {/* 5. Bottom Navigation Steps */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
        <div 
          onClick={onNavigateToDiagnosis}
          className="bg-gradient-to-r from-indigo-50 to-purple-50 hover:from-indigo-100 hover:to-purple-100 p-5 rounded-2xl border border-indigo-100 cursor-pointer transition-all group flex items-center justify-between"
        >
          <div>
            <div className="text-xs font-bold text-indigo-700">직무 역량 정밀 측정</div>
            <div className="text-base font-extrabold text-slate-900 group-hover:text-indigo-900">
              직무 역량 진단 & 스킬 갭 확인하기 →
            </div>
            <div className="text-xs text-slate-500 mt-0.5">
              6대 핵심 지표 레이더 및 영문과 보유 강점 점검
            </div>
          </div>
          <ArrowRight className="w-5 h-5 text-indigo-700 group-hover:translate-x-1 transition-transform" />
        </div>

        <div 
          onClick={onNavigateToRoadmap}
          className="bg-gradient-to-r from-purple-50 to-pink-50 hover:from-purple-100 hover:to-pink-100 p-5 rounded-2xl border border-purple-100 cursor-pointer transition-all group flex items-center justify-between"
        >
          <div>
            <div className="text-xs font-bold text-purple-700">실천 계획 안내</div>
            <div className="text-base font-extrabold text-slate-900 group-hover:text-purple-900">
              학기별 맞춤형 로드맵 & 체크리스트 →
            </div>
            <div className="text-xs text-slate-500 mt-0.5">
              현재 학기, 방학, 다음 학기 체크리스트 실행
            </div>
          </div>
          <ArrowRight className="w-5 h-5 text-purple-700 group-hover:translate-x-1 transition-transform" />
        </div>
      </div>

    </div>
  );
};
