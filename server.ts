import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import { CareerCounselingResult, StudentProfile } from './src/types';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json());

// Initialize Google GenAI client if API key is provided
let aiClient: GoogleGenAI | null = null;
if (process.env.GEMINI_API_KEY) {
  aiClient = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Fallback intelligent generator specifically tailored for English Literature majors
function generateFallbackCounseling(profile: StudentProfile): CareerCounselingResult {
  const interestsJoined = profile.interests.join(', ') || '문학과 글쓰기';
  const strengthsJoined = profile.strengths.join(', ') || '텍스트 분석력과 서사력';

  return {
    overallEvaluation: `${profile.year} 영문과 재학생으로서 '${interestsJoined}' 분야에 높은 탐구열을 가지고 있으며, '${strengthsJoined}'라는 인문학 고유의 지적 자산을 갖추고 있습니다. 영문학의 문학 작품 분석, 정밀 독해·작문, 문화 연구 훈련을 현대 산업 실무와 연결하는 전략이 가장 효과적인 시점입니다.`,
    academicInsights: [
      {
        academicArea: '문학 작품 분석',
        coreSkill: '서사 구조(Narrative Structure) 해체 및 심층 맥락 파악',
        industryTranslation: '콘텐츠 IP 기획, UX 스토리라인 설계, 사용자 페르소나 심리 분석',
        studentApplication: '원서 비평에서 습득한 서사 안목을 바탕으로 독자 및 사용자의 공감을 이끄는 기획서 작성 가능'
      },
      {
        academicArea: '영어 독해 및 작문',
        coreSkill: '원문 뉘앙스 정밀 독해 및 목적별 비즈니스/학술 영작문',
        industryTranslation: '글로벌 커뮤니케이션, 해외 파트너십 브리프, 영문 보도자료 및 카피라이팅',
        studentApplication: '기계 번역이 포착하지 못하는 미묘한 뉘앙스를 다듬어 신뢰성 높은 글로벌 텍스트 창작'
      },
      {
        academicArea: '번역 및 통역',
        coreSkill: '이문화 간 맥락 전환 및 문화적 관용어 최적화',
        industryTranslation: '글로벌 서비스 현지화(L10n), 크로스보더 커머스 콘텐츠, 해외 라이선싱',
        studentApplication: '단순 직역을 넘어 해외 타깃 고객의 정서에 부합하는 현지화 콘텐츠 설계'
      },
      {
        academicArea: '언어학',
        coreSkill: '통사론·의미론 기반의 언어 규칙 분석 및 정보 구조화',
        industryTranslation: 'UX 마이크로카피 체계화, 인공지능 프롬프트 엔지니어링, 자연어 데이터 큐레이션',
        studentApplication: '복잡한 서비스 기능을 사용자가 1초 만에 이해하는 직관적인 용어 체계로 정제'
      },
      {
        academicArea: '문화 연구',
        coreSkill: '영미권 사회문화적 트렌드 비판적 읽기 및 미디어 리터러시',
        industryTranslation: '글로벌 브랜드 마케팅, 해외 시장 트렌드 리서치, 문화예술 IP 수입/배급',
        studentApplication: '글로벌 소비자의 문화적 금기어와 공감 코드를 사전에 파악하여 브랜드 리스크 예방'
      }
    ],
    recommendedPaths: [
      {
        id: 'path-1',
        title: '글로벌 콘텐츠 에디터 & UX 라이터',
        tagline: '영문 텍스트 분석력과 사용자 중심 인터랙션 언어 설계',
        fieldCategory: '콘텐츠 기획 및 제작',
        matchScore: 94,
        englishLitAdvantage: '문학 텍스트를 구조적으로 분석하고 독자의 호흡을 조율해 본 영문과 훈련은, 디지털 앱 화면의 복잡한 안내 문구를 명쾌한 마이크로카피로 정제하는 UX 라이팅과 글로벌 브랜드 스토리텔링에 가장 직접적으로 적용됩니다.',
        reasoning: {
          interestsConnection: `학생이 선택한 '${interestsJoined}'의 창작 및 글쓰기 흥미는 사용자의 인터랙션 여정을 설계하는 콘텐츠 에디팅과 직결됩니다.`,
          strengthsConnection: `'${strengthsJoined}'의 강점은 글의 군더더기를 덜어내고 핵심 메시지를 명확히 전달하는 데 탁월한 기반이 됩니다.`,
          majorExperienceConnection: '영문과 전공 과정의 문학 비평 에세이 작성 및 영작문 피어 리뷰 경험은 직관적인 카피라이팅의 기본기를 형성합니다.'
        },
        keyResponsibilities: [
          'IT/글로벌 서비스 내 사용자 인터페이스(UI) 마이크로카피 및 보이스 앤 톤 가이드라인 수립',
          '영문/국문 브랜드 오리지널 아티클, 고객 가이드, 블로그 콘텐츠 기획 및 발행',
          '카피 A/B 테스트 진행 및 사용자 완독률·이탈률 데이터 모니터링'
        ],
        requiredSkills: [
          '정밀한 국문/영문 문장력 및 교정·교열 역량',
          '피그마(Figma) 등 제품 디자인 협업 도구 기본 이해',
          '사용자 행동 심리 분석 및 정보 구조화(Information Architecture) 역량'
        ],
        competencyComparison: {
          requiredCompetencies: ['정밀한 문장 교정/교열', '사용자 중심 맥락 파악', '피그마 협업 도구', '정량적 A/B 테스트 이해'],
          matchedStudentCompetencies: ['심층 텍스트 분석력', '국/영문 글쓰기 소양', '원서 비평 기반 맥락 파악'],
          gapCompetencies: ['피그마(Figma) 툴 활용 경험', '데이터 기반 카피 성과(KPI) 측정 이해'],
          analysisSummary: '텍스트에 대한 감각과 맥락 이해도는 이미 우수하므로, 피그마 기초 툴과 가상 앱 카피 리디자인 프로젝트 1~2건을 포트폴리오로 보완하면 서류 경쟁력이 크게 향상됩니다.'
        },
        careerProspect: 'IT 플랫폼 및 외국계 테크 기업을 중심으로 UX 전담 라이터와 글로벌 브랜드 에디터 포지션이 전문 직군으로 자리잡고 있습니다.',
        firstStepAction: '평소 자주 사용하는 앱 2~3개의 온보딩 화면 카피를 분석하고, 사용성을 개선한 비포/애프터 역제안 포트폴리오 1편 작성',
        recommendedKeywords: ['UX라이팅', '마이크로카피', '콘텐츠에디팅', '보이스앤톤'],
        reliabilityNote: '신입 채용은 수시 채용 및 인턴십 연계 비중이 높으므로, 기업별 채용공고의 필수 제출 포트폴리오 형식(PDF, 노션 링크 등)을 사전 확인해야 합니다.'
      },
      {
        id: 'path-2',
        title: '해외 출판 기획자 & 글로벌 IP 에디터',
        tagline: '영미 서사 구조 이해를 바탕으로 한 원천 스토리 IP 발굴 및 출판 기획',
        fieldCategory: '출판 및 편집',
        matchScore: 91,
        englishLitAdvantage: '원서 강독과 문학 비평을 통해 훈련된 영미 서사 구조(Narrative Structure)에 대한 이해는 해외 우수 도서, 웹소설, IP 판권 계약 검토 및 번역 출판 기획에서 대체 불가능한 경쟁력이 됩니다.',
        reasoning: {
          interestsConnection: `학생의 '${interestsJoined}' 관심사는 해외 도서 및 원천 서사를 발굴하고 국내외 독자에게 소개하는 출판 기획과 완벽히 부합합니다.`,
          strengthsConnection: `텍스트의 상징과 시장성 요소를 동시에 짚어내는 '${strengthsJoined}' 역량이 판권 검토서 작성의 신뢰도를 높여줍니다.`,
          majorExperienceConnection: '영미문학사 및 현대소설 강독 수업에서 축적한 장르별 계보 이해와 작가주의 분석 경험이 현업 기획의 든든한 밑거름이 됩니다.'
        },
        keyResponsibilities: [
          '해외 베스트셀러 및 신간 모니터링, 영문 판권 검토서(Reader\'s Report) 작성',
          '국내외 작가 및 번역가 섭외, 출판 계약 검토, 원고 교정·교열 총괄',
          '국제 도서전 참가 및 영문 피칭 패키지(Book Proposal) 구성'
        ],
        requiredSkills: [
          '고급 영문 독해 및 신속한 텍스트 요약 역량',
          '출판 트렌드 분석 및 타깃 독자층 포지셔닝 감각',
          '출판 편집 프로세스 및 인쇄/전자책 유통 기초 이해'
        ],
        competencyComparison: {
          requiredCompetencies: ['신속한 원서 리딩', '영문 판권 검토서 작성', '출판 편집/교정', '대중 트렌드 감각'],
          matchedStudentCompetencies: ['영미 원서 독해력', '문학적 텍스트 비평 안목', '국/영문 글쓰기 역량'],
          gapCompetencies: ['실제 출판 기획서 양식 작성 경험', '국내 도서 유통 및 제작 프로세스 이해'],
          analysisSummary: '원서 독해와 비평 안목은 이미 갖추어져 있으므로, 가상의 출판 기획서(출간 의의, 타깃 독자 분석, 마케팅 계획)를 직접 작성해 봄으로써 실무 감각을 입증할 수 있습니다.'
        },
        careerProspect: 'K-콘텐츠 글로벌 수출 및 해외 원천 IP 수입이 활발해짐에 따라, 글로벌 도서 판권과 2차 저작권을 다룰 수 있는 영문과 출신 전문 에디터의 가치가 지속되고 있습니다.',
        firstStepAction: '최근 아마존 또는 영미권 매거진에서 화제가 된 미출간 도서 1권을 선정해 A4 2장 분량의 가상 판권 검토서 작성해보기',
        recommendedKeywords: ['출판기획', 'IP비즈니스', '원서검토', '해외판권'],
        reliabilityNote: '출판계 취업은 정기 공채와 더불어 출판학교(SBI 등) 수료나 서포터즈 활동 이력이 실무 평가에 긍정적으로 작용하므로 관련 정보를 함께 탐색하는 것이 좋습니다.'
      },
      {
        id: 'path-3',
        title: '글로벌 브랜드 마케터 & 크로스보더 커뮤니케이터',
        tagline: '문화적 맥락(Cultural Nuance)을 연결하는 글로벌 브랜드 스토리텔러',
        fieldCategory: '마케팅',
        matchScore: 88,
        englishLitAdvantage: '단순 언어 구사를 넘어 영미권 문화 연구와 비판적 담론 분석에서 다져진 문화적 감수성(Cultural Nuance)은 글로벌 고객 대상 브랜딩 및 해외 소셜 미디어 캠페인에서 높은 공감대를 이끌어냅니다.',
        reasoning: {
          interestsConnection: `학생의 글쓰기 및 커뮤니케이션 관심은 해외 소비자와 감정적 유대를 맺는 브랜드 마케팅으로 확장하기에 매우 이상적입니다.`,
          strengthsConnection: `메시지를 대상 고객에 맞춰 정제하는 '${strengthsJoined}'의 강점이 글로벌 캠페인 카피 기획에서 결정적 차별점이 됩니다.`,
          majorExperienceConnection: '영미 문화 연구 및 문화 비평 수업에서 체득한 타문화 수용 태도와 미디어 리터러시가 글로벌 브랜드 리스크 관리에 직결됩니다.'
        },
        keyResponsibilities: [
          '글로벌 소셜 미디어(인스타그램, 링크드인, X) 브랜드 채널 운영 및 영문 캠페인 기획',
          '해외 인플루언서 섭외, 협업 브리프 작성 및 영문 비즈니스 커뮤니케이션',
          '해외 진출 시장의 문화적 트렌드 리서치 및 소비자 정성 피드백 분석'
        ],
        requiredSkills: [
          '자연스러운 비즈니스 영작문 및 이문화 커뮤니케이션 능력',
          '글로벌 SNS 콘텐츠 기획 및 디지털 채널 운영 경험',
          '기초 데이터 분석 도구(GA4, 소셜 통계 대시보드) 활용 능력'
        ],
        competencyComparison: {
          requiredCompetencies: ['이문화 공감 영작문', '글로벌 SNS 기획', '마케팅 데이터 지표 이해', '협업 커뮤니케이션'],
          matchedStudentCompetencies: ['글로벌 문화 감수성', '영문 텍스트 작성 소양', '리서치 기동력'],
          gapCompetencies: ['디지털 마케팅 용어(CTR, ROAS 등) 이해', '실제 SNS 채널 운영을 통한 성과 지표 도출'],
          analysisSummary: '문맥에 맞는 영작과 문화 이해는 탄탄하므로, 개인 블로그/SNS를 운영하며 도달수나 반응률 등 정량적 수치를 기록한 경험을 곁들이면 강력한 포트폴리오가 됩니다.'
        },
        careerProspect: '국내 브랜드의 북미·유럽 등 글로벌 시장 진출이 가속화되면서 언어와 문화적 감각을 동시에 갖춘 크로스보더 마케팅 인재 수요가 견조합니다.',
        firstStepAction: '국내 라이프스타일/뷰티 브랜드 1곳을 선정해 북미 시장 타깃의 영문 인스타그램 캠페인 피드 3개와 카피를 기획해보기',
        recommendedKeywords: ['글로벌마케팅', '크로스보더', '브랜드스토리텔링', '이문화소통'],
        reliabilityNote: '마케팅 직무의 구체적인 연봉 및 처우는 산업군(IT, 커머스, 소비재 등)과 기업 규모에 따라 편차가 크므로, 지원 시점의 공식 채용 요강과 공시 정보를 확인해야 합니다.'
      }
    ],
    diagnosis: {
      competencyScores: [
        { name: '텍스트 맥락 및 비판적 분석력', score: 92, description: '영문 문헌 분석을 통해 습득한 본질 파악 및 핵심 논리 도출 역량' },
        { name: '국/영문 서사 기획 및 문장력', score: 88, description: '메시지를 독자의 심리에 맞게 정밀하게 전달하는 표현 역량' },
        { name: '글로벌 문화 감수성 및 소통', score: 85, description: '영미권 문화 코드 및 맥락적 뉘앙스를 반영한 소통 역량' },
        { name: '디지털 툴 및 데이터 리터러시', score: 62, description: '피그마, 노션, GA4 등 실무 협업 및 데이터 분석 툴 활용도' },
        { name: '비즈니스 전략 및 실행력', score: 68, description: '아이디어를 정량적 목표와 측정 가능한 프로젝트로 전환하는 능력' },
        { name: '취업 시장 포트폴리오 준비도', score: 64, description: '전공 결과물을 기업 실무 언어로 치환한 가시적 포트폴리오 수준' }
      ],
      coreStrengths: [
        {
          title: '심층 텍스트 분석 및 정보 구조화 역량',
          description: '방대한 영문 텍스트에서 행간의 의미와 핵심 인사이트를 추출해내는 능력은 AI 시대에도 대체하기 어려운 고유의 인문학적 강점입니다.',
          marketValue: '콘텐츠 아키텍처, UX 리서치, 심층 리포트 기획 직무에서 높은 평가'
        },
        {
          title: '서사적 공감대 형성 및 스토리텔링',
          description: '독자의 관심과 감정을 이끌어내는 문체 구사력과 글의 흐름을 조율하는 역량이 탁월합니다.',
          marketValue: '브랜드 마케팅 및 출판/미디어 에디토리얼에서 독보적 차별점'
        },
        {
          title: '영문 독해 및 글로벌 정보 리서치 기동력',
          description: '해외 최신 트렌드, 외신 기사, 글로벌 레퍼런스를 원문 그대로 빠르게 소화하고 국내 실정에 맞게 재가공할 수 있습니다.',
          marketValue: '글로벌 비즈니스 및 신사업 리서치 부서에서 환영받는 능력'
        }
      ],
      skillGaps: [
        {
          skill: '실무 협업 및 프로덕트 디자인 툴 (Figma, Notion)',
          reason: '영문과 커리큘럼 특성상 문서 작성(Word, HWP) 위주여서 IT 기획자와 협업하는 시각화 툴 경험이 부족하기 쉽습니다.',
          solution: 'Figma 기본 튜토리얼 2주 완성 및 Notion으로 개인 프로젝트 아카이빙 구축',
          recommendedResource: 'Figma 공식 초심자 튜토리얼 & 인프런 UX 라이팅 입문 강의'
        },
        {
          skill: '정량적 성과 지표(KPI) 및 데이터 사고방식',
          reason: '글이나 기획의 질적 완성도에 집중하다 보니, 조회수·클릭률·전환율 같은 숫자 기반 검증 경험이 적을 수 있습니다.',
          solution: '블로그/브런치/SNS 채널을 운영하며 주간 통계 지표(유입 키워드, 체류 시간)를 분석해 회고 리포트 작성',
          recommendedResource: '구글 애널리틱스(GA4) 기초 무료 자격증 과정'
        },
        {
          skill: '실무 포트폴리오화 (전공 과제 -> 포트폴리오 전환)',
          reason: '학기 중 작성한 영문 에세이나 비평 과제를 기업 채용 담당자가 이해하기 쉬운 프로젝트 형식으로 재가공하지 못함',
          solution: '과제 중 가장 흥미로웠던 영미 문학 작품의 테마를 현대 트렌드와 결합한 기획 아티클로 재발행',
          recommendedResource: '노션 기반 취업 포트폴리오 템플릿'
        }
      ],
      practicalActions: [
        {
          category: '프로젝트',
          title: '나만의 도서/브랜드 큐레이션 매거진(브런치/뉴스레터) 5편 연재',
          target: '기획 의도, 타깃 독자, 조회수 지표를 포함한 실물 포트폴리오 확보',
          timing: '이번 학기 중 (주 1편)',
          importance: '필수'
        },
        {
          category: '대외활동',
          title: '출판 서포터즈, 영자신문, 또는 IT 서비스 서포터즈 활동 참여',
          target: '실제 조직 내 콘텐츠 배포 및 독자 피드백 수집 경험',
          timing: '이번 방학 지원',
          importance: '필수'
        },
        {
          category: '자격/어학',
          title: '오픽 AL 또는 토익 스피킹 AM 이상 어학성적 취득',
          target: '영어영문학과 전공자로서 구술 어학 신뢰도 공인 확보',
          timing: '다가오는 방학',
          importance: '권장'
        },
        {
          category: '수강추천',
          title: '타 전공 교과목 청강 (미디어커뮤니케이션학의 디지털콘텐츠기획 또는 경영학 마케팅원론)',
          target: '문과적 소양에 비즈니스 프레임워크 융합',
          timing: '다음 학기 수강신청',
          importance: '권장'
        }
      ]
    },
    roadmap: {
      targetRole: '글로벌 콘텐츠 에디터 & UX 라이터',
      currentSemester: {
        title: '현재 학기: 전공 강점 발견 & 기초 실무 도구 세팅',
        subtitle: `${profile.year} 현재 학기 동안 영문과 학점 관리와 동시에 실무 기초를 다지는 기간`,
        timeframe: '현재 ~ 학기말 (약 3개월)',
        focusGoal: '영문과 전공 과제 성과물 정리 및 포트폴리오용 영작문 샘플 제작',
        tasks: [
          {
            id: 'task-c1',
            title: '영어 작문 샘플 2개 제작하기 (원서 서평 & 영문 브랜드 아티클)',
            whyNeeded: '글로벌 콘텐츠 및 출판 에디터 직무에서 가장 기본이 되는 영문 텍스트 분석력과 정밀 작문 역량을 입증하기 위해 필수적입니다.',
            measurableTarget: '원서 비평 에세이 1편과 브랜드 칼럼 1편을 교열 완료하여 노션에 아카이빙',
            category: '포트폴리오',
            completed: true,
            timeframe: '1~4주차',
            description: '수강 중인 영미문학 수업 과제 또는 관심 도서를 바탕으로 실무용 영문 아티클로 리팩토링'
          },
          {
            id: 'task-c2',
            title: '출판 및 콘텐츠 관련 기업 5곳 조사하기',
            whyNeeded: '희망하는 기업들의 최근 발행 도서/서비스와 신입/인턴 채용 우대 조건을 파악하여 맞춤형 준비 전략을 세우기 위함입니다.',
            measurableTarget: '기업 5곳(주요 출판사 및 IT 플랫폼)의 서비스 분석 보고서 및 채용 요건 정리 시트 완성',
            category: '직무탐색/네트워킹',
            completed: false,
            timeframe: '3~6주차',
            description: '기업별 보이스앤톤 가이드, 주요 타깃 독자층, 선호하는 포트폴리오 형식 심층 리서치'
          },
          {
            id: 'task-c3',
            title: '피그마(Figma) 기초 툴 사용법 마스터 및 텍스트 컴포넌트 실습',
            whyNeeded: '디지털 서비스 내 카피를 직접 화면에 배치하고 디자이너와 협업할 수 있는 실무 능력을 갖추기 위함입니다.',
            measurableTarget: '모바일 앱 화면 1개에 직접 마이크로카피를 교체 배치해본 피그마 파일 1건 완성',
            category: '학업/수강',
            completed: false,
            timeframe: '7~10주차',
            description: '피그마 무료 튜토리얼을 이수하고 버튼, 툴팁, 온보딩 텍스트 레이아웃 실습'
          }
        ]
      },
      vacation: {
        title: '다가오는 방학: 집중 스펙 업그레이드 & 프로젝트 실무 완성',
        subtitle: '부족한 실무 역량 보완 및 실전 공모전/서포터즈 도전 기간',
        timeframe: '여름/겨울 방학 (약 2개월)',
        focusGoal: '공인 어학 최고 등급 취득 및 대외활동/공모전 포트폴리오 1건 완성',
        tasks: [
          {
            id: 'task-v1',
            title: '콘텐츠 포트폴리오 프로젝트 1개 제작하기 (앱 카피 리디자인)',
            whyNeeded: '단순한 스펙 나열을 넘어, 실제 문제(불친절한 텍스트)를 언어로 해결한 가시적 문제해결 능력을 증명하기 위해 필요합니다.',
            measurableTarget: '불편한 앱 1곳을 선정해 온보딩 카피 개선 전/후 비교 및 기획 의도를 담은 PDF 5장 리포트 완성',
            category: '포트폴리오',
            completed: false,
            timeframe: '방학 1~4주차',
            description: '사용자 친화적 마이크로카피 설계와 톤앤보이스 개선 프로세스를 체계적으로 정리'
          },
          {
            id: 'task-v2',
            title: '오픽(OPIc) AL 또는 토익 스피킹 AM 취득',
            whyNeeded: '영어영문학과 전공자로서 글로벌 비즈니스 회화 및 구술 역량의 객관적 증빙을 조기에 확보하기 위함입니다.',
            measurableTarget: 'OPIc AL(Advanced Low) 등급 공식 성적표 취득',
            category: '자격증/어학',
            completed: false,
            timeframe: '방학 3~5주차',
            description: '방학 3주 집중 스터디를 통해 영어 스피킹 공인 성적 달성'
          },
          {
            id: 'task-v3',
            title: '관련 인턴십 및 채용 공고 조사하기 & 서류 기본 템플릿 작성',
            whyNeeded: '다가오는 학기 및 방학에 오픈되는 실제 인턴십의 전형 일정과 지원서 문항을 미리 대비하기 위함입니다.',
            measurableTarget: '관련 인턴십/서포터즈 공고 10개 스크랩 및 공통 자기소개서 초안 1종 완성',
            category: '직무탐색/네트워킹',
            completed: false,
            timeframe: '방학 6~8주차',
            description: '취업 포털, 기업 채용 페이지, 인문계 취업 커뮤니티의 공고 일정 캘린더 정리'
          }
        ]
      },
      nextSemester: {
        title: '다음 학기: 융합 전공 역량 확장 & 실전 커리어 네트워킹',
        subtitle: '인턴십 지원 준비 및 영문학 전공과 비즈니스의 유기적 결합 단계',
        timeframe: '다음 학기 개강 ~ 종강 (약 4개월)',
        focusGoal: '타 전공 융합 교과목 이수 및 정식 인턴십 지원서 초안 완성',
        tasks: [
          {
            id: 'task-n1',
            title: '희망 직무 종사자와 직무 인터뷰(커피챗) 1회 진행하기',
            whyNeeded: '실제 현업에서의 일과, 서류 합격 팁, 필요한 실무 스킬을 직접 청취하여 포트폴리오를 날카롭게 다듬기 위함입니다.',
            measurableTarget: '영문과 동문 또는 링크드인 현직자 인터뷰 진행 후 핵심 조언 3가지 인터뷰 노트 작성',
            category: '직무탐색/네트워킹',
            completed: false,
            timeframe: '학기 초반 (1~4주차)',
            description: '모교 진로취업지원팀 동문 멘토링 프로그램 또는 링크드인을 통한 정중한 커피챗 요청'
          },
          {
            id: 'task-n2',
            title: '융합 과목 수강 (마케팅원론 또는 데이터시각화 기초)',
            whyNeeded: '영문과 전공 외에 비즈니스 및 기술 실무자와 소통할 수 있는 공통 프레임워크를 습득하기 위함입니다.',
            measurableTarget: '해당 과목 수강 및 기말 팀 프로젝트 A학점 이상 달성',
            category: '학업/수강',
            completed: false,
            timeframe: '학기 전체',
            description: '문과적 소양에 비즈니스 지표 및 협업 역량을 융합하는 교과목 이수'
          },
          {
            id: 'task-n3',
            title: '노션 기반 All-in-One 커리어 포트폴리오 웹사이트 완성',
            whyNeeded: '채용 담당자가 한 번의 링크 클릭으로 지금까지의 영작문, 기획서, 대외활동을 한눈에 볼 수 있도록 하기 위함입니다.',
            measurableTarget: '자기소개, 대표 프로젝트 2개, 어학 성적이 일목요연하게 정리된 공개 노션 URL 제작',
            category: '포트폴리오',
            completed: false,
            timeframe: '기말고사 전후',
            description: '인턴십 서류 접수에 바로 첨부 가능한 수준의 반응형 온라인 포트폴리오 발행'
          }
        ]
      },
      graduationVision: {
        expectedTitle: '인문학적 통찰과 디지털 실행력을 겸비한 글로벌 콘텐츠 스페셜리스트',
        portfolioHighlights: [
          '영미 문학 비평으로 단련된 심층 텍스트 분석 및 정보 구조화 능력',
          '실제 유저 반응을 이끌어낸 브런치/뉴스레터 연재 및 UX 카피 리디자인 프로젝트 2건',
          '오픽 최고등급(AL) 및 글로벌 커뮤니케이션 비즈니스 영작 실무 역량',
          '출판/IT 서포터즈 및 인턴십을 통한 실제 프로젝트 성과 데이터'
        ],
        summary: '단순히 "영어를 잘하는 졸업생"이 아닌, "사람의 마음을 움직이는 텍스트를 설계하고 글로벌 비즈니스로 연결할 줄 아는 차별화된 영문과 인재"로 취업 시장에 포지셔닝합니다.'
      }
    },
    suggestedFollowUpQuestions: [
      '영문과 전공 과제(원서 에세이나 비평) 중 채용 담당자 눈에 띄는 포트폴리오로 재가공하기 가장 좋은 주제는 무엇인가요?',
      'UX 라이터와 글로벌 콘텐츠 마케터 중 저의 성향(기획 vs 분석 vs 글쓰기)에는 어느 쪽이 더 잘 맞을까요?',
      '영문과 학생이 대기업이나 외국계 기업에 지원할 때 토익 900점대와 오픽 AL 중 어느 쪽을 우선순위에 두어야 할까요?',
      '상경계열 복수전공을 하지 않고 영문과 단일 전공만으로 IT나 출판 분야 취업에 충분한 경쟁력을 가질 수 있을까요?'
    ],
    reliabilityNotice: '안내: 본 진로 컨설팅 결과는 학생의 학업 및 역량 개발 방향을 돕기 위한 교육적 진로 가이드입니다. 근거 없는 취업률이나 비공식 연봉 정보는 제공하지 않으며, 특정 기업의 지원 자격, 전형 절차 및 필수 요건은 각 기업의 공식 채용 공고를 통해 반드시 재확인하시기 바랍니다.',
    generatedAt: new Date().toISOString()
  };
}

// POST /api/generate-counseling
app.post('/api/generate-counseling', async (req: Request, res: Response) => {
  const profile: StudentProfile = req.body;

  if (!profile || !profile.year) {
    return res.status(400).json({ error: '학생 프로필 정보가 누락되었습니다.' });
  }

  // If Gemini API is available, request customized counseling from Gemini 3.8 Flash
  if (aiClient && process.env.GEMINI_API_KEY) {
    try {
      const prompt = `
당신은 대한민국 대학교 영어영문학과(English Language and Literature) 학부생 전담 수석 커리어 컨설턴트입니다.

[전공에 대한 깊은 이해 요구사항]
영문과 커리큘럼의 5대 핵심 영역을 전문적으로 이해하고 반영하세요:
1. 문학 작품 분석 (서사 구조, 비판적 텍스트 해석, 상징 및 시대적 맥락)
2. 영어 독해 및 작문 (원서 정밀 독해, 학술/비즈니스 에세이, 정교한 문장력)
3. 번역 및 통역 (이문화 번역, 로컬라이제이션, 문화적 뉘앙스 치환)
4. 언어학 (통사론, 의미론, 화용론, 인지언어학, 자연어 정보 구조화)
5. 문화 연구 (영미권 대중문화, 사회적 담론, 미디어 리터러시)

[직무 추천 요구사항]
다음 분야를 포함해 학생에게 가장 적합한 직무 3가지를 엄선하여 추천하세요:
- 출판 및 편집
- 번역 및 로컬라이제이션
- 교육 및 영어 교육
- 콘텐츠 기획 및 제작
- 마케팅
- 연구 및 기타 관련 분야

[추천 이유 및 역량 분석 요구사항]
- 각 직무마다 학생의 관심 분야, 강점, 전공 경험과의 연계 이유를 구체적으로 서술하세요.
- 각 직무에 필요한 역량과 학생의 현재 역량을 비교(보유 역량 vs 보완할 역량 갭)하세요.
- 정보가 부족한 경우 더 정확한 추천을 위한 후속 질문을 작성하세요.

[취업 정보 신뢰성 원칙 - 엄격 준수]
- 근거가 없는 취업률, 임의의 연봉, 허위 채용 요건 등을 절대 지어내지 마세요.
- 일반적인 진로 조언과 실제 공식 확인이 필요한 채용 정보를 명확하게 구분하세요.

[학생 프로필]
- 학년: ${profile.year}
- 관심 분야: ${profile.interests.join(', ')}
- 보유 역량/강점: ${profile.strengths.join(', ')}
- 대내외 경험: ${profile.experiences.join(', ')}
- 희망 진로/관심 직무: ${profile.careerInterests}
- 현재 진로 고민: ${profile.careerConcerns}

반드시 순수 JSON 형식만 반환하세요 (마크다운 따옴표 제외):
{
  "overallEvaluation": "학생 프로필 종합 평가 (2~3문장)",
  "academicInsights": [
    {
      "academicArea": "문학 작품 분석",
      "coreSkill": "핵심 전공 스킬",
      "industryTranslation": "산업계 치환 역량",
      "studentApplication": "학생 맞춤 적용법"
    },
    { "academicArea": "영어 독해 및 작문", "coreSkill": "...", "industryTranslation": "...", "studentApplication": "..." },
    { "academicArea": "번역 및 로컬라이제이션", "coreSkill": "...", "industryTranslation": "...", "studentApplication": "..." },
    { "academicArea": "언어학", "coreSkill": "...", "industryTranslation": "...", "studentApplication": "..." },
    { "academicArea": "문화 연구", "coreSkill": "...", "industryTranslation": "...", "studentApplication": "..." }
  ],
  "recommendedPaths": [
    {
      "id": "path-1",
      "title": "직무명",
      "tagline": "슬로건",
      "fieldCategory": "출판 및 편집 | 번역 및 로컬라이제이션 | 교육 및 영어 교육 | 콘텐츠 기획 및 제작 | 마케팅 | 연구 및 기타 관련 분야",
      "matchScore": 93,
      "englishLitAdvantage": "영문과 전공 지식이 이 직무에서 결정적 차별점이 되는 이유",
      "reasoning": {
        "interestsConnection": "학생의 관심 분야와 연계되는 구체적 이유",
        "strengthsConnection": "학생의 보유 강점과 연계되는 구체적 이유",
        "majorExperienceConnection": "영문과 전공 학업/경험과 연계되는 구체적 이유"
      },
      "keyResponsibilities": ["주요 실무 1", "주요 실무 2", "주요 실무 3"],
      "requiredSkills": ["핵심 요구 스킬 1", "핵심 요구 스킬 2", "핵심 요구 스킬 3"],
      "competencyComparison": {
        "requiredCompetencies": ["직무 필요 역량 1", "직무 필요 역량 2", "직무 필요 역량 3", "직무 필요 역량 4"],
        "matchedStudentCompetencies": ["학생이 이미 갖춘 역량 1", "학생이 이미 갖춘 역량 2"],
        "gapCompetencies": ["보완해야 할 실무 역량 1", "보완해야 할 실무 역량 2"],
        "analysisSummary": "역량 비교 분석 요약 코멘트"
      },
      "careerProspect": "산업계 동향 및 실무 전망",
      "firstStepAction": "이번 주에 즉시 실천할 수 있는 첫 걸음",
      "recommendedKeywords": ["키워드1", "키워드2", "키워드3"],
      "reliabilityNote": "채용 공고 확인 필요 사항 (자격 요건, 전형 일정 등)"
    }
  ],
  "diagnosis": {
    "competencyScores": [
      { "name": "텍스트 맥락 및 비판적 분석력", "score": 90, "description": "설명" },
      { "name": "국/영문 서사 기획 및 문장력", "score": 88, "description": "설명" },
      { "name": "글로벌 문화 감수성 및 소통", "score": 85, "description": "설명" },
      { "name": "디지털 툴 및 데이터 리터러시", "score": 65, "description": "설명" },
      { "name": "비즈니스 전략 및 실행력", "score": 70, "description": "설명" },
      { "name": "취업 시장 포트폴리오 준비도", "score": 60, "description": "설명" }
    ],
    "coreStrengths": [
      { "title": "강점명", "description": "상세 설명", "marketValue": "시장 가치" }
    ],
    "skillGaps": [
      { "skill": "부족 역량명", "reason": "영문과에서 이 갭이 생기는 이유", "solution": "실천적 극복 방안", "recommendedResource": "추천 자료" }
    ],
    "practicalActions": [
      { "category": "프로젝트", "title": "액션명", "target": "목표", "timing": "시기", "importance": "필수" }
    ]
  },
  "roadmap": {
    "currentSemester": {
      "title": "현재 학기: ...",
      "subtitle": "설명",
      "timeframe": "현재 ~ 학기말",
      "focusGoal": "목표",
      "tasks": [
        { "id": "task-c1", "title": "과제명", "category": "학업/수강", "description": "상세설명", "completed": false, "timeframe": "1~4주차", "measurableGoal": "지표" }
      ]
    },
    "vacation": {
      "title": "방학 기간: ...",
      "subtitle": "설명",
      "timeframe": "방학 기간",
      "focusGoal": "목표",
      "tasks": [
        { "id": "task-v1", "title": "과제명", "category": "자격증/어학", "description": "상세설명", "completed": false, "timeframe": "방학 1~3주", "measurableGoal": "지표" }
      ]
    },
    "nextSemester": {
      "title": "다음 학기: ...",
      "subtitle": "설명",
      "timeframe": "다음 학기",
      "focusGoal": "목표",
      "tasks": [
        { "id": "task-n1", "title": "과제명", "category": "포트폴리오", "description": "상세설명", "completed": false, "timeframe": "학기 중", "measurableGoal": "지표" }
      ]
    },
    "graduationVision": {
      "expectedTitle": "졸업 시점 나의 프로필 타이틀",
      "portfolioHighlights": ["성과 1", "성과 2", "성과 3"],
      "summary": "취업 시장 포지셔닝 요약"
    }
  },
  "suggestedFollowUpQuestions": [
    "추가 질문 1",
    "추가 질문 2",
    "추가 질문 3",
    "추가 질문 4"
  ],
  "reliabilityNotice": "안내: 본 진로 컨설팅은 영문과 학부생의 역량 개발을 위한 가이드이며, 구체적인 채용 자격 요건은 공식 채용공고를 확인해야 합니다."
}
`;

      const generatePromise = aiClient.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          systemInstruction: '당신은 대한민국 대학 영어영문학과 학부생 전문 AI 진로 컨설턴트입니다. 영문과의 문학 분석, 독해/작문, 번역/통역, 언어학, 문화 연구 역량을 산업계 실무와 신뢰성 있게 연결하세요. 근거 없는 통계나 취업률, 연봉을 조작하지 마세요.',
          responseMimeType: 'application/json',
        },
      });

      const timeoutPromise = new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('Gemini API counseling timeout')), 10000)
      );

      const response = await Promise.race([generatePromise, timeoutPromise]);
      const responseText = response.text;
      if (responseText) {
        const parsed = JSON.parse(responseText);
        parsed.generatedAt = new Date().toISOString();
        return res.json(parsed);
      }
    } catch (err) {
      console.error('Gemini API call failed or timed out, using high-quality fallback generator:', err);
    }
  }

  // Fallback if API key is not present or error occurred
  const fallback = generateFallbackCounseling(profile);
  res.json(fallback);
});

// POST /api/chat
app.post('/api/chat', async (req: Request, res: Response) => {
  const { message, history, profile, selectedPathTitle } = req.body;

  if (!message) {
    return res.status(400).json({ error: '메시지를 입력해주세요.' });
  }

  if (aiClient && process.env.GEMINI_API_KEY) {
    try {
      const systemInstruction = `당신은 대한민국 대학교 영어영문학과(English Literature) 재학생 전담 수석 AI 진로 멘토 'ENGLISH CAREER MATE'입니다.

[상담 지침]
1. 영문과 전공의 5대 축(문학 작품 분석, 고급 영어 독해 및 작문, 번역 및 로컬라이제이션, 언어학, 영미 문화 연구)을 깊이 이해하고 답변에 녹여내세요.
2. 추천 가능한 직무 범주(출판 및 편집, 번역 및 로컬라이제이션, 교육 및 영어 교육, 콘텐츠 기획 및 제작/UX라이팅, 마케팅, 문화/연구 등)의 실무 현실을 명확히 안내하세요.
3. [신뢰성 원칙] 임의로 만들어낸 취업률, 평균 연봉, 가공의 채용 인원 수 등을 답변에 포함하지 마세요. 방향성 조언과 실제 확인이 필요한 채용 요건(공식 채용공고 확인 필요)을 분리하여 설명하세요.
4. 학생의 질문에 정보가 부족하거나(예: 진출하고 싶은 구체적 산업, 관심 있는 언어권, 희망 기업 형태 등) 선택지가 갈릴 때는, 더 정확한 조언을 위해 자연스러운 후속 질문을 1~2개 던져주세요.
5. 친절하고 전문적이며 자신감을 북돋아 주는 존댓말 멘토의 톤을 유지하세요.

[현재 상담 학생 프로필]
- 학년: ${profile?.year || '대학생'}
- 관심사: ${profile?.interests?.join(', ') || '문학, 글쓰기, 콘텐츠'}
- 보유 역량/강점: ${profile?.strengths?.join(', ') || '텍스트 분석, 어학, 스토리텔링'}
- 대내외 경험: ${profile?.experiences?.join(', ') || '학회, 동아리'}
- 현재 고민: ${profile?.careerConcerns || '취업 및 진로 방향 고민'}
${selectedPathTitle ? `- 현재 논의 중인 직무: ${selectedPathTitle}` : ''}
`;

      // Filter history to ensure it starts with 'user' role
      const validHistory: { role: string; parts: { text: string }[] }[] = [];
      let foundFirstUser = false;
      if (Array.isArray(history)) {
        for (const h of history) {
          if (!foundFirstUser && h.sender === 'user') {
            foundFirstUser = true;
          }
          if (foundFirstUser) {
            validHistory.push({
              role: h.sender === 'user' ? 'user' : 'model',
              parts: [{ text: String(h.content || '') }]
            });
          }
        }
      }

      const contents = [
        ...validHistory,
        { role: 'user', parts: [{ text: message }] }
      ];

      const generatePromise = aiClient.models.generateContent({
        model: 'gemini-3.8-flash',
        contents,
        config: {
          systemInstruction,
        }
      });

      const timeoutPromise = new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('Gemini API timeout')), 8000)
      );

      const response = await Promise.race([generatePromise, timeoutPromise]);
      const reply = response.text || '응답을 생성하지 못했습니다.';
      return res.json({ reply });
    } catch (err) {
      console.error('Chat error with Gemini, falling back gracefully:', err);
    }
  }

  // Fallback response for chat
  const fallbackReplies: { [key: string]: string } = {
    출판: `**[출판 및 편집 분야 진로 조언]**
영문과에서 배운 문학 작품 분석력과 고급 원서 독해력은 출판 분야의 **'해외 도서 판권 검토(Reader's Report)'**와 **'원고 기획'**에서 가장 강력한 무기입니다.

1. **학생의 강점 연계**:
   - 원서의 행간과 서사 구조를 읽어내는 힘은 "이 책이 국내 독자에게 어떤 울림을 줄 수 있는가"를 기획서로 입증하는 핵심입니다.
2. **역량 비교 (보유 vs 필요)**:
   - **보유 역량**: 원서 독해력, 텍스트 분석력, 국/영문 문장력
   - **보완 필요 역량**: 출판 제작 프로세스(조판/인쇄), 편집 프로그램 기초, 출판 계약 법무 기초
3. **취업 정보 신뢰성 안내**:
   - 출판사는 대규모 정기 공채보다는 결원 발생 시 수시 채용 및 출판학교(SBI 등) 연계 채용 비중이 높으므로, 출판인 구인 사이트(KPA 등)를 상시 확인하시는 것을 권장합니다.

**추가로 여쭙고 싶은 점**: 혹시 관심 있는 도서 분야가 **'영미 문학/소설'** 쪽이신가요, 아니면 **'인문/교양/실용서'** 쪽이신가요?`,

    로컬라이제이션: `**[번역 및 로컬라이제이션(Localization) 분야 진로 조언]**
단순 번역을 넘어 글로벌 IT 서비스, 게임, 미디어 콘텐츠를 현지 문화에 맞게 재구성하는 직무입니다.

1. **전공 연계 강점**:
   - 영문학의 '문화 연구'와 '언어학' 훈련은 기계 번역(AI)이 결코 잡아내지 못하는 유머, 관용어, 문화적 금기어를 정밀하게 감수하는 원천이 됩니다.
2. **역량 비교**:
   - **보유 역량**: 고급 영문 독해, 문화적 맥락 치환 능력
   - **보완 필요 역량**: CAT Tool(Trados, Phrase 등) 기초 이해, 소프트웨어 UI 문자열 제약(글자수 제한) 최적화
3. **신뢰성 안내**:
   - 로컬라이제이션 PM이나 QA 채용은 글로벌 테크 기업 및 전문 에이전시의 공식 채용 페이지를 통해 자격 요건(CAT 툴 숙련도 등)을 사전에 확인하셔야 합니다.

**추가 질문**: 게임 현지화, 글로벌 IT 앱 서비스, 영상 번역 중 어떤 매체에 더 흥미를 느끼시나요?`,

    복수전공: `**[영문과 학생의 복수전공 전략 조언]**
결론부터 말씀드리면, **'목표로 하는 직무 분야에 따라 복수전공의 필요성이 완전히 달라집니다.'**

1. **상경계열(경영/경제) 복전이 권장되는 분야**:
   - 일반 대기업 해외영업, 경영지원/전략기획, 종합상사
2. **복전보다 '실무 포트폴리오'가 훨씬 중요한 분야**:
   - **출판 및 편집**: 출판 기획서, 서평 아티클, 도서 큐레이션 채널
   - **콘텐츠 기획 & UX 라이팅**: 가상 서비스 카피 리디자인, 피그마 케이스 스터디
   - **번역 및 로컬라이제이션**: 실제 번역 샘플 포트폴리오, CAT 툴 경험
3. **신뢰성 안내**:
   - 채용 시장에서 '복수전공 유무' 자체가 가산점으로 고정되어 있는 경우는 드물며, 실무 과제 전형과 직무 관련 프로젝트 경험이 서류 통과의 실질적 지표가 됩니다.

**추가 질문**: 현재 생각하시는 직무가 비즈니스 일반(영업/관리) 쪽인가요, 아니면 텍스트/콘텐츠 실무(에디팅/라이팅/마케팅) 쪽인가요?`,

    ux: `**[UX 라이터 & 콘텐츠 기획 분야 진로 조언]**
영문학의 '언어학(화용론)'과 '문학 분석력'이 IT 업계에서 가장 직접적으로 환영받는 직무입니다.

1. **전공 연계 이유**:
   - 사용자가 앱 화면에서 길을 잃지 않도록 가장 직관적인 단어를 선별하는 작업은 영문과에서 단어의 어원과 맥락을 공부했던 훈련과 직결됩니다.
2. **역량 비교**:
   - **보유 역량**: 정밀한 문장 교정, 독자 중심 공감력, 논리적 서사 구성
   - **보완 필요 역량**: 피그마(Figma) 컴포넌트 협업 이해, 데이터 기반 A/B 테스트 지표
3. **신뢰성 안내**:
   - UX 라이터는 신입 정기 공채보다는 인턴십이나 주니어 수시 채용으로 열리는 경우가 많으므로, 기업별 Tech 채용 블로그를 정기적으로 모니터링해야 합니다.

**첫 실천 액션**: 평소 쓰시면서 불편했던 금융/배달 앱의 에러 팝업 문구를 골라 'Before & After'로 다듬는 1페이지 포트폴리오를 만들어보세요!`,

    기본: `영문과에서 배우는 문학 작품 분석, 정밀 영어 독해·작문, 번역과 언어학, 문화 연구는 AI 시대에 사람의 마음을 움직이는 독보적인 자산입니다.

출판 및 편집, 번역/로컬라이제이션, 콘텐츠 기획/UX 라이팅, 글로벌 마케팅 등 관심 있는 분야나 학년별 준비 방법이 있으시면 구체적으로 질문해 주세요!`
  };

  let chosenReply = fallbackReplies['기본'];
  const lowerMsg = message.toLowerCase();
  if (lowerMsg.includes('출판') || lowerMsg.includes('편집') || lowerMsg.includes('책')) {
    chosenReply = fallbackReplies['출판'];
  } else if (lowerMsg.includes('번역') || lowerMsg.includes('로컬라이제이션') || lowerMsg.includes('통역') || lowerMsg.includes('현지화')) {
    chosenReply = fallbackReplies['로컬라이제이션'];
  } else if (lowerMsg.includes('복전') || lowerMsg.includes('복수전공') || lowerMsg.includes('경영')) {
    chosenReply = fallbackReplies['복수전공'];
  } else if (lowerMsg.includes('ux') || lowerMsg.includes('라이터') || lowerMsg.includes('콘텐츠')) {
    chosenReply = fallbackReplies['ux'];
  }

  res.json({ reply: chosenReply });
});

// POST /api/generate-roadmap (AI personalized roadmap generation/regeneration)
app.post('/api/generate-roadmap', async (req: Request, res: Response) => {
  const { profile, targetRole, customFocus } = req.body;

  if (!profile || !profile.year) {
    return res.status(400).json({ error: '학생 프로필 정보가 누락되었습니다.' });
  }

  const roleName = targetRole || profile.careerInterests || '글로벌 콘텐츠 에디터 & UX 라이터';

  if (aiClient && process.env.GEMINI_API_KEY) {
    try {
      const prompt = `
당신은 대한민국 대학 영어영문학과(English Literature) 학부생 전문 AI 진로 로드맵 설계사입니다.

[학생 프로필]
- 학년: ${profile.year}
- 관심 분야: ${profile.interests?.join(', ')}
- 보유 강점: ${profile.strengths?.join(', ')}
- 대내외 경험: ${profile.experiences?.join(', ')}
- 진로 목표 / 희망 직무: ${roleName}
${customFocus ? `- 사용자 요청 중점 사항: ${customFocus}` : ''}

[로드맵 구성 필수 요구사항]
반드시 다음 세 가지 기간으로 로드맵을 구성하세요:
1. 현재 학기 (Current Semester)
2. 다가오는 방학 (Upcoming Vacation)
3. 다음 학기 (Next Semester)

[각 로드맵 활동 필수 4요소 - 엄격 준수]
모든 세부 과제는 실제로 실천할 수 있을 정도로 구체적이어야 하며 다음 4개 속성을 반드시 포함해야 합니다:
1. title: 구체적으로 수행해야 할 활동 (예: "영어 작문 샘플 2개 제작하기 (원서 서평 & 브랜드 아티클)", "출판 및 콘텐츠 관련 기업 5곳 조사하기", "콘텐츠 포트폴리오 프로젝트 1개 제작하기", "희망 직무 종사자와 직무 인터뷰 진행하기", "관련 인턴십 및 채용 공고 조사하기" 등)
2. whyNeeded: 해당 활동이 희망 직무(${roleName})에 필요한 구체적 이유 (영문과 전공 역량과 연결)
3. measurableTarget: 달성 여부를 검증할 수 있는 정량적/구체적 목표 결과물
4. category: "학업/수강" | "포트폴리오" | "대외활동/인턴" | "자격증/어학" | "직무탐색/네트워킹" 중 하나

[출력 형식 - 순수 JSON만 반환 (마크다운 백틱 제외)]:
{
  "targetRole": "${roleName}",
  "currentSemester": {
    "title": "현재 학기: ...",
    "subtitle": "한 줄 방향성 요약",
    "timeframe": "현재 ~ 학기말 (약 3개월)",
    "focusGoal": "현재 학기 핵심 실천 목표",
    "tasks": [
      {
        "id": "task-c1",
        "title": "활동명",
        "whyNeeded": "필요한 이유",
        "measurableTarget": "달성 확인 구체적 목표",
        "category": "포트폴리오",
        "completed": false,
        "timeframe": "1~4주차",
        "description": "세부 실행 팁"
      },
      ... (총 3~4개 과제)
    ]
  },
  "vacation": {
    "title": "다가오는 방학: ...",
    "subtitle": "방학 집중 실천 방향",
    "timeframe": "방학 2개월",
    "focusGoal": "방학 핵심 목표",
    "tasks": [
      ... (총 3~4개 과제)
    ]
  },
  "nextSemester": {
    "title": "다음 학기: ...",
    "subtitle": "인턴 및 실전 준비",
    "timeframe": "다음 학기 (약 4개월)",
    "focusGoal": "다음 학기 핵심 목표",
    "tasks": [
      ... (총 3~4개 과제)
    ]
  },
  "graduationVision": {
    "expectedTitle": "졸업 시점 나의 프로필 타이틀",
    "portfolioHighlights": ["성과 1", "성과 2", "성과 3"],
    "summary": "취업 시장 포지셔닝 요약"
  }
}
`;

      const generatePromise = aiClient.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          systemInstruction: '당신은 영어영문학과 학부생 전문 AI 진로 로드맵 설계사입니다. 각 기간별 구체적 활동, 직무에 필요한 이유, 달성 확인 목표를 명확히 포함하여 순수 JSON으로만 출력하세요.',
          responseMimeType: 'application/json',
        },
      });

      const timeoutPromise = new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('Gemini API roadmap timeout')), 10000)
      );

      const response = await Promise.race([generatePromise, timeoutPromise]);
      const responseText = response.text;
      if (responseText) {
        const parsed = JSON.parse(responseText);
        return res.json(parsed);
      }
    } catch (err) {
      console.error('Gemini roadmap generation failed, using tailored fallback:', err);
    }
  }

  // Fallback tailored to the target role
  const fallback = generateFallbackCounseling(profile).roadmap;
  fallback.targetRole = roleName;
  res.json(fallback);
});

// GET /api/health
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    hasApiKey: !!process.env.GEMINI_API_KEY,
    timestamp: new Date().toISOString()
  });
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`ENGLISH CAREER MATE Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
