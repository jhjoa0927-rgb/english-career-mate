import React, { useState } from 'react';
import { BookOpen, Sparkles, MessageSquare, Compass, BarChart2, Calendar, Menu, X, CheckCircle2 } from 'lucide-react';

interface HeaderProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  onLoadDemo: () => void;
  onOpenChat: () => void;
  hasResult: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onSelectTab,
  onLoadDemo,
  onOpenChat,
  hasResult
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'landing', label: '홈', icon: Compass },
    { id: 'profile', label: '프로필 진단', icon: BookOpen },
    { id: 'counseling', label: 'AI 진로 상담', icon: Sparkles, requiresResult: true },
    { id: 'diagnosis', label: '직무 역량 진단', icon: BarChart2, requiresResult: true },
    { id: 'roadmap', label: '학기별 로드맵', icon: Calendar, requiresResult: true },
  ];

  const handleNavClick = (id: string, requiresResult?: boolean) => {
    if (requiresResult && !hasResult) {
      onSelectTab('profile');
    } else {
      onSelectTab(id);
    }
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-purple-100 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Brand Logo */}
          <div 
            onClick={() => handleNavClick('landing')}
            className="flex items-center gap-3 cursor-pointer group select-none"
          >
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-br from-indigo-900 via-indigo-800 to-purple-700 flex items-center justify-center text-white shadow-md shadow-purple-900/10 group-hover:scale-105 transition-transform">
              <BookOpen className="w-5 h-5 text-purple-200" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-base sm:text-lg tracking-tight text-slate-900 font-sans">
                  ENGLISH CAREER MATE
                </span>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-purple-100 text-purple-700 border border-purple-200">
                  영문과 특화
                </span>
              </div>
              <p className="text-xs text-slate-500 hidden sm:block">
                영문과 학생을 위한 AI 진로 나침반 & 로드맵
              </p>
            </div>
          </div>

          {/* Desktop Nav Items */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              const isLocked = item.requiresResult && !hasResult;

              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id, item.requiresResult)}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-medium transition-all relative ${
                    isActive
                      ? 'bg-purple-100/80 text-purple-900 shadow-xs'
                      : isLocked
                      ? 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'
                      : 'text-slate-600 hover:text-purple-800 hover:bg-purple-50/60'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-purple-700' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                  {item.requiresResult && hasResult && (
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={onLoadDemo}
              className="hidden lg:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-purple-200 bg-purple-50/70 text-xs font-semibold text-purple-800 hover:bg-purple-100 transition-colors shadow-xs"
              title="2학년 샘플 학생 프로필을 즉시 불러옵니다"
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-purple-600" />
              <span>2학년 샘플 프로필</span>
            </button>

            <button
              onClick={onOpenChat}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-indigo-950 text-white text-xs sm:text-sm font-medium shadow-sm transition-all hover:shadow-md active:scale-95"
            >
              <MessageSquare className="w-4 h-4 text-purple-300" />
              <span className="hidden sm:inline">AI 1:1 멘토 챗</span>
              <span className="sm:hidden">상담챗</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            </button>

            {/* Mobile menu trigger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-purple-50"
              aria-label="메뉴 열기"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-3 px-2 border-t border-purple-100 bg-white/95 backdrop-blur-lg rounded-b-2xl shadow-xl animate-in slide-in-from-top-2 duration-200">
            <div className="space-y-1 mb-3">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id, item.requiresResult)}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm font-medium text-left ${
                      isActive
                        ? 'bg-purple-100 text-purple-900 font-bold'
                        : 'text-slate-700 hover:bg-purple-50'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className="w-4 h-4 text-purple-600" />
                      <span>{item.label}</span>
                    </div>
                    {item.requiresResult && hasResult && (
                      <span className="text-[10px] bg-emerald-100 text-emerald-700 font-semibold px-2 py-0.5 rounded-full">
                        생성됨
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            <div className="pt-2 border-t border-slate-100">
              <button
                onClick={() => {
                  onLoadDemo();
                  setMobileMenuOpen(false);
                }}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-purple-200 bg-purple-50 text-purple-800 text-xs font-semibold"
              >
                <CheckCircle2 className="w-4 h-4 text-purple-600" />
                <span>2학년 샘플 학생으로 바로 체험하기</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
