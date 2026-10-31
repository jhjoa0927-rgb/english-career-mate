export interface StudentProfile {
  year: '1학년' | '2학년' | '3학년' | '4학년' | '졸업유예';
  interests: string[];
  strengths: string[];
  experiences: string[];
  careerInterests: string;
  careerConcerns: string;
}

export type EnglishLitField = 
  | '출판 및 편집'
  | '번역 및 로컬라이제이션'
  | '교육 및 영어 교육'
  | '콘텐츠 기획 및 제작'
  | '마케팅'
  | '연구 및 기타 관련 분야';

export interface CompetencyComparison {
  requiredCompetencies: string[];
  matchedStudentCompetencies: string[];
  gapCompetencies: string[];
  analysisSummary: string;
}

export interface PathReasoning {
  interestsConnection: string;
  strengthsConnection: string;
  majorExperienceConnection: string;
}

export interface CareerPath {
  id: string;
  title: string;
  tagline: string;
  fieldCategory: EnglishLitField;
  matchScore: number;
  englishLitAdvantage: string;
  reasoning: PathReasoning;
  keyResponsibilities: string[];
  requiredSkills: string[];
  competencyComparison: CompetencyComparison;
  careerProspect: string;
  firstStepAction: string;
  recommendedKeywords: string[];
  reliabilityNote: string;
}

export interface AcademicCompetencyInsight {
  academicArea: '문학 작품 분석' | '영어 독해 및 작문' | '번역 및 통역' | '언어학' | '문화 연구';
  coreSkill: string;
  industryTranslation: string;
  studentApplication: string;
}

export interface CompetencyDimension {
  name: string;
  score: number;
  description: string;
}

export interface SkillGapItem {
  skill: string;
  reason: string;
  solution: string;
  recommendedResource: string;
}

export interface CareerDiagnosis {
  competencyScores: CompetencyDimension[];
  coreStrengths: {
    title: string;
    description: string;
    marketValue: string;
  }[];
  skillGaps: SkillGapItem[];
  practicalActions: {
    category: '프로젝트' | '자격/어학' | '대외활동' | '수강추천';
    title: string;
    target: string;
    timing: string;
    importance: '필수' | '권장' | '선택';
  }[];
}

export type RoadmapCategory = 
  | '학업/수강' 
  | '포트폴리오' 
  | '대외활동/인턴' 
  | '자격증/어학' 
  | '직무탐색/네트워킹';

export interface RoadmapTask {
  id: string;
  title: string;
  whyNeeded: string;
  measurableTarget: string;
  category: RoadmapCategory;
  completed: boolean;
  timeframe: string;
  description?: string;
}

export interface RoadmapPhase {
  title: string;
  subtitle: string;
  timeframe: string;
  focusGoal: string;
  tasks: RoadmapTask[];
}

export interface CareerRoadmap {
  targetRole: string;
  currentSemester: RoadmapPhase;
  vacation: RoadmapPhase;
  nextSemester: RoadmapPhase;
  graduationVision: {
    expectedTitle: string;
    portfolioHighlights: string[];
    summary: string;
  };
}

export interface CareerCounselingResult {
  overallEvaluation: string;
  academicInsights: AcademicCompetencyInsight[];
  recommendedPaths: CareerPath[];
  diagnosis: CareerDiagnosis;
  roadmap: CareerRoadmap;
  suggestedFollowUpQuestions: string[];
  reliabilityNotice: string;
  generatedAt: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  content: string;
  timestamp: string;
  suggestedQuestions?: string[];
  referencedCareerPath?: string;
}
