import React, { useState } from 'react';
import { 
  StudentProfile 
} from '../types';
import { 
  COMMON_INTERESTS, 
  COMMON_STRENGTHS, 
  COMMON_EXPERIENCES, 
  COMMON_CONCERNS,
  DEMO_STUDENT_PROFILE 
} from '../data/sampleProfiles';
import { 
  Sparkles, 
  Plus, 
  X, 
  Check, 
  BookOpen, 
  Compass, 
  Lightbulb, 
  AlertCircle,
  RotateCcw,
  GraduationCap
} from 'lucide-react';

interface ProfileFormProps {
  initialProfile: StudentProfile;
  onSubmit: (profile: StudentProfile) => void;
  isLoading: boolean;
  onLoadDemo: () => void;
}

export const ProfileForm: React.FC<ProfileFormProps> = ({
  initialProfile,
  onSubmit,
  isLoading,
  onLoadDemo,
}) => {
  const [profile, setProfile] = useState<StudentProfile>(initialProfile);
  const [customInterest, setCustomInterest] = useState('');
  const [customStrength, setCustomStrength] = useState('');
  const [customExperience, setCustomExperience] = useState('');

  const years: StudentProfile['year'][] = ['1학년', '2학년', '3학년', '4학년', '졸업유예'];

  const toggleInterest = (item: string) => {
    if (profile.interests.includes(item)) {
      setProfile({
        ...profile,
        interests: profile.interests.filter((i) => i !== item)
      });
    } else {
      setProfile({
        ...profile,
        interests: [...profile.interests, item]
      });
    }
  };

  const addCustomInterest = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!customInterest.trim()) return;
    if (!profile.interests.includes(customInterest.trim())) {
      setProfile({
        ...profile,
        interests: [...profile.interests, customInterest.trim()]
      });
    }
    setCustomInterest('');
  };

  const toggleStrength = (item: string) => {
    if (profile.strengths.includes(item)) {
      setProfile({
        ...profile,
        strengths: profile.strengths.filter((s) => s !== item)
      });
    } else {
      setProfile({
        ...profile,
        strengths: [...profile.strengths, item]
      });
    }
  };

  const addCustomStrength = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!customStrength.trim()) return;
    if (!profile.strengths.includes(customStrength.trim())) {
      setProfile({
        ...profile,
        strengths: [...profile.strengths, customStrength.trim()]
      });
    }
    setCustomStrength('');
  };

  const toggleExperience = (item: string) => {
    if (profile.experiences.includes(item)) {
      setProfile({
        ...profile,
        experiences: profile.experiences.filter((exp) => exp !== item)
      });
    } else {
      setProfile({
        ...profile,
        experiences: [...profile.experiences, item]
      });
    }
  };

  const addCustomExperience = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!customExperience.trim()) return;
    if (!profile.experiences.includes(customExperience.trim())) {
      setProfile({
        ...profile,
        experiences: [...profile.experiences, customExperience.trim()]
      });
    }
    setCustomExperience('');
  };

  const handleApplyPresetConcern = (concern: string) => {
    setProfile({
      ...profile,
      careerConcerns: concern
    });
  };

  const [validationError, setValidationError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    if (profile.interests.length === 0) {
      setValidationError('관심 분야를 최소 1개 이상 선택하거나 직접 입력해 주세요.');
      return;
    }

    if (profile.strengths.length === 0) {
      setValidationError('보유 역량 및 전공 강점을 최소 1개 이상 선택하거나 직접 입력해 주세요.');
      return;
    }

    if (!profile.careerConcerns.trim()) {
      setValidationError('현재 가장 고민되는 점(진로/취업 걱정거리)을 작성해 주세요. (추천 고민 칩을 클릭하셔도 됩니다)');
      return;
    }

    onSubmit(profile);
  };

  const handleReset = () => {
    setValidationError(null);
    setProfile({
      year: '2학년',
      interests: [],
      strengths: [],
      experiences: [],
      careerInterests: '',
      careerConcerns: ''
    });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 rounded-3xl p-6 sm:p-8 text-white mb-8 shadow-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-purple-200 text-xs font-semibold mb-2">
              <GraduationCap className="w-3.5 h-3.5" />
              <span>영문과 진로 맞춤 진단서</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              학생 프로필 & 진로 고민 입력
            </h1>
            <p className="text-purple-200 text-xs sm:text-sm mt-1">
              현재 학년과 관심사를 바탕으로 Gemini AI가 3대 진로와 학기별 로드맵을 설계합니다.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                setProfile(DEMO_STUDENT_PROFILE);
              }}
              className="px-4 py-2 rounded-xl bg-purple-500/20 hover:bg-purple-500/30 border border-purple-300/40 text-purple-100 text-xs sm:text-sm font-semibold flex items-center gap-1.5 transition-colors"
            >
              <Lightbulb className="w-4 h-4 text-purple-300" />
              <span>2학년 샘플 불러오기</span>
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-colors"
              title="초기화"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Form Card */}
      <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-purple-100 p-6 sm:p-10 shadow-sm space-y-10">
        
        {/* 1. 학년 선택 */}
        <div>
          <label className="block text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-purple-100 text-purple-700 font-extrabold text-xs flex items-center justify-center">
              1
            </span>
            <span>현재 학년 (재학 상태)</span>
            <span className="text-purple-600 text-xs">* 필수</span>
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
            {years.map((y) => (
              <button
                key={y}
                type="button"
                onClick={() => setProfile({ ...profile, year: y })}
                className={`py-3 px-4 rounded-xl text-sm font-semibold border transition-all text-center flex items-center justify-center gap-2 ${
                  profile.year === y
                    ? 'bg-purple-900 text-white border-purple-900 shadow-sm'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-purple-50 hover:border-purple-200'
                }`}
              >
                {profile.year === y && <Check className="w-3.5 h-3.5" />}
                <span>{y}</span>
              </button>
            ))}
          </div>
        </div>

        {/* 2. 관심 분야 */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <label className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-purple-100 text-purple-700 font-extrabold text-xs flex items-center justify-center">
                2
              </span>
              <span>관심 분야 & 학문적 흥미</span>
              <span className="text-xs text-slate-500 font-normal">
                (원하는 키워드를 클릭하거나 직접 추가하세요)
              </span>
            </label>
            <span className="text-xs font-semibold text-purple-700">
              {profile.interests.length}개 선택됨
            </span>
          </div>

          <div className="flex flex-wrap gap-2 mb-3">
            {COMMON_INTERESTS.map((item) => {
              const isSelected = profile.interests.includes(item);
              return (
                <button
                  key={item}
                  type="button"
                  onClick={() => toggleInterest(item)}
                  className={`text-xs px-3.5 py-2 rounded-xl font-medium transition-all flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-purple-700 text-white shadow-xs'
                      : 'bg-purple-50/80 text-purple-900 hover:bg-purple-100 border border-purple-200/60'
                  }`}
                >
                  {isSelected && <Check className="w-3 h-3" />}
                  <span>{item}</span>
                </button>
              );
            })}
          </div>

          {/* Custom Interest Input */}
          <div className="flex gap-2">
            <input
              type="text"
              value={customInterest}
              onChange={(e) => setCustomInterest(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addCustomInterest(e)}
              placeholder="직접 입력 (예: 영미 드라마 번역, 인터랙티브 픽션)"
              className="grow px-3.5 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500 bg-slate-50/50"
            />
            <button
              type="button"
              onClick={() => addCustomInterest()}
              className="px-3.5 py-2 rounded-xl bg-purple-100 hover:bg-purple-200 text-purple-800 text-xs font-semibold flex items-center gap-1 shrink-0 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>추가</span>
            </button>
          </div>
        </div>

        {/* 3. 보유 역량 및 강점 */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <label className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-purple-100 text-purple-700 font-extrabold text-xs flex items-center justify-center">
                3
              </span>
              <span>스스로 생각하는 보유 역량 및 전공 강점</span>
              <span className="text-xs text-slate-500 font-normal">
                (영문과 수업이나 개인 활동을 통해 얻은 것)
              </span>
            </label>
            <span className="text-xs font-semibold text-purple-700">
              {profile.strengths.length}개 선택됨
            </span>
          </div>

          <div className="flex flex-wrap gap-2 mb-3">
            {COMMON_STRENGTHS.map((item) => {
              const isSelected = profile.strengths.includes(item);
              return (
                <button
                  key={item}
                  type="button"
                  onClick={() => toggleStrength(item)}
                  className={`text-xs px-3.5 py-2 rounded-xl font-medium transition-all flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-indigo-700 text-white shadow-xs'
                      : 'bg-indigo-50/80 text-indigo-900 hover:bg-indigo-100 border border-indigo-200/60'
                  }`}
                >
                  {isSelected && <Check className="w-3 h-3" />}
                  <span>{item}</span>
                </button>
              );
            })}
          </div>

          {/* Custom Strength Input */}
          <div className="flex gap-2">
            <input
              type="text"
              value={customStrength}
              onChange={(e) => setCustomStrength(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addCustomStrength(e)}
              placeholder="직접 입력 (예: 해외 뉴스 클리핑 요약력, 구두 프레젠테이션)"
              className="grow px-3.5 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500 bg-slate-50/50"
            />
            <button
              type="button"
              onClick={() => addCustomStrength()}
              className="px-3.5 py-2 rounded-xl bg-indigo-100 hover:bg-indigo-200 text-indigo-800 text-xs font-semibold flex items-center gap-1 shrink-0 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>추가</span>
            </button>
          </div>
        </div>

        {/* 4. 대내외 경험 */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <label className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-purple-100 text-purple-700 font-extrabold text-xs flex items-center justify-center">
                4
              </span>
              <span>대내외 활동 경험</span>
              <span className="text-xs text-slate-500 font-normal">
                (동아리, 학회, 서포터즈, 아르바이트 등)
              </span>
            </label>
            <span className="text-xs font-semibold text-purple-700">
              {profile.experiences.length}개 선택됨
            </span>
          </div>

          <div className="flex flex-wrap gap-2 mb-3">
            {COMMON_EXPERIENCES.map((item) => {
              const isSelected = profile.experiences.includes(item);
              return (
                <button
                  key={item}
                  type="button"
                  onClick={() => toggleExperience(item)}
                  className={`text-xs px-3.5 py-2 rounded-xl font-medium transition-all flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-slate-800 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
                  }`}
                >
                  {isSelected && <Check className="w-3 h-3" />}
                  <span>{item}</span>
                </button>
              );
            })}
          </div>

          {/* Custom Experience Input */}
          <div className="flex gap-2">
            <input
              type="text"
              value={customExperience}
              onChange={(e) => setCustomExperience(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addCustomExperience(e)}
              placeholder="직접 입력 (예: 교내 멘토링 튜터 6개월, 영문 자막 번역 블로그)"
              className="grow px-3.5 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500 bg-slate-50/50"
            />
            <button
              type="button"
              onClick={() => addCustomExperience()}
              className="px-3.5 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-semibold flex items-center gap-1 shrink-0 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>추가</span>
            </button>
          </div>
        </div>

        {/* 5. 희망 직무 및 커리어 관심사 */}
        <div>
          <label className="block text-sm font-bold text-slate-900 mb-2 flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-purple-100 text-purple-700 font-extrabold text-xs flex items-center justify-center">
              5
            </span>
            <span>관심 있는 진로 및 희망 직무</span>
            <span className="text-slate-400 text-xs font-normal">(아직 미정이거나 막연해도 괜찮습니다)</span>
          </label>
          <input
            type="text"
            value={profile.careerInterests}
            onChange={(e) => setProfile({ ...profile, careerInterests: e.target.value })}
            placeholder="예: 출판 에디터, 글로벌 콘텐츠 마케터, UX 라이터, 외국계 기업 홍보/PR, 미정 등"
            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500 bg-slate-50/50 text-sm"
          />
        </div>

        {/* 6. 현재 진로 고민 */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-purple-100 text-purple-700 font-extrabold text-xs flex items-center justify-center">
                6
              </span>
              <span>현재 가장 고민되는 점 (진로/취업 걱정거리)</span>
              <span className="text-purple-600 text-xs">*</span>
            </label>
          </div>

          {/* Quick preset concerns */}
          <div className="mb-3 space-y-1.5">
            <div className="text-xs text-slate-500 font-medium">자주 묻는 고민 빠른 선택:</div>
            <div className="flex flex-wrap gap-1.5">
              {COMMON_CONCERNS.slice(0, 3).map((concern, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleApplyPresetConcern(concern)}
                  className="text-[11px] text-left px-2.5 py-1.5 rounded-lg bg-purple-50 hover:bg-purple-100 text-purple-900 border border-purple-200/50 transition-colors"
                >
                  "{concern}"
                </button>
              ))}
            </div>
          </div>

          <textarea
            rows={3}
            value={profile.careerConcerns}
            onChange={(e) => setProfile({ ...profile, careerConcerns: e.target.value })}
            placeholder="예: 영문과 나와서 비상경 문과생으로 취업할 수 있을지 두렵습니다. 포트폴리오를 어떻게 만들어야 전공을 살릴 수 있을까요?"
            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500 bg-slate-50/50 text-sm leading-relaxed"
          />
        </div>

        {/* Validation Error Banner */}
        {validationError && (
          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs sm:text-sm flex items-center gap-2.5 animate-in fade-in duration-200">
            <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
            <div className="font-semibold">{validationError}</div>
          </div>
        )}

        {/* Submit & Demo Buttons */}
        <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-slate-500 flex items-start gap-1.5 max-w-sm">
            <AlertCircle className="w-4 h-4 text-purple-500 shrink-0 mt-0.5" />
            <span>회원가입 없이 현재 브라우저 세션에서 분석되며, 서버에 개인정보가 영구 저장되지 않습니다. 필요한 결과는 '로드맵 복사' 또는 '인쇄' 기능을 활용해 보관해 주세요.</span>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              type="button"
              onClick={() => {
                setProfile(DEMO_STUDENT_PROFILE);
              }}
              className="w-1/2 sm:w-auto px-4 py-3 rounded-xl border border-purple-200 bg-purple-50 text-purple-800 text-xs sm:text-sm font-semibold hover:bg-purple-100 transition-colors text-center"
            >
              2학년 샘플 채우기
            </button>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-1/2 sm:w-auto px-7 py-3 rounded-xl bg-purple-700 hover:bg-purple-800 text-white text-xs sm:text-sm font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 ${
                isLoading ? 'opacity-70 cursor-wait' : 'active:scale-98'
              }`}
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Gemini AI 분석 중...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-purple-200" />
                  <span>진로 분석 & 로드맵 생성</span>
                </>
              )}
            </button>
          </div>
        </div>

      </form>

    </div>
  );
};
