/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Header } from './components/Header';
import { LandingHero } from './components/LandingHero';
import { ProfileForm } from './components/ProfileForm';
import { CareerCounselingView } from './components/CareerCounselingView';
import { CareerDiagnosisView } from './components/CareerDiagnosisView';
import { RoadmapView } from './components/RoadmapView';
import { AICounselorDrawer } from './components/AICounselorDrawer';
import { DEMO_STUDENT_PROFILE } from './data/sampleProfiles';
import { CareerCounselingResult, CareerRoadmap, StudentProfile } from './types';
import { BookOpen, Sparkles, CheckCircle2, AlertCircle, Compass, Heart } from 'lucide-react';

export default function App() {
  const [currentTab, setCurrentTab] = useState<string>('landing');
  const [profile, setProfile] = useState<StudentProfile>(DEMO_STUDENT_PROFILE);
  const [counselingResult, setCounselingResult] = useState<CareerCounselingResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Chat Drawer State
  const [isChatOpen, setIsChatOpen] = useState<boolean>(false);
  const [chatInitialQuestion, setChatInitialQuestion] = useState<string | undefined>(undefined);

  // Fetch AI Career Counseling from Server
  const generateConsultation = async (targetProfile: StudentProfile) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/generate-counseling', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(targetProfile),
      });

      if (!response.ok) {
        throw new Error('진로 분석 데이터를 불러오는 중 오류가 발생했습니다.');
      }

      const data: CareerCounselingResult = await response.json();
      setCounselingResult(data);
      setCurrentTab('counseling');
    } catch (err: any) {
      console.error('Failed to generate counseling:', err);
      setError('AI 분석 중 일시적인 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
    } finally {
      setIsLoading(false);
    }
  };

  // Quick Demo Loader
  const handleLoadDemo = () => {
    setProfile(DEMO_STUDENT_PROFILE);
    generateConsultation(DEMO_STUDENT_PROFILE);
  };

  const handleUpdateRoadmap = (newRoadmap: CareerRoadmap) => {
    if (counselingResult) {
      setCounselingResult({
        ...counselingResult,
        roadmap: newRoadmap,
      });
    }
  };

  const handleAskQuestionInChat = (question: string) => {
    setChatInitialQuestion(question);
    setIsChatOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#fbfbfe] text-slate-800 flex flex-col font-sans">
      
      {/* Top Sticky Header */}
      <Header
        currentTab={currentTab}
        onSelectTab={(tab) => setCurrentTab(tab)}
        onLoadDemo={handleLoadDemo}
        onOpenChat={() => setIsChatOpen(true)}
        hasResult={!!counselingResult}
      />

      {/* Error Banner */}
      {error && (
        <div className="max-w-4xl mx-auto px-4 mt-4 w-full">
          <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-sm flex items-center justify-between gap-3 shadow-xs">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
              <span>{error}</span>
            </div>
            <button
              onClick={() => setError(null)}
              className="text-xs font-semibold underline text-rose-900"
            >
              닫기
            </button>
          </div>
        </div>
      )}

      {/* AI Analysis Loading Screen Overlay */}
      {isLoading && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-md w-full p-8 border border-purple-100 shadow-2xl text-center space-y-6 animate-in zoom-in-95 duration-200">
            <div className="relative w-20 h-20 mx-auto">
              <div className="w-20 h-20 rounded-full border-4 border-purple-100 border-t-purple-600 animate-spin" />
              <div className="absolute inset-0 flex items-center justify-center">
                <Sparkles className="w-8 h-8 text-purple-600 animate-pulse" />
              </div>
            </div>

            <div className="space-y-1">
              <h3 className="text-xl font-black text-slate-900 tracking-tight">
                Gemini AI 진로 컨설팅 분석 중
              </h3>
              <p className="text-xs text-slate-500">
                영문과 전공 특성과 학생 프로필을 융합하여 로드맵을 설계하고 있습니다.
              </p>
            </div>

            <div className="space-y-2 text-left bg-purple-50/70 p-4 rounded-2xl border border-purple-100/80 text-xs">
              <div className="flex items-center gap-2 text-purple-900 font-semibold">
                <CheckCircle2 className="w-4 h-4 text-purple-600 shrink-0" />
                <span>영문과 5대 전공 영역(문학/작문/번역/언어/문화) 역량 매핑</span>
              </div>
              <div className="flex items-center gap-2 text-indigo-900 font-semibold">
                <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0" />
                <span>출판·콘텐츠·마케팅 3대 추천 직무 및 역량 비교</span>
              </div>
              <div className="flex items-center gap-2 text-slate-700 font-semibold">
                <CheckCircle2 className="w-4 h-4 text-slate-500 shrink-0" />
                <span>현재 학기 · 다가오는 방학 · 다음 학기 실천 로드맵 생성</span>
              </div>
            </div>

            <div className="text-[11px] text-slate-400">
              안전한 서버 사이드 Gemini 3.8 Flash 엔진 구동 중
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="grow">
        {currentTab === 'landing' && (
          <LandingHero
            onStartConsulting={() => setCurrentTab('profile')}
            onLoadDemo={handleLoadDemo}
          />
        )}

        {currentTab === 'profile' && (
          <ProfileForm
            initialProfile={profile}
            onSubmit={(newProfile) => {
              setProfile(newProfile);
              generateConsultation(newProfile);
            }}
            isLoading={isLoading}
            onLoadDemo={handleLoadDemo}
          />
        )}

        {currentTab === 'counseling' && (
          counselingResult ? (
            <CareerCounselingView
              counseling={counselingResult}
              profile={profile}
              onNavigateToDiagnosis={() => setCurrentTab('diagnosis')}
              onNavigateToRoadmap={() => setCurrentTab('roadmap')}
              onAskQuestionInChat={handleAskQuestionInChat}
            />
          ) : (
            <div className="py-20 text-center max-w-md mx-auto px-4 space-y-4">
              <div className="w-14 h-14 rounded-3xl bg-purple-100 text-purple-700 flex items-center justify-center mx-auto shadow-xs">
                <Compass className="w-7 h-7" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900 mb-1">
                  아직 생성된 진로 분석 결과가 없습니다
                </h2>
                <p className="text-xs text-slate-500">
                  프로필 정보를 직접 입력하시거나 2학년 샘플 학생으로 바로 AI 진로 분석을 체험해 보세요.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-2 pt-2">
                <button
                  onClick={handleLoadDemo}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-1.5"
                >
                  <Sparkles className="w-4 h-4 text-purple-200" />
                  <span>2학년 샘플로 바로 체험</span>
                </button>
                <button
                  onClick={() => setCurrentTab('profile')}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-purple-200 bg-white hover:bg-purple-50 text-purple-900 font-semibold text-xs transition-colors"
                >
                  프로필 직접 입력하기
                </button>
              </div>
            </div>
          )
        )}

        {currentTab === 'diagnosis' && (
          counselingResult ? (
            <CareerDiagnosisView
              diagnosis={counselingResult.diagnosis}
              profile={profile}
              onNavigateToRoadmap={() => setCurrentTab('roadmap')}
              onAskQuestionInChat={handleAskQuestionInChat}
            />
          ) : (
            <div className="py-20 text-center max-w-md mx-auto px-4 space-y-4">
              <div className="w-14 h-14 rounded-3xl bg-indigo-100 text-indigo-700 flex items-center justify-center mx-auto shadow-xs">
                <Compass className="w-7 h-7" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900 mb-1">
                  역량 진단 결과가 아직 없습니다
                </h2>
                <p className="text-xs text-slate-500">
                  학생 프로필을 입력하시면 6대 직무 역량 지표와 스킬 갭 분석이 제공됩니다.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-2 pt-2">
                <button
                  onClick={handleLoadDemo}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-indigo-700 hover:bg-indigo-800 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-1.5"
                >
                  <Sparkles className="w-4 h-4 text-indigo-200" />
                  <span>2학년 샘플로 바로 체험</span>
                </button>
                <button
                  onClick={() => setCurrentTab('profile')}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-indigo-200 bg-white hover:bg-indigo-50 text-indigo-900 font-semibold text-xs transition-colors"
                >
                  프로필 직접 입력하기
                </button>
              </div>
            </div>
          )
        )}

        {currentTab === 'roadmap' && (
          counselingResult ? (
            <RoadmapView
              roadmap={counselingResult.roadmap}
              profile={profile}
              recommendedRoles={counselingResult.recommendedPaths?.map(p => p.title)}
              onUpdateRoadmap={handleUpdateRoadmap}
              onAskQuestionInChat={handleAskQuestionInChat}
            />
          ) : (
            <div className="py-20 text-center max-w-md mx-auto px-4 space-y-4">
              <div className="w-14 h-14 rounded-3xl bg-purple-100 text-purple-700 flex items-center justify-center mx-auto shadow-xs">
                <Compass className="w-7 h-7" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900 mb-1">
                  실천 로드맵 데이터가 아직 없습니다
                </h2>
                <p className="text-xs text-slate-500">
                  프로필 진단을 먼저 진행하시거나 2학년 샘플로 학기별 로드맵을 확인해 보세요.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-2 pt-2">
                <button
                  onClick={handleLoadDemo}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-1.5"
                >
                  <Sparkles className="w-4 h-4 text-purple-200" />
                  <span>2학년 샘플로 바로 체험</span>
                </button>
                <button
                  onClick={() => setCurrentTab('profile')}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-purple-200 bg-white hover:bg-purple-50 text-purple-900 font-semibold text-xs transition-colors"
                >
                  프로필 직접 입력하기
                </button>
              </div>
            </div>
          )
        )}
      </main>

      {/* AI Counselor Chat Drawer Modal */}
      <AICounselorDrawer
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        profile={profile}
        initialQuestion={chatInitialQuestion}
        onClearInitialQuestion={() => setChatInitialQuestion(undefined)}
      />

      {/* Global Modern Footer */}
      <footer className="bg-slate-900 text-slate-400 text-xs py-10 border-t border-slate-800 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-purple-700 text-white flex items-center justify-center font-bold">
                <BookOpen className="w-4 h-4 text-purple-200" />
              </div>
              <div>
                <div className="font-bold text-white text-sm">ENGLISH CAREER MATE</div>
                <div className="text-[11px] text-slate-400">
                  전공에서 커리어로 이어지는 나만의 진로 로드맵
                </div>
              </div>
            </div>

            <div className="text-center md:text-right space-y-1">
              <p className="text-slate-400">
                영어영문학과 학부생을 위한 AI 진로 컨설팅 및 학기별 실천 로드맵 플랫폼
              </p>
              <p className="text-slate-500 text-[10px]">
                Powered by Gemini AI · Client & Server Full-Stack Architecture
              </p>
            </div>

          </div>

          <div className="mt-8 pt-6 border-t border-slate-800 text-center text-slate-500 text-[11px] flex flex-col sm:flex-row items-center justify-between gap-2">
            <span>© 2026 ENGLISH CAREER MATE. All rights reserved.</span>
            <span className="flex items-center gap-1">
              영문과 학우들의 찬란한 진로를 응원합니다
              <Heart className="w-3.5 h-3.5 text-purple-400 inline" />
            </span>
          </div>
        </div>
      </footer>

    </div>
  );
}
