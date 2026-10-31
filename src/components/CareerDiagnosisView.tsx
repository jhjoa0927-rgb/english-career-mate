import React from 'react';
import { CareerDiagnosis, StudentProfile } from '../types';
import { 
  BarChart2, 
  CheckCircle2, 
  AlertTriangle, 
  Lightbulb, 
  BookOpen, 
  Award, 
  ExternalLink,
  Target,
  ArrowRight,
  TrendingUp,
  FolderKanban
} from 'lucide-react';

interface CareerDiagnosisViewProps {
  diagnosis: CareerDiagnosis;
  profile: StudentProfile;
  onNavigateToRoadmap: () => void;
  onAskQuestionInChat: (question: string) => void;
}

export const CareerDiagnosisView: React.FC<CareerDiagnosisViewProps> = ({
  diagnosis,
  profile,
  onNavigateToRoadmap,
  onAskQuestionInChat,
}) => {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-12">
      
      {/* Page Title & Intro */}
      <div className="text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-100 text-indigo-800 text-xs font-semibold mb-3">
          <BarChart2 className="w-3.5 h-3.5" />
          <span>영문과 실무 역량 정밀 진단</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          직무 역량 진단 & 스킬 갭(Gap) 솔루션
        </h1>
        <p className="text-sm sm:text-base text-slate-600 mt-2">
          {profile.year} 영문과 재학생의 인문학적 강점을 측정하고, 기업 채용 시장에서 요구하는 실무 스킬과의 격차를 해소하기 위한 로드맵을 제공합니다.
        </p>
      </div>

      {/* 1. 6대 핵심 역량 지표 */}
      <div className="bg-white rounded-3xl border border-purple-100 p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
          <div>
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <Target className="w-5 h-5 text-purple-700" />
              <span>영문과 6대 핵심 직무 역량 분석</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              전공 지식과 실무 준비도를 종합 진단한 지표입니다.
            </p>
          </div>
          <div className="text-xs font-semibold px-3 py-1 rounded-lg bg-purple-50 text-purple-800 border border-purple-200">
            평균 역량 지수: {Math.round(diagnosis.competencyScores.reduce((acc, c) => acc + c.score, 0) / diagnosis.competencyScores.length)}점 / 100점
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {diagnosis.competencyScores.map((comp, idx) => {
            const isHigh = comp.score >= 80;
            const isModerate = comp.score >= 65 && comp.score < 80;
            const colorClass = isHigh ? 'bg-purple-600' : isModerate ? 'bg-indigo-600' : 'bg-amber-500';
            const badgeClass = isHigh ? 'bg-purple-100 text-purple-800' : isModerate ? 'bg-indigo-100 text-indigo-800' : 'bg-amber-100 text-amber-800';

            return (
              <div key={idx} className="p-4 rounded-2xl bg-slate-50/70 border border-slate-200/70 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="font-bold text-sm text-slate-900">{comp.name}</div>
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${badgeClass}`}>
                      {isHigh ? '탁월' : isModerate ? '우수' : '보완필요'}
                    </span>
                    <span className="text-sm font-extrabold text-slate-900">{comp.score}점</span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${colorClass} transition-all duration-700 rounded-full`} 
                    style={{ width: `${comp.score}%` }} 
                  />
                </div>

                <p className="text-xs text-slate-500 leading-snug">
                  {comp.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. 보유 강점 (Core Strengths) */}
      <div>
        <div className="mb-4">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full mb-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Competitive Edge</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
            기업 채용 시장에서 빛나는 영문과 보유 강점
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            전공 수업과 활동을 통해 이미 체득한 고유의 무기입니다.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {diagnosis.coreStrengths.map((str, idx) => (
            <div key={idx} className="bg-white rounded-2xl p-6 border border-emerald-100 shadow-xs flex flex-col justify-between">
              <div>
                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold text-xs mb-3">
                  0{idx + 1}
                </div>
                <h3 className="font-bold text-base text-slate-900 mb-2">{str.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed mb-4">
                  {str.description}
                </p>
              </div>
              <div className="pt-3 border-t border-slate-100 bg-emerald-50/50 p-2.5 rounded-xl text-xs text-emerald-900">
                <span className="font-semibold text-emerald-800">시장 적용점: </span>
                <span>{str.marketValue}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. 스킬 갭 분석 & 실천적 극복 방안 (Skill Gaps) */}
      <div>
        <div className="mb-4">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-800 bg-amber-50 px-3 py-1 rounded-full mb-1">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Skill Gaps & Solutions</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
            영문과 학생이 겪기 쉬운 실무 스킬 갭과 극복법
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            많은 영문과 학생들이 혼자 끙끙 앓는 취업 문턱을 어떻게 돌파할 수 있는지 구체적으로 알려드립니다.
          </p>
        </div>

        <div className="space-y-4">
          {diagnosis.skillGaps.map((gap, idx) => (
            <div key={idx} className="bg-white rounded-2xl p-6 border border-amber-200/80 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-md bg-amber-100 text-amber-800 font-extrabold text-xs flex items-center justify-center">
                    !
                  </span>
                  <h3 className="font-bold text-base text-slate-900">
                    부족한 역량: {gap.skill}
                  </h3>
                </div>
                <button
                  onClick={() => onAskQuestionInChat(`'${gap.skill}'을 보완하기 위해 영문과 2~3학년 수준에서 가장 쉽게 시작할 수 있는 방법은 무엇인가요?`)}
                  className="text-xs text-purple-700 hover:text-purple-900 font-semibold flex items-center gap-1 self-start sm:self-auto"
                >
                  <span>이 부분 멘토에게 자세히 묻기</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/60">
                  <span className="font-bold text-slate-700 block mb-1">발생 원인</span>
                  <p className="text-slate-600 leading-relaxed">{gap.reason}</p>
                </div>

                <div className="bg-purple-50/60 p-3 rounded-xl border border-purple-100">
                  <span className="font-bold text-purple-900 block mb-1">실천적 솔루션</span>
                  <p className="text-purple-800 leading-relaxed">{gap.solution}</p>
                </div>

                <div className="bg-indigo-50/60 p-3 rounded-xl border border-indigo-100">
                  <span className="font-bold text-indigo-900 block mb-1">추천 학습/자료</span>
                  <p className="text-indigo-800 leading-relaxed">{gap.recommendedResource}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. 구체적 개선 실천 과제 (Practical Actions) */}
      <div className="bg-white rounded-3xl border border-purple-100 p-6 sm:p-8 shadow-sm">
        <div className="flex items-center gap-2 mb-2">
          <FolderKanban className="w-5 h-5 text-purple-700" />
          <h2 className="text-xl font-bold text-slate-900">
            추천 실무 프로젝트 & 자격/수강 액션
          </h2>
        </div>
        <p className="text-xs sm:text-sm text-slate-500 mb-6">
          단순 스펙 쌓기가 아닌, 취업 서류에서 증명 가능한 핵심 활동 리스트입니다.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {diagnosis.practicalActions.map((act, idx) => {
            const importanceBadge = 
              act.importance === '필수' ? 'bg-rose-100 text-rose-800 border-rose-200' :
              act.importance === '권장' ? 'bg-purple-100 text-purple-800 border-purple-200' :
              'bg-slate-100 text-slate-700 border-slate-200';

            return (
              <div key={idx} className="p-4 rounded-2xl bg-purple-50/40 border border-purple-100 hover:border-purple-200 transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-white border border-purple-200 text-purple-900">
                    {act.category}
                  </span>
                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-slate-500">{act.timing}</span>
                    <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full border ${importanceBadge}`}>
                      {act.importance}
                    </span>
                  </div>
                </div>

                <div className="font-bold text-sm text-slate-900 mb-1">
                  {act.title}
                </div>
                <p className="text-xs text-slate-600">
                  {act.target}
                </p>
              </div>
            );
          })}
        </div>

        <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-slate-500">
            이 진단 결과를 바탕으로 학기별 체크리스트 로드맵이 자동 생성되었습니다.
          </div>
          <button
            onClick={onNavigateToRoadmap}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2"
          >
            <span>학기별 실천 로드맵 확인하기</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

    </div>
  );
};
