import React from 'react';
import { 
  Sparkles, 
  BarChart2, 
  Calendar, 
  ArrowRight, 
  CheckCircle, 
  BookOpen, 
  Award, 
  Users, 
  Layers, 
  Feather, 
  TrendingUp,
  HelpCircle
} from 'lucide-react';

interface LandingHeroProps {
  onStartConsulting: () => void;
  onLoadDemo: () => void;
}

export const LandingHero: React.FC<LandingHeroProps> = ({
  onStartConsulting,
  onLoadDemo,
}) => {
  return (
    <div className="relative overflow-hidden">
      {/* Decorative Background Lavender Gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-purple-100/60 via-indigo-50/40 to-transparent pointer-events-none -z-10 blur-3xl opacity-70" />
      <div className="absolute top-20 right-10 w-72 h-72 rounded-full bg-purple-200/30 blur-2xl pointer-events-none -z-10" />

      {/* Hero Content */}
      <section className="pt-10 sm:pt-16 pb-14 sm:pb-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto text-center">
        
        {/* Top Tag Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-100/80 border border-purple-200 text-purple-900 text-xs sm:text-sm font-semibold mb-6 shadow-xs animate-in fade-in zoom-in duration-300">
          <BookOpen className="w-4 h-4 text-purple-600" />
          <span>ENGLISH CAREER MATE · 영어영문학과 전공자 전용</span>
        </div>

        {/* Main Headline */}
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.2] mb-6">
          전공에서 커리어로 이어지는 <br className="hidden sm:inline" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-700 via-indigo-800 to-slate-900">
            나만의 진로 로드맵
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-base sm:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed mb-10">
          영문과 학생을 위한 AI 진로 컨설팅 서비스. <br className="hidden sm:inline" />
          원서 강독과 문학적 통찰을 실무 역량으로 치환하고, 학기별 구체적인 실행 계획을 완성하세요.
        </p>

        {/* Call to Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 max-w-md mx-auto mb-12">
          <button
            onClick={onStartConsulting}
            className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-slate-900 hover:bg-indigo-950 text-white font-semibold text-base shadow-lg shadow-purple-950/20 hover:shadow-xl transition-all flex items-center justify-center gap-2 group active:scale-98"
          >
            <span>진로 상담 시작하기</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>

          <button
            onClick={onLoadDemo}
            className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-white hover:bg-purple-50 text-purple-900 border border-purple-200 font-semibold text-base shadow-xs hover:border-purple-300 transition-all flex items-center justify-center gap-2 active:scale-98"
          >
            <CheckCircle className="w-4 h-4 text-purple-600" />
            <span>2학년 샘플로 바로 체험</span>
          </button>
        </div>

        {/* Trust & Stats Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 max-w-4xl mx-auto pt-6 border-t border-purple-100 text-left">
          <div className="p-3 sm:p-4 rounded-xl bg-white/70 border border-purple-100/80 shadow-xs">
            <div className="text-xs text-slate-500 font-medium mb-1">영문과 특화 직무</div>
            <div className="text-lg sm:text-xl font-bold text-purple-950">15+ 맞춤 포지션</div>
          </div>
          <div className="p-3 sm:p-4 rounded-xl bg-white/70 border border-purple-100/80 shadow-xs">
            <div className="text-xs text-slate-500 font-medium mb-1">역량 갭 진단</div>
            <div className="text-lg sm:text-xl font-bold text-indigo-950">6대 핵심 지표</div>
          </div>
          <div className="p-3 sm:p-4 rounded-xl bg-white/70 border border-purple-100/80 shadow-xs">
            <div className="text-xs text-slate-500 font-medium mb-1">학기별 로드맵</div>
            <div className="text-lg sm:text-xl font-bold text-purple-950">실천형 체크리스트</div>
          </div>
          <div className="p-3 sm:p-4 rounded-xl bg-white/70 border border-purple-100/80 shadow-xs">
            <div className="text-xs text-slate-500 font-medium mb-1">심층 1:1 멘토링</div>
            <div className="text-lg sm:text-xl font-bold text-indigo-950">실시간 질의응답</div>
          </div>
        </div>
      </section>

      {/* Three Main Feature Cards */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-purple-700 bg-purple-100/80 px-3 py-1 rounded-full">
            Core Features
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-3">
            영문과 학생을 위한 3단계 진로 솔루션
          </h2>
          <p className="text-sm sm:text-base text-slate-600 mt-2 max-w-xl mx-auto">
            막연한 취업 걱정을 넘어, 전공의 깊이를 살려 산업계에서 인정받는 전략을 완성합니다.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          
          {/* Card 1: AI 진로 상담 */}
          <div className="bg-white rounded-2xl p-7 border border-purple-100 shadow-sm hover:shadow-md transition-all relative flex flex-col group hover:-translate-y-1">
            <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center mb-5 group-hover:bg-purple-600 group-hover:text-white transition-colors">
              <Sparkles className="w-6 h-6" />
            </div>
            <div className="text-xs font-semibold text-purple-600 mb-1">STEP 01</div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">AI 진로 상담</h3>
            <p className="text-slate-600 text-sm leading-relaxed mb-4 grow">
              영문학의 텍스트 분석력, 서사 이해도, 문화적 맥락 소통력을 바탕으로 학생에게 가장 적합한 3대 커리어 패스를 엄선하여 추천합니다.
            </p>
            <ul className="text-xs text-slate-600 space-y-2 pt-3 border-t border-slate-100">
              <li className="flex items-center gap-2">
                <CheckCircle className="w-3.5 h-3.5 text-purple-600" />
                <span>영문과 전공 연계 강점 상세 분석</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-3.5 h-3.5 text-purple-600" />
                <span>IT/출판/글로벌 3대 추천 직무</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-3.5 h-3.5 text-purple-600" />
                <span>이번 주 실천 가능한 첫 걸음 액션</span>
              </li>
            </ul>
          </div>

          {/* Card 2: 직무 역량 진단 */}
          <div className="bg-white rounded-2xl p-7 border border-indigo-100 shadow-sm hover:shadow-md transition-all relative flex flex-col group hover:-translate-y-1">
            <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center mb-5 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
              <BarChart2 className="w-6 h-6" />
            </div>
            <div className="text-xs font-semibold text-indigo-600 mb-1">STEP 02</div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">직무 역량 진단</h3>
            <p className="text-slate-600 text-sm leading-relaxed mb-4 grow">
              현재 보유한 인문학적 강점과 실제 기업 채용 시장에서 요구하는 실무 스킬 간의 갭(Gap)을 정밀하게 진단하고 보완 전략을 제시합니다.
            </p>
            <ul className="text-xs text-slate-600 space-y-2 pt-3 border-t border-slate-100">
              <li className="flex items-center gap-2">
                <CheckCircle className="w-3.5 h-3.5 text-indigo-600" />
                <span>6대 핵심 역량 다이어그램 지표</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-3.5 h-3.5 text-indigo-600" />
                <span>영문과 전공자가 겪는 실무 스킬 갭 파악</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-3.5 h-3.5 text-indigo-600" />
                <span>추천 프로젝트 & 자격증/어학 가이드</span>
              </li>
            </ul>
          </div>

          {/* Card 3: 맞춤형 진로 로드맵 */}
          <div className="bg-white rounded-2xl p-7 border border-purple-100 shadow-sm hover:shadow-md transition-all relative flex flex-col group hover:-translate-y-1">
            <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center mb-5 group-hover:bg-slate-900 group-hover:text-white transition-colors">
              <Calendar className="w-6 h-6" />
            </div>
            <div className="text-xs font-semibold text-purple-600 mb-1">STEP 03</div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">맞춤형 진로 로드맵</h3>
            <p className="text-slate-600 text-sm leading-relaxed mb-4 grow">
              ‘현재 학기 → 방학 기간 → 다음 학기’로 이어지는 단계별 실천 과제를 체크리스트로 제공하여 실행력을 극대화합니다.
            </p>
            <ul className="text-xs text-slate-600 space-y-2 pt-3 border-t border-slate-100">
              <li className="flex items-center gap-2">
                <CheckCircle className="w-3.5 h-3.5 text-purple-600" />
                <span>체크박스로 실시간 달성률 측정</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-3.5 h-3.5 text-purple-600" />
                <span>학점/대외활동/어학/포트폴리오 분류</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-3.5 h-3.5 text-purple-600" />
                <span>4학년 졸업 시점 기대 포트폴리오 비전</span>
              </li>
            </ul>
          </div>

        </div>
      </section>

      {/* Why English Lit Matters in Modern Industry */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-purple-950 rounded-3xl p-8 sm:p-12 text-white shadow-xl">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-purple-200 text-xs font-semibold mb-4">
              <Feather className="w-3.5 h-3.5" />
              <span>영문학 전공의 새로운 가치</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-extrabold mb-4 leading-snug">
              “문과는 취업이 어렵다?” <br />
              <span className="text-purple-300">텍스트와 서사를 다루는 사람은 AI 시대에 더 귀해집니다.</span>
            </h3>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-6">
              인공지능이 코드를 짜는 시대일수록, 문맥(Context)을 꿰뚫고 인간의 심리에 닿는 정밀한 언어를 설계하는 역량은 강력한 무기가 됩니다. 영문과의 원서 독해, 비평, 서사 분석은 IT 서비스의 UX 라이팅, 글로벌 콘텐츠 브랜딩, 출판 IP 기획의 강력한 기초 체력입니다.
            </p>
            <div className="flex flex-wrap gap-2 text-xs font-medium text-purple-200">
              <span className="bg-white/10 px-3 py-1.5 rounded-lg"># UX 라이터 & 마이크로카피</span>
              <span className="bg-white/10 px-3 py-1.5 rounded-lg"># 글로벌 콘텐츠 에디터</span>
              <span className="bg-white/10 px-3 py-1.5 rounded-lg"># 출판 및 원천 IP 기획</span>
              <span className="bg-white/10 px-3 py-1.5 rounded-lg"># 크로스보더 커머스 마케터</span>
            </div>
          </div>
        </div>
      </section>

      {/* Common English Lit Student Worries & FAQ Preview */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h3 className="text-xl sm:text-2xl font-bold text-slate-900">
            영문과 학우들이 가장 많이 고민하는 질문
          </h3>
          <p className="text-slate-500 text-sm mt-1">
            프로필을 입력하시면 이러한 고민에 대한 AI의 맞춤형 솔루션을 받아보실 수 있습니다.
          </p>
        </div>

        <div className="space-y-3">
          <div className="bg-white p-4 sm:p-5 rounded-xl border border-purple-100 flex items-start gap-3">
            <HelpCircle className="w-5 h-5 text-purple-600 shrink-0 mt-0.5" />
            <div>
              <div className="font-semibold text-sm sm:text-base text-slate-800">
                “경영학이나 미컴 복수전공을 꼭 해야 취업할 수 있나요?”
              </div>
              <p className="text-xs sm:text-sm text-slate-600 mt-1">
                직무에 따라 다릅니다. UX 라이팅이나 콘텐츠 에디터 직군은 복수전공 학점보다 실무 포트폴리오(개인 채널, 케이스 스터디)가 훨씬 높은 비중을 차지합니다.
              </p>
            </div>
          </div>

          <div className="bg-white p-4 sm:p-5 rounded-xl border border-purple-100 flex items-start gap-3">
            <HelpCircle className="w-5 h-5 text-purple-600 shrink-0 mt-0.5" />
            <div>
              <div className="font-semibold text-sm sm:text-base text-slate-800">
                “영문과 수업에서 쓴 문학 에세이를 포트폴리오로 쓸 수 있나요?”
              </div>
              <p className="text-xs sm:text-sm text-slate-600 mt-1">
                네, 원서 비평 과제를 현대적 브랜드 관점이나 디지털 매거진 형태의 아티클로 리팩토링하면 훌륭한 인사이트 기획서가 됩니다.
              </p>
            </div>
          </div>

          <div className="bg-white p-4 sm:p-5 rounded-xl border border-purple-100 flex items-start gap-3">
            <HelpCircle className="w-5 h-5 text-purple-600 shrink-0 mt-0.5" />
            <div>
              <div className="font-semibold text-sm sm:text-base text-slate-800">
                “2학년인데 지금 당장 무엇부터 시작해야 하나요?”
              </div>
              <p className="text-xs sm:text-sm text-slate-600 mt-1">
                관심 있는 분야의 텍스트를 직접 써서 세상에 내보내는 연습(브런치 연재, 도서 계정)과 실무 협업 도구(피그마, 노션)를 가볍게 익히는 것이 1순위입니다.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-10 text-center">
          <button
            onClick={onStartConsulting}
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-semibold text-sm sm:text-base shadow-md hover:shadow-lg transition-all"
          >
            <span>지금 내 학년과 고민으로 진로 진단 받기</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>

    </div>
  );
};
