import React, { useState } from 'react';
import { 
  CareerRoadmap, 
  RoadmapPhase, 
  RoadmapTask, 
  StudentProfile,
  RoadmapCategory
} from '../types';
import { 
  Calendar, 
  CheckCircle2, 
  Plus, 
  Copy, 
  Check, 
  Printer, 
  MessageSquare, 
  Sparkles, 
  Award, 
  Clock, 
  Flag,
  ArrowRight,
  Edit3,
  Trash2,
  RefreshCw,
  Target,
  HelpCircle,
  Briefcase,
  Layers,
  ChevronRight,
  FileText
} from 'lucide-react';

interface RoadmapViewProps {
  roadmap: CareerRoadmap;
  profile: StudentProfile;
  recommendedRoles?: string[];
  onUpdateRoadmap: (newRoadmap: CareerRoadmap) => void;
  onAskQuestionInChat?: (question: string) => void;
}

export const RoadmapView: React.FC<RoadmapViewProps> = ({
  roadmap,
  profile,
  recommendedRoles = [
    '글로벌 콘텐츠 에디터 & UX 라이터',
    '해외 출판 기획자 & 글로벌 IP 에디터',
    '글로벌 브랜드 마케터 & 크로스보더 커뮤니케이터',
    '번역 및 로컬라이제이션(L10n) PM'
  ],
  onUpdateRoadmap,
  onAskQuestionInChat,
}) => {
  const [copied, setCopied] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [regenerateError, setRegenerateError] = useState<string | null>(null);

  // Modal State for Adding or Editing Task
  const [taskModalOpen, setTaskModalOpen] = useState(false);
  const [editingTaskPhase, setEditingTaskPhase] = useState<'currentSemester' | 'vacation' | 'nextSemester'>('currentSemester');
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null); // null means new task
  const [formTitle, setFormTitle] = useState('');
  const [formWhyNeeded, setFormWhyNeeded] = useState('');
  const [formMeasurableTarget, setFormMeasurableTarget] = useState('');
  const [formCategory, setFormCategory] = useState<RoadmapCategory>('포트폴리오');
  const [formTimeframe, setFormTimeframe] = useState('1~4주차');

  // AI Regeneration Modal State
  const [regenModalOpen, setRegenModalOpen] = useState(false);
  const [selectedRoleForRegen, setSelectedRoleForRegen] = useState(roadmap.targetRole || recommendedRoles[0]);
  const [customRegenFocus, setCustomRegenFocus] = useState('');

  // Statistics calculation
  const currentSemesterTasks = roadmap.currentSemester.tasks || [];
  const vacationTasks = roadmap.vacation.tasks || [];
  const nextSemesterTasks = roadmap.nextSemester.tasks || [];
  const allTasks = [...currentSemesterTasks, ...vacationTasks, ...nextSemesterTasks];

  const totalCount = allTasks.length;
  const completedCount = allTasks.filter(t => t.completed).length;
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  // Toggle task completion
  const handleToggleTask = (phaseKey: 'currentSemester' | 'vacation' | 'nextSemester', taskId: string) => {
    const updatedTasks = roadmap[phaseKey].tasks.map(t => 
      t.id === taskId ? { ...t, completed: !t.completed } : t
    );
    onUpdateRoadmap({
      ...roadmap,
      [phaseKey]: {
        ...roadmap[phaseKey],
        tasks: updatedTasks
      }
    });
  };

  // Open modal to add new task
  const handleOpenAddTask = (phaseKey: 'currentSemester' | 'vacation' | 'nextSemester') => {
    setEditingTaskPhase(phaseKey);
    setEditingTaskId(null);
    setFormTitle('');
    setFormWhyNeeded('');
    setFormMeasurableTarget('');
    setFormCategory('포트폴리오');
    setFormTimeframe(phaseKey === 'currentSemester' ? '1~4주차' : phaseKey === 'vacation' ? '방학 1~3주차' : '학기 초반');
    setTaskModalOpen(true);
  };

  // Open modal to edit existing task
  const handleOpenEditTask = (phaseKey: 'currentSemester' | 'vacation' | 'nextSemester', task: RoadmapTask, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingTaskPhase(phaseKey);
    setEditingTaskId(task.id);
    setFormTitle(task.title);
    setFormWhyNeeded(task.whyNeeded || '');
    setFormMeasurableTarget(task.measurableTarget || '');
    setFormCategory(task.category);
    setFormTimeframe(task.timeframe || '자율 일정');
    setTaskModalOpen(true);
  };

  // Delete task
  const handleDeleteTask = (phaseKey: 'currentSemester' | 'vacation' | 'nextSemester', taskId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!window.confirm('이 실천 활동을 로드맵에서 삭제하시겠습니까?')) return;
    
    const updatedTasks = roadmap[phaseKey].tasks.filter(t => t.id !== taskId);
    onUpdateRoadmap({
      ...roadmap,
      [phaseKey]: {
        ...roadmap[phaseKey],
        tasks: updatedTasks
      }
    });
  };

  // Save Add/Edit Task
  const handleSaveTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) return;

    if (editingTaskId) {
      // Edit existing
      const updatedTasks = roadmap[editingTaskPhase].tasks.map(t => {
        if (t.id === editingTaskId) {
          return {
            ...t,
            title: formTitle.trim(),
            whyNeeded: formWhyNeeded.trim(),
            measurableTarget: formMeasurableTarget.trim(),
            category: formCategory,
            timeframe: formTimeframe.trim()
          };
        }
        return t;
      });
      onUpdateRoadmap({
        ...roadmap,
        [editingTaskPhase]: {
          ...roadmap[editingTaskPhase],
          tasks: updatedTasks
        }
      });
    } else {
      // Add new
      const newTask: RoadmapTask = {
        id: `task-custom-${Date.now()}`,
        title: formTitle.trim(),
        whyNeeded: formWhyNeeded.trim() || '목표 직무 경쟁력 확보를 위한 개인 맞춤 실천 과제입니다.',
        measurableTarget: formMeasurableTarget.trim() || '활동 완료 및 결과물 정리',
        category: formCategory,
        completed: false,
        timeframe: formTimeframe.trim(),
      };
      onUpdateRoadmap({
        ...roadmap,
        [editingTaskPhase]: {
          ...roadmap[editingTaskPhase],
          tasks: [...roadmap[editingTaskPhase].tasks, newTask]
        }
      });
    }

    setTaskModalOpen(false);
  };

  // AI Roadmap Regeneration
  const handleRegenerateRoadmap = async () => {
    setIsRegenerating(true);
    setRegenerateError(null);

    try {
      const response = await fetch('/api/generate-roadmap', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          profile,
          targetRole: selectedRoleForRegen,
          customFocus: customRegenFocus.trim()
        }),
      });

      if (!response.ok) {
        throw new Error('로드맵 재생성에 실패했습니다.');
      }

      const newRoadmap: CareerRoadmap = await response.json();
      onUpdateRoadmap(newRoadmap);
      setRegenModalOpen(false);
      setCustomRegenFocus('');
    } catch (err: any) {
      console.error('Roadmap regeneration error:', err);
      setRegenerateError('로드맵 생성 중 지연이 발생했습니다. 잠시 후 다시 시도해 주세요.');
    } finally {
      setIsRegenerating(false);
    }
  };

  // Copy roadmap text
  const handleCopyRoadmap = () => {
    const text = `[ENGLISH CAREER MATE] ${profile.year} 영문과 개인 맞춤형 진로 로드맵
희망 직무: ${roadmap.targetRole || '영문과 추천 직무'}

■ 1. ${roadmap.currentSemester.title} (${roadmap.currentSemester.timeframe})
- 핵심 목표: ${roadmap.currentSemester.focusGoal}
${roadmap.currentSemester.tasks.map(t => 
`  [${t.completed ? 'V' : ' '}] (${t.category}) ${t.title}
     · 필요한 이유: ${t.whyNeeded}
     · 달성 목표: ${t.measurableTarget}`
).join('\n')}

■ 2. ${roadmap.vacation.title} (${roadmap.vacation.timeframe})
- 핵심 목표: ${roadmap.vacation.focusGoal}
${roadmap.vacation.tasks.map(t => 
`  [${t.completed ? 'V' : ' '}] (${t.category}) ${t.title}
     · 필요한 이유: ${t.whyNeeded}
     · 달성 목표: ${t.measurableTarget}`
).join('\n')}

■ 3. ${roadmap.nextSemester.title} (${roadmap.nextSemester.timeframe})
- 핵심 목표: ${roadmap.nextSemester.focusGoal}
${roadmap.nextSemester.tasks.map(t => 
`  [${t.completed ? 'V' : ' '}] (${t.category}) ${t.title}
     · 필요한 이유: ${t.whyNeeded}
     · 달성 목표: ${t.measurableTarget}`
).join('\n')}

■ 4학년 졸업 시점 기대 프로필
- 타이틀: ${roadmap.graduationVision.expectedTitle}
- 성과: ${roadmap.graduationVision.portfolioHighlights.join(' / ')}
- 요약: ${roadmap.graduationVision.summary}`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const renderPhaseCard = (
    phaseKey: 'currentSemester' | 'vacation' | 'nextSemester',
    phase: RoadmapPhase,
    stepNum: string,
    periodLabel: string,
    accentBorder: string,
    accentBg: string,
    badgeColor: string
  ) => {
    const phaseTasks = phase.tasks || [];
    const phaseCompleted = phaseTasks.filter(t => t.completed).length;

    return (
      <div className={`bg-white rounded-3xl border ${accentBorder} p-6 sm:p-8 shadow-sm space-y-6 relative transition-all`}>
        
        {/* Phase Header */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 border-b border-slate-100 pb-5">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className={`text-[11px] font-extrabold px-2.5 py-0.5 rounded-lg ${badgeColor}`}>
                {periodLabel}
              </span>
              <span className="text-xs text-slate-500 font-medium flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                {phase.timeframe}
              </span>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                {phaseCompleted}/{phaseTasks.length} 완료
              </span>
            </div>
            
            <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              {phase.title}
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              {phase.subtitle}
            </p>
          </div>

          <button
            onClick={() => handleOpenAddTask(phaseKey)}
            className="self-start sm:self-auto text-xs font-semibold px-3 py-1.5 rounded-xl border border-purple-200 bg-purple-50 text-purple-800 hover:bg-purple-100 transition-colors flex items-center gap-1 shrink-0"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>새 활동 등록하기</span>
          </button>
        </div>

        {/* Phase Core Goal */}
        <div className={`${accentBg} p-3.5 rounded-xl border border-purple-100/60 flex items-center gap-2.5 text-xs sm:text-sm`}>
          <Flag className="w-4 h-4 text-purple-700 shrink-0" />
          <div>
            <span className="font-bold text-slate-900">핵심 목표: </span>
            <span className="text-slate-700">{phase.focusGoal}</span>
          </div>
        </div>

        {/* Tasks List */}
        <div className="space-y-4">
          {phaseTasks.map((task) => {
            const isDone = task.completed;
            const categoryBadge =
              task.category === '학업/수강' ? 'bg-blue-50 text-blue-700 border-blue-200' :
              task.category === '포트폴리오' ? 'bg-purple-50 text-purple-700 border-purple-200' :
              task.category === '대외활동/인턴' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
              task.category === '직무탐색/네트워킹' ? 'bg-indigo-50 text-indigo-700 border-indigo-200' :
              'bg-amber-50 text-amber-700 border-amber-200';

            return (
              <div
                key={task.id}
                onClick={() => handleToggleTask(phaseKey, task.id)}
                className={`p-5 rounded-2xl border transition-all cursor-pointer flex items-start gap-3.5 select-none ${
                  isDone
                    ? 'bg-purple-50/30 border-purple-200/80'
                    : 'bg-white hover:bg-slate-50/70 border-slate-200/90 shadow-xs'
                }`}
              >
                {/* Checkbox */}
                <div className="mt-1 shrink-0">
                  {isDone ? (
                    <div className="w-5 h-5 rounded-md bg-purple-700 text-white flex items-center justify-center shadow-xs">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </div>
                  ) : (
                    <div className="w-5 h-5 rounded-md border-2 border-slate-300 hover:border-purple-600 bg-white transition-colors" />
                  )}
                </div>

                {/* Content details */}
                <div className="grow space-y-2">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${categoryBadge}`}>
                        {task.category}
                      </span>
                      <span className="text-xs text-slate-400 font-medium">
                        {task.timeframe}
                      </span>
                    </div>

                    {/* Edit & Delete Action Buttons */}
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={(e) => handleOpenEditTask(phaseKey, task, e)}
                        className="p-1 rounded text-slate-400 hover:text-purple-700 hover:bg-purple-50 transition-colors"
                        title="활동 수정"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={(e) => handleDeleteTask(phaseKey, task.id, e)}
                        className="p-1 rounded text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                        title="활동 삭제"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Task Title */}
                  <div className={`text-sm sm:text-base font-bold transition-all ${
                    isDone ? 'line-through text-slate-400' : 'text-slate-900'
                  }`}>
                    {task.title}
                  </div>

                  {/* Why Needed Box */}
                  <div className={`p-3 rounded-xl border text-xs leading-relaxed ${
                    isDone
                      ? 'bg-slate-50 border-slate-200/50 text-slate-400'
                      : 'bg-indigo-50/50 border-indigo-100 text-indigo-950'
                  }`}>
                    <div className="font-semibold text-indigo-900 flex items-center gap-1 mb-0.5">
                      <Briefcase className="w-3.5 h-3.5 text-indigo-600" />
                      <span>희망 직무에 필요한 이유</span>
                    </div>
                    <div>{task.whyNeeded}</div>
                  </div>

                  {/* Measurable Target Box */}
                  <div className={`p-3 rounded-xl border text-xs leading-relaxed ${
                    isDone
                      ? 'bg-slate-50 border-slate-200/50 text-slate-400'
                      : 'bg-purple-50/50 border-purple-100 text-purple-950'
                  }`}>
                    <div className="font-semibold text-purple-900 flex items-center gap-1 mb-0.5">
                      <Target className="w-3.5 h-3.5 text-purple-600" />
                      <span>달성 확인 구체적 목표 (결과물)</span>
                    </div>
                    <div>{task.measurableTarget}</div>
                  </div>

                  {task.description && (
                    <p className={`text-xs ${isDone ? 'text-slate-400' : 'text-slate-500'}`}>
                      {task.description}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>

      </div>
    );
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10">
      
      {/* 1. Header Dashboard Card */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-purple-950 rounded-3xl p-6 sm:p-10 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-purple-200 text-xs font-semibold mb-2">
                <Calendar className="w-3.5 h-3.5 text-purple-300" />
                <span>개인 맞춤형 진로 준비 계획</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                {profile.year} 실천 로드맵 대시보드
              </h1>
              <p className="text-purple-200 text-xs sm:text-sm mt-1">
                목표 직무: <span className="text-white font-bold underline decoration-purple-400">{roadmap.targetRole || '영문과 맞춤 직무'}</span>
              </p>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => setRegenModalOpen(true)}
                className="px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm"
                title="다른 직무로 AI 로드맵 다시 생성하기"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>AI 맞춤 다시 생성하기</span>
              </button>

              <button
                onClick={handleCopyRoadmap}
                className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors border border-white/20"
                title="텍스트로 전체 복사"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? '복사됨' : '복사'}</span>
              </button>

              <button
                onClick={() => window.print()}
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs transition-colors border border-white/20"
                title="인쇄 / PDF 저장"
              >
                <Printer className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Live Progress Bar */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 sm:p-5 border border-white/15">
            <div className="flex items-center justify-between text-xs sm:text-sm font-semibold mb-2">
              <span className="flex items-center gap-2 text-purple-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>전체 실천 목표 달성률</span>
              </span>
              <span className="font-extrabold text-white text-base">
                {completedCount} / {totalCount} 완료 ({progressPercent}%)
              </span>
            </div>

            <div className="w-full bg-white/20 h-2.5 rounded-full overflow-hidden mb-3">
              <div
                className="h-full bg-gradient-to-r from-purple-400 via-indigo-300 to-emerald-400 transition-all duration-500 rounded-full"
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            <div className="grid grid-cols-3 gap-2 text-center text-xs text-purple-200 pt-1">
              <div className="bg-white/5 p-2 rounded-lg">
                <div className="text-[10px] text-slate-300">1. 현재 학기</div>
                <div className="font-bold text-white">
                  {currentSemesterTasks.filter(t => t.completed).length}/{currentSemesterTasks.length}
                </div>
              </div>
              <div className="bg-white/5 p-2 rounded-lg">
                <div className="text-[10px] text-slate-300">2. 다가오는 방학</div>
                <div className="font-bold text-white">
                  {vacationTasks.filter(t => t.completed).length}/{vacationTasks.length}
                </div>
              </div>
              <div className="bg-white/5 p-2 rounded-lg">
                <div className="text-[10px] text-slate-300">3. 다음 학기</div>
                <div className="font-bold text-white">
                  {nextSemesterTasks.filter(t => t.completed).length}/{nextSemesterTasks.length}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Timeline with Three Periods */}
      <div className="space-y-8">
        {/* Period 1: 현재 학기 */}
        {renderPhaseCard(
          'currentSemester',
          roadmap.currentSemester,
          '1',
          '1. 현재 학기',
          'border-purple-200',
          'bg-purple-50/50',
          'bg-purple-100 text-purple-800'
        )}

        {/* Period 2: 다가오는 방학 */}
        {renderPhaseCard(
          'vacation',
          roadmap.vacation,
          '2',
          '2. 다가오는 방학',
          'border-indigo-200',
          'bg-indigo-50/50',
          'bg-indigo-100 text-indigo-800'
        )}

        {/* Period 3: 다음 학기 */}
        {renderPhaseCard(
          'nextSemester',
          roadmap.nextSemester,
          '3',
          '3. 다음 학기',
          'border-emerald-200',
          'bg-emerald-50/50',
          'bg-emerald-100 text-emerald-800'
        )}
      </div>

      {/* 3. Graduation Vision Banner */}
      <div className="bg-gradient-to-br from-slate-900 to-indigo-950 rounded-3xl p-6 sm:p-10 text-white shadow-lg space-y-4">
        <div className="flex items-center gap-2">
          <Award className="w-6 h-6 text-purple-300" />
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
            4학년 졸업 시점 기대 프로필
          </h2>
        </div>

        <div className="text-lg sm:text-xl font-extrabold text-purple-200">
          “{roadmap.graduationVision.expectedTitle}”
        </div>

        <div className="bg-white/10 rounded-2xl p-4 sm:p-5 border border-white/10 space-y-3">
          <div className="text-xs font-bold text-slate-300 uppercase tracking-wider">
            완성될 포트폴리오 핵심 성과
          </div>
          <ul className="text-xs sm:text-sm text-slate-200 space-y-1.5">
            {roadmap.graduationVision.portfolioHighlights.map((hl, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="text-purple-400 font-bold shrink-0">·</span>
                <span>{hl}</span>
              </li>
            ))}
          </ul>
        </div>

        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed pt-2">
          {roadmap.graduationVision.summary}
        </p>

        {onAskQuestionInChat && (
          <div className="pt-4 flex justify-end">
            <button
              onClick={() => onAskQuestionInChat(`현재 '${roadmap.targetRole}' 로드맵을 실천하면서 이번 달에 가장 먼저 집중해야 할 단 하나의 과제는 무엇인가요?`)}
              className="px-5 py-2.5 rounded-xl bg-purple-700 hover:bg-purple-800 text-white text-xs sm:text-sm font-semibold flex items-center gap-2 shadow-sm transition-all"
            >
              <MessageSquare className="w-4 h-4 text-purple-200" />
              <span>AI 멘토에게 로드맵 실천 상담받기</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* 4. Add / Edit Task Modal */}
      {taskModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 border border-purple-100 shadow-2xl animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-bold text-slate-900 mb-1">
              {editingTaskId ? '실천 활동 수정하기' : '새로운 실천 활동 등록'}
            </h3>
            <p className="text-xs text-slate-500 mb-5">
              학생의 개인 일정과 목표에 맞추어 구체적인 활동과 달성 지표를 설정합니다.
            </p>

            <form onSubmit={handleSaveTask} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  1. 구체적으로 수행해야 할 활동 *
                </label>
                <input
                  type="text"
                  required
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="예: 영어 작문 샘플 2개 제작하기 (원서 서평 & 브랜드 아티클)"
                  className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500/30"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  2. 해당 활동이 희망 직무에 필요한 이유 *
                </label>
                <textarea
                  required
                  rows={2}
                  value={formWhyNeeded}
                  onChange={(e) => setFormWhyNeeded(e.target.value)}
                  placeholder="예: 글로벌 콘텐츠 직무에서 원문 독해력과 영작 소양을 서류 전형 시 가시적으로 증명하기 위함입니다."
                  className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500/30"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  3. 달성 여부를 확인할 수 있는 구체적인 목표 (결과물) *
                </label>
                <input
                  type="text"
                  required
                  value={formMeasurableTarget}
                  onChange={(e) => setFormMeasurableTarget(e.target.value)}
                  placeholder="예: 교열 완료된 영문 아티클 2편 노션 아카이빙 완료"
                  className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500/30"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    카테고리
                  </label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value as RoadmapCategory)}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-slate-50"
                  >
                    <option value="포트폴리오">포트폴리오</option>
                    <option value="학업/수강">학업/수강</option>
                    <option value="직무탐색/네트워킹">직무탐색/네트워킹</option>
                    <option value="대외활동/인턴">대외활동/인턴</option>
                    <option value="자격증/어학">자격증/어학</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    진행 시기
                  </label>
                  <input
                    type="text"
                    value={formTimeframe}
                    onChange={(e) => setFormTimeframe(e.target.value)}
                    placeholder="예: 1~4주차"
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setTaskModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl text-xs font-bold bg-purple-700 hover:bg-purple-800 text-white shadow-sm"
                >
                  {editingTaskId ? '수정 완료' : '등록하기'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 5. AI Roadmap Regeneration Modal */}
      {regenModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 border border-purple-100 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex items-center gap-2 mb-1">
              <Sparkles className="w-5 h-5 text-purple-700" />
              <h3 className="text-lg font-bold text-slate-900">
                AI 맞춤 로드맵 다시 생성하기
              </h3>
            </div>
            <p className="text-xs text-slate-500 mb-5">
              원하는 희망 직무나 중점 사항을 선택하시면 Gemini AI가 학생의 강점을 반영하여 새로운 3단계 로드맵을 설계합니다.
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">
                  목표 직무 선택
                </label>
                <div className="space-y-1.5">
                  {recommendedRoles.map((role) => (
                    <button
                      key={role}
                      type="button"
                      onClick={() => setSelectedRoleForRegen(role)}
                      className={`w-full text-left p-3 rounded-xl border text-xs font-semibold transition-all flex items-center justify-between ${
                        selectedRoleForRegen === role
                          ? 'border-purple-600 bg-purple-50 text-purple-900 ring-1 ring-purple-600'
                          : 'border-slate-200 hover:border-purple-300 text-slate-700'
                      }`}
                    >
                      <span>{role}</span>
                      {selectedRoleForRegen === role && <Check className="w-4 h-4 text-purple-700" />}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  추가 중점 사항 (선택)
                </label>
                <input
                  type="text"
                  value={customRegenFocus}
                  onChange={(e) => setCustomRegenFocus(e.target.value)}
                  placeholder="예: 피그마와 포트폴리오 비중 확대, 교환학생 준비 병행 등"
                  className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500/30"
                />
              </div>

              {regenerateError && (
                <div className="p-3 rounded-xl bg-rose-50 text-rose-800 text-xs">
                  {regenerateError}
                </div>
              )}

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setRegenModalOpen(false)}
                  disabled={isRegenerating}
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  취소
                </button>
                <button
                  type="button"
                  onClick={handleRegenerateRoadmap}
                  disabled={isRegenerating}
                  className="px-6 py-2.5 rounded-xl text-xs font-bold bg-purple-700 hover:bg-purple-800 text-white shadow-sm flex items-center gap-1.5"
                >
                  {isRegenerating ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Gemini 로드맵 설계 중...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>로드맵 생성하기</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
