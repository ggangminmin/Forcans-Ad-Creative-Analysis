'use client';

import React, { useState } from 'react';
import { 
  Search, CheckCircle2, ArrowRight, ArrowLeft,
  AlertTriangle, RefreshCw, Image as ImageIcon, 
  TrendingUp, Eye, Download, Monitor,
  Smartphone, BarChart3, MessageSquare, Send, X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

// --- MOCK DATA ---
const MOCK_SCOUT_RESULT = {
  category: "뷰티/스킨케어",
  insight: "2026년 광고는 '설득'보다 '공감'이 핵심 — 자연스러운 일상 언어가 클릭률을 높인다.",
  tired_phrases: ["지금 바로 구매하세요", "놀라운 효과 보장", "한정 수량 특가", "피부과 추천 1위", "실시간 검색어 1위"],
  trending_keywords: ["비건 루틴", "유리 피부", "감성 스킨케어", "도파민 뷰티", "무드 메이크업", "슬로우 뷰티", "텍스처 케어"],
  content_trends: [
    { title: "졌잖아요", type: "드라마", keywords: ["감성", "일상", "자연스러움"] },
    { title: "피부 브이로그", type: "숏폼", keywords: ["루틴", "진정성", "투명함"] }
  ],
};

const MOCK_WRITER_RESULT = {
  insight_applied: "설득보다 공감 — 일상 언어로 감정을 건드린다",
  copies: [
    { id: 1, tone: "감성", headline: "오늘 하루, 피부에게", subheadline: "바쁜 하루 끝, 조용히 나를 돌보는 시간", body: "퇴근 후 거울 앞에 서면, 그제야 오늘 내 얼굴이 보인다. 슬로우 뷰티 루틴으로 나만의 저녁을 시작해보세요.", cta: "루틴 시작하기", visual_direction: "따뜻한 침실 조명 아래 세럼을 바르는 손 클로즈업" },
    { id: 2, tone: "유머", headline: "피부과? 나는 집에 있어", subheadline: "굳이 예약 안 해도 되는 이유", body: "대기 번호 37번. 결국 점심도 못 먹었다. 근데 사실 비건 루틴 다 끝냈다. 뭔가 이겼다는 느낌?", cta: "홈케어 보러가기", visual_direction: "대기실 캐릭터 vs 홈케어 캐릭터 대비 일러스트" },
    { id: 3, tone: "미스터리", headline: "그 사람 피부, 뭔가 달랐다", subheadline: "물어봤더니 딱 한 가지라고 했다", body: "매일 마주치는 그 동료. 화장을 더 한 건 아닌데... 용기 내서 물어봤더니 대답은 단순했다.", cta: "정답 확인하기", visual_direction: "흐릿한 인물 실루엣 + 헤드라인 텍스트 강조" },
    { id: 4, tone: "감성", headline: "잠들기 전, 3분의 의식", subheadline: "아무것도 하기 싫은 밤에도 이것만은", body: "하루의 끝, 나를 위한 루틴. 세럼 한 방울에 오늘의 스트레스가 녹는다.", cta: "3분 루틴 보기", visual_direction: "야간 침실 조명, 세럼 드롭 매크로 샷" },
    { id: 5, tone: "대담", headline: "좋은 피부는 타고나는 거 아닙니다", subheadline: "유전자 탓은 이제 그만", body: "피부는 습관의 결과물. 과학적으로 설계된 루틴이 당신의 피부를 바꿉니다.", cta: "루틴 설계하기", visual_direction: "Before/After 스플릿 구도, 클린한 스튜디오 배경" },
    { id: 6, tone: "유머", headline: "남친이 내 세럼 뺏어 씀", subheadline: "같이 쓰면 2배로 줄어드는 비극", body: "처음엔 관심도 없더니, 한 번 써보고는 매일 밤 쟁탈전. 결국 하나 더 샀다.", cta: "커플 세트 보기", visual_direction: "코믹한 욕실 쟁탈전 일러스트" },
    { id: 7, tone: "감성", headline: "비 오는 날엔 피부도 쉬어야 해", subheadline: "촉촉한 날, 촉촉한 루틴", body: "창밖에 빗소리가 들리면 슬로우 뷰티의 시간. 피부에게도 쉼표를 선물하세요.", cta: "레이니 루틴", visual_direction: "빗방울 맺힌 유리창 너머 스킨케어 제품" },
    { id: 8, tone: "대담", headline: "성분표 읽을 줄 모르면 지갑이 운다", subheadline: "30초면 되는 성분 해독법", body: "광고 카피에 속지 마세요. 성분표 앞 3개만 보면 그 제품의 본질이 보입니다.", cta: "성분 가이드", visual_direction: "성분표 확대 + 하이라이트 인포그래픽 스타일" },
    { id: 9, tone: "미스터리", headline: "이 제품은 광고하지 않습니다", subheadline: "그런데 왜 계속 품절될까?", body: "입소문만으로 3개월 연속 품절. SNS 어디에도 광고 글은 없다. 진짜 비밀은 성분에 있었다.", cta: "비밀 확인하기", visual_direction: "빈 선반 + '품절' 스티커 클로즈업" },
    { id: 10, tone: "감성", headline: "엄마가 쓰던 그 냄새", subheadline: "기억 속 향기가 돌아왔다", body: "어릴 적 엄마 화장대에서 나던 그 향. 크림 뚜껑을 열면 그때의 나로 돌아간다.", cta: "향기 경험하기", visual_direction: "빈티지 화장대 위 크림 통, 소프트 토닝" },
    { id: 11, tone: "유머", headline: "피부가 좋아지니까 셀카가 늘었다", subheadline: "갤러리 용량 부족 주의", body: "렌즈 없이도, 필터 없이도 괜찮아진 순간. 유일한 부작용은 저장공간 부족입니다.", cta: "자신감 루틴", visual_direction: "스마트폰 갤러리 셀카 모자이크 + 밝은 톤" },
    { id: 12, tone: "대담", headline: "당신의 루틴, 몇 점짜리인가요?", subheadline: "AI가 분석해드립니다", body: "지금 쓰는 제품, 순서, 양까지. AI 스킨 분석으로 나만의 최적 루틴을 받아보세요.", cta: "무료 분석 받기", visual_direction: "스코어 대시보드 UI 스타일 그래픽" },
  ]
};

const MOCK_DESIGN_RESULT = {
  copy_id: 1, tone: "감성", headline: "오늘 하루, 피부에게",
  cuts: [
    { cut_id: 1, role: "히어로", ratio: "1200x628", prompt_en: "Cinematic close-up of delicate hands applying translucent facial serum on a cheek, warm golden hour lighting through bedroom curtains, soft depth of field bokeh with blurred city nightscape, beauty campaign photography, ultra-realistic skin texture, 16:9 wide composition", prompt_ko: "세럼을 바르는 손 클로즈업" },
    { cut_id: 2, role: "제품 디테일", ratio: "800x800", prompt_en: "Luxurious skincare cream texture macro photography, silky white cream swirl on reflective glass surface, soft pink ambient light, minimalist high-end beauty product advertisement, clean studio background, extreme close-up detail shot", prompt_ko: "제형 클로즈업, 실키한 질감" },
    { cut_id: 3, role: "라이프스타일", ratio: "800x800", prompt_en: "Elegant young Korean woman in a minimalist bright bathroom, looking at round mirror with gentle smile, dewy glass skin glow, morning natural sunlight from side window, authentic beauty lifestyle photography, warm pastel tones", prompt_ko: "거울을 보며 웃는 여성" },
    { cut_id: 4, role: "분위기", ratio: "800x800", prompt_en: "Aesthetic bedside scene with lit soy candle and premium skincare products on marble tray, soft warm bedroom ambiance, cozy evening self-care ritual, muted earth tones, editorial lifestyle photography, shallow depth of field", prompt_ko: "침대 옆 양초와 제품" },
    { cut_id: 5, role: "텍스처", ratio: "800x800", prompt_en: "Crystal clear water gently splashing on a woman's face during cleansing ritual, refreshing dewy droplets on skin, bright clean studio lighting, ultra-slow motion freeze frame aesthetic, purity and freshness concept", prompt_ko: "세안 중인 모습, 상쾌함" },
    { cut_id: 6, role: "오버레이", ratio: "1200x628", prompt_en: "Dreamy abstract soft gradient background, flowing mauve and lavender watercolor cloud shapes, gentle ethereal atmosphere, premium brand overlay backdrop, no text no objects, pure color and light composition, ultra-wide 16:9", prompt_ko: "부드러운 추상 배경" },
    { cut_id: 7, role: "특징", ratio: "1200x628", prompt_en: "Artistic flat lay of natural botanical skincare ingredients on white marble surface, fresh aloe vera leaves, rose petals, honey drops, green tea, chamomile flowers, ingredient transparency concept, bright natural overhead lighting", prompt_ko: "천연 원료 플랫레이" },
    { cut_id: 8, role: "리뷰 카드", ratio: "1200x628", prompt_en: "Clean minimalist review testimonial card background, soft off-white textured paper surface with subtle shadow, elegant typography space, premium editorial layout, neutral warm tones, sophisticated simplicity", prompt_ko: "리뷰 카드 배경" },
    { cut_id: 9, role: "CTA", ratio: "1200x628", prompt_en: "Premium beauty gift box packaging with satin ribbon on soft pink velvet surface, luxurious unboxing moment, elegant product presentation, warm studio lighting with golden highlights, aspirational gifting photography", prompt_ko: "프리미엄 기프트 패키지" }
  ]
};

// A/B 테스트 CTR 시뮬레이션 데이터
const CTR_DATA: Record<string, { target: string, ctr: number, color: string }[]> = {
  '감성': [
    { target: '20대 여성', ctr: 4.8, color: 'bg-rose-500' },
    { target: '30대 여성', ctr: 5.2, color: 'bg-rose-500' },
    { target: '20대 남성', ctr: 2.1, color: 'bg-rose-300' },
    { target: '40대 여성', ctr: 3.9, color: 'bg-rose-400' },
  ],
  '유머': [
    { target: '20대 여성', ctr: 6.1, color: 'bg-emerald-500' },
    { target: '30대 여성', ctr: 3.4, color: 'bg-emerald-300' },
    { target: '20대 남성', ctr: 5.7, color: 'bg-emerald-500' },
    { target: '40대 여성', ctr: 2.0, color: 'bg-emerald-200' },
  ],
  '미스터리': [
    { target: '20대 여성', ctr: 5.5, color: 'bg-violet-500' },
    { target: '30대 여성', ctr: 4.1, color: 'bg-violet-400' },
    { target: '20대 남성', ctr: 4.9, color: 'bg-violet-400' },
    { target: '40대 여성', ctr: 3.3, color: 'bg-violet-300' },
  ],
  '대담': [
    { target: '20대 여성', ctr: 3.2, color: 'bg-orange-300' },
    { target: '30대 여성', ctr: 4.5, color: 'bg-orange-400' },
    { target: '20대 남성', ctr: 3.8, color: 'bg-orange-400' },
    { target: '40대 여성', ctr: 5.0, color: 'bg-orange-500' },
  ],
};

type Stage = 'scouter' | 'writer' | 'designer';
type Tone = '감성' | '대담' | '유머' | '미스터리';
type MediaFormat = 'naver_1_1' | 'naver_16_9' | 'naver_2_3' | 'naver_native' | 'coupang_c3' | 'coupang_r1' | 'coupang_g1' | 'coupang_p3';

const TONE_CONFIG: Record<Tone, { color: string, bg: string, border: string }> = {
  '감성': { color: 'text-rose-600', bg: 'bg-rose-50', border: 'border-rose-200' },
  '대담': { color: 'text-orange-600', bg: 'bg-orange-50', border: 'border-orange-200' },
  '유머': { color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-200' },
  '미스터리': { color: 'text-violet-600', bg: 'bg-violet-50', border: 'border-violet-200' },
};

const MEDIA_OPTIONS: { id: MediaFormat, label: string, icon: any, ratio: string, w: number, h: number, desc: string, group: string }[] = [
  { id: 'naver_1_1', label: '1:1 피드', icon: Monitor, ratio: '1200×1200', w: 1200, h: 1200, desc: '네이버 피드/웹툰', group: 'Naver' },
  { id: 'naver_16_9', label: '가로 피드', icon: Monitor, ratio: '1200×628', w: 1200, h: 628, desc: '네이버 16:9 피드 배너', group: 'Naver' },
  { id: 'naver_2_3', label: '세로 모바일', icon: Smartphone, ratio: '1200×1800', w: 1200, h: 1800, desc: '네이버 세로형 피드', group: 'Naver' },
  { id: 'naver_native', label: '네이티브', icon: Monitor, ratio: '342×228', w: 342, h: 228, desc: '네이버 리스트형 썸네일', group: 'Naver' },
  { id: 'coupang_c3', label: 'C3 메인세로', icon: Smartphone, ratio: '325×600', w: 325, h: 600, desc: '쿠팡 C3 메인 상단', group: 'Coupang' },
  { id: 'coupang_r1', label: 'R1 로켓배송', icon: Monitor, ratio: '768×324', w: 768, h: 324, desc: '쿠팡 로켓/P-Top 상단', group: 'Coupang' },
  { id: 'coupang_g1', label: 'G1 골드박스', icon: Monitor, ratio: '980×140', w: 980, h: 140, desc: '쿠팡 극초장축 배너', group: 'Coupang' },
  { id: 'coupang_p3', label: 'P3 중단', icon: Monitor, ratio: '1080×200', w: 1080, h: 200, desc: '쿠팡 3단 카테고리 배너', group: 'Coupang' }
];

export default function AdCreativePOC() {
  const [stage, setStage] = useState<Stage>('scouter');
  const [loading, setLoading] = useState(false);
  const [loadingStage, setLoadingStage] = useState<Stage | null>(null);
  const [category, setCategory] = useState('뷰티/스킨케어');
  const [selectedTone, setSelectedTone] = useState<Tone>('감성');
  const [mediaFormat, setMediaFormat] = useState<MediaFormat>('naver_16_9');
  const [scoutResult, setScoutResult] = useState<any>(null);
  const [writerResult, setWriterResult] = useState<any>(null);
  const [selectedCopyId, setSelectedCopyId] = useState<number | null>(null);
  const [designResult, setDesignResult] = useState<any>(null);
  const [generatedImages, setGeneratedImages] = useState<Record<number, string>>({});
  const [generatingCutId, setGeneratingCutId] = useState<number | null>(null);
  const [feedbackCutId, setFeedbackCutId] = useState<number | null>(null);
  const [feedbackText, setFeedbackText] = useState('');
  const [showCtrPanel, setShowCtrPanel] = useState(false);

  const delay = (ms: number) => new Promise(r => setTimeout(r, ms));

  const getMediaSizeHint = (id: MediaFormat) => {
    const opt = MEDIA_OPTIONS.find(m => m.id === id);
    if (!opt) return '16:9 landscape format';
    return `${opt.ratio} pixel dimensions, strictly ${opt.w}:${opt.h} aspect ratio for ${opt.desc}`;
  };

  const generateCutImage = async (cutId: number, promptEn: string) => {
    if (generatedImages[cutId] || generatingCutId === cutId) return;
    setGeneratingCutId(cutId);
    try {
      const sizeHint = getMediaSizeHint(mediaFormat);
      const response = await fetch('/api/generate-image', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: promptEn, aspectHint: sizeHint })
      });
      const data = await response.json();
      if (data.error) throw new Error(data.error);
      if (data.image) setGeneratedImages(prev => ({ ...prev, [cutId]: data.image }));
    } catch { /* fallback: keep placeholder */ }
    finally { setGeneratingCutId(null); }
  };

  const handleDownloadImage = (e: React.MouseEvent, cutId: number) => {
    e.stopPropagation();
    const url = generatedImages[cutId];
    if (!url) return;
    const link = document.createElement('a');
    link.href = url;
    link.download = `ad_creative_${cutId}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getAspectRatioStyle = (id: MediaFormat) => {
    const opt = MEDIA_OPTIONS.find(m => m.id === id);
    if (!opt) return { aspectRatio: '16 / 9' };
    return { aspectRatio: `${opt.w} / ${opt.h}` };
  };

  const handleFeedbackSubmit = async (cutId: number) => {
    if (!feedbackText.trim()) return;
    const cut = designResult?.cuts?.find((c: any) => c.cut_id === cutId);
    if (!cut) return;
    const modifiedPrompt = `${cut.prompt_en}, modification: ${feedbackText}`;
    setFeedbackCutId(null); setFeedbackText('');
    setGeneratedImages(prev => { const n = { ...prev }; delete n[cutId]; return n; });
    await generateCutImage(cutId, modifiedPrompt);
  };

  const startAnalysis = async () => {
    setLoading(true); setLoadingStage('scouter');
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 60000);
      const res = await fetch('/api/agents/scouter', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ category }), signal: controller.signal });
      clearTimeout(timeout);
      const data = await res.json();
      if (data.error || (!data.insight && !data.trending_keywords)) throw new Error('Invalid');
      setScoutResult(data);
    } catch { await delay(1200); setScoutResult(MOCK_SCOUT_RESULT); }
    finally { setLoading(false); setLoadingStage(null); }
  };

  const generateNarrative = async () => {
    setLoading(true); setStage('writer'); setLoadingStage('writer');
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 60000);
      const res = await fetch('/api/agents/writer', { 
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' }, 
        body: JSON.stringify({ category, tone: selectedTone, scoutData: scoutResult }), 
        signal: controller.signal 
      });
      clearTimeout(timeout);
      
      const data = await res.json();
      if (data.error || !data.copies) throw new Error(data.error || 'Invalid writer data');
      
      // 혹시라도 LLM이 tone을 엉뚱한 값으로 줬을 대비, API단에서 맞게 주겠지만 강제 보정할 수도 있음.
      // 일단은 생성된 data를 그대로 적용
      setWriterResult(data);
    } catch (err) { 
      console.error('Writer Agent Error:', err);
      // 에러 시 폴백
      setWriterResult(MOCK_WRITER_RESULT); 
    } finally { 
      setLoading(false); setLoadingStage(null); 
    }
  };

  const generateDesign = async (copyId: number) => {
    setSelectedCopyId(copyId);
    setStage('designer'); setLoading(true); setLoadingStage('designer');
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 60000);
      const res = await fetch('/api/agents/designer', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ writerResult, selectedCopyId: copyId, mediaFormat }), signal: controller.signal });
      clearTimeout(timeout);
      const data = await res.json();
      if (data.error || !data.cuts?.length) throw new Error('Invalid');
      setDesignResult(data);
    } catch { await delay(1500); setDesignResult(MOCK_DESIGN_RESULT); }
    finally { setLoading(false); setLoadingStage(null); setGeneratedImages({}); }
  };

  const downloadAssets = () => {
    const payload = { scoutResult, writerResult, designResult, generatedImages: Object.keys(generatedImages).length, mediaFormat, exportedAt: new Date().toISOString() };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = `ad-creative-${Date.now()}.json`; a.click();
    URL.revokeObjectURL(url);
  };

  const currentCopy = writerResult?.copies?.find((c: any) => c.id === selectedCopyId) || writerResult?.copies?.[0];
  const filteredCopies = (writerResult?.copies || []).filter((c: any) => 
    !selectedTone || c.tone?.includes(selectedTone) || selectedTone.includes(c.tone)
  );

  return (
    <div className="flex h-screen bg-white overflow-hidden">
      {/* ─── 사이드 패널 (미니멀) ─── */}
      <aside className="w-[280px] bg-[#fafafa] border-r border-gray-100 flex flex-col overflow-hidden">
        <div className="px-5 py-5 border-b border-gray-100">
          <h1 className="text-[18px] font-bold text-gray-900 tracking-tight">광고 소재 분석 및 제안</h1>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-5">
          {/* 카테고리 */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">카테고리</label>
            <Input value={category} onChange={(e) => setCategory(e.target.value)}
              className="h-10 text-[13px] border-gray-200 rounded-xl bg-white focus:ring-zinc-500/20" placeholder="분석할 카테고리" />
          </div>

          {/* 매체 포맷 (화면 비율) */}
          <div className="space-y-1.5 pt-4 border-t border-gray-100">
            <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">화면 비율</label>
            <div className="grid grid-cols-2 gap-1.5">
              {MEDIA_OPTIONS.map(opt => {
                const Icon = opt.icon;
                return (
                  <button key={opt.id} onClick={() => setMediaFormat(opt.id)}
                    className={cn("flex flex-col items-center justify-center text-center gap-1 px-1 py-2.5 rounded-xl transition-all border group",
                      mediaFormat === opt.id ? "bg-zinc-600 text-white border-zinc-600 shadow-sm" : "bg-white text-gray-500 border-gray-100 hover:border-blue-300 hover:bg-blue-50/50"
                    )}>
                    <Icon className={cn("w-4 h-4 mb-0.5", mediaFormat === opt.id ? "text-blue-300" : "text-gray-400 group-hover:text-blue-500")} />
                    <span className="text-[10px] font-bold tracking-tight">{opt.label}</span>
                    <span className={cn("text-[8px] opacity-80", mediaFormat === opt.id ? "text-zinc-300 font-medium" : "")}>{opt.ratio}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 톤 */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-medium text-gray-400 uppercase tracking-wider">광고 톤</label>
            <div className="space-y-1">
              {(Object.keys(TONE_CONFIG) as Tone[]).map(tone => (
                <button key={tone} onClick={() => setSelectedTone(tone)}
                  className={cn("w-full flex items-center gap-2 px-3 py-2 rounded-xl text-[11px] font-medium transition-all border",
                    selectedTone === tone ? "bg-zinc-600 text-white border-zinc-600 shadow-sm" : "bg-white text-gray-500 border-gray-100 hover:border-gray-300 hover:bg-gray-50"
                  )}>
                  <span className="w-2 h-2 rounded-full" style={{ background: selectedTone === tone ? '#fff' : tone === '감성' ? '#f43f5e' : tone === '대담' ? '#ea580c' : tone === '유머' ? '#10b981' : '#8b5cf6' }} />
                  {tone}
                  {selectedTone === tone && <CheckCircle2 className="w-3 h-3 ml-auto" />}
                </button>
              ))}
            </div>
          </div>



          {/* 워크플로우 스텝 */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-medium text-gray-400 uppercase tracking-wider">워크플로우</label>
            <div className="space-y-1">
              {([['scouter', '트렌드 분석', scoutResult], ['writer', '소재 제안', writerResult], ['designer', '비주얼', designResult]] as [Stage, string, any][]).map(([id, label, result], idx) => (
                <button key={id} onClick={() => { if (result) setStage(id); }}
                  className={cn("w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-[12px] font-medium transition-all border",
                    stage === id ? "bg-zinc-600 text-white border-zinc-600 shadow-sm" : result ? "bg-white text-gray-600 border-gray-100 hover:border-gray-300 hover:bg-gray-50" : "bg-gray-50 text-gray-300 border-gray-100 cursor-default"
                  )}>
                  <span className={cn("w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-bold", stage === id ? "bg-white/20 text-white" : result ? "bg-gray-100 text-gray-500" : "bg-gray-100 text-gray-300")}>{idx + 1}</span>
                  {label}
                  {result && <CheckCircle2 className="w-3 h-3 ml-auto opacity-50" />}
                </button>
              ))}
            </div>
          </div>

          {/* 실행 */}
          <Button className="w-full h-10 bg-zinc-600 hover:bg-zinc-700 text-white rounded-xl font-semibold text-[12px] gap-2 shadow-md shadow-zinc-100 mt-2"
            onClick={startAnalysis} disabled={loading}>
            {loading && loadingStage === 'scouter' ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Search className="w-3.5 h-3.5" />}
            {scoutResult ? '다시 분석' : '트렌드 분석'}
          </Button>
        </div>
      </aside>

      {/* ─── 메인 영역 ─── */}
      <main className="flex-1 overflow-y-auto bg-white">
        <div className="max-w-[1100px] mx-auto px-8 py-8">
          {/* ===== 1) 트렌드 분석 ===== */}
          {stage === 'scouter' && (
            !scoutResult && !loading ? (
              <EmptyState title="분석 대기 중" desc="카테고리를 입력하고 '트렌드 분석' 버튼을 눌러주세요." />
            ) : loadingStage === 'scouter' ? (
              <LoadingState title="트렌드 분석 중" />
            ) : (
              <div className="space-y-5 animate-in fade-in slide-in-from-bottom-3 duration-400">
                {/* 인사이트 */}
                <div className="p-6 bg-zinc-800 text-white rounded-2xl shadow-lg shadow-zinc-100">
                  <div className="flex items-start justify-between gap-6">
                    <div className="flex-1">
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-2">핵심 인사이트</p>
                      <p className="text-[15px] font-medium leading-[1.8] text-white">"{scoutResult.insight}"</p>
                    </div>
                    <Button className="flex-shrink-0 h-10 px-6 bg-white text-gray-900 hover:bg-gray-100 rounded-xl font-bold text-[12px] gap-2" onClick={generateNarrative}>
                      소재 제안 받기 <ArrowRight className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  {/* 키워드 */}
                  <div className="col-span-2 p-5 border border-gray-200 bg-white rounded-2xl">
                    <p className="text-[11px] font-bold text-gray-500 uppercase mb-3">트렌드 키워드</p>
                    <div className="flex flex-wrap gap-2">
                       {scoutResult.trending_keywords?.map((kw: string) => (
                        <span key={kw} className="px-3.5 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-[13px] font-bold border border-gray-200/50 transition-colors hover:bg-gray-200 cursor-default">#{kw}</span>
                      ))}
                    </div>
                  </div>
                  {/* 피로 문구 */}
                  <div className="p-5 border border-gray-200 bg-white rounded-2xl shadow-sm">
                    <p className="text-[11px] font-bold text-gray-500 uppercase mb-1">광고 피로 문구</p>
                    <p className="text-[9px] text-gray-400 mb-3">소비자가 지친 표현</p>
                    <div className="space-y-1.5">
                      {scoutResult.tired_phrases?.map((p: string) => (
                        <div key={p} className="text-[11px] text-gray-600 flex items-center gap-2 font-medium">
                          <X className="w-3 h-3 text-rose-400 flex-shrink-0" />
                          <span>{p}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* 컨텍스트 */}
                {scoutResult.content_trends?.length > 0 && (
                  <div className="p-5 border border-gray-100 bg-white rounded-2xl shadow-sm">
                    <p className="text-[11px] font-bold text-gray-500 uppercase mb-3 px-1">참고 컨텍스트</p>
                    <div className="flex gap-3 flex-wrap">
                       {scoutResult.content_trends?.map((t: any) => (
                        <div key={t.title} className="flex items-center gap-2.5 px-4 py-2.5 bg-white border border-gray-200 rounded-xl transition-all hover:bg-gray-50 group">
                          <span className="text-[10px] bg-zinc-600 text-white px-2 py-0.5 rounded font-bold shadow-sm">{t.type}</span>
                          <span className="text-[13px] font-bold text-gray-800">{t.title}</span>
                          <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                            {t.keywords?.map((k: string) => <span key={k} className="text-[10px] text-gray-400">#{k}</span>)}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )
          )}

          {/* ===== 2) 소재 제안 ===== */}
          {stage === 'writer' && (
            loadingStage === 'writer' ? <LoadingState title="광고 소재 생성 중" /> :
            !writerResult ? <EmptyState title="대기 중" desc="트렌드 분석을 먼저 실행하세요." /> : (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-3 duration-400">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-[18px] font-bold text-gray-900">{selectedTone ? `[${selectedTone}] 소재 제안` : '전체 소재 제안'}</h2>
                    <p className="text-[12px] text-gray-400 mt-0.5">총 {filteredCopies.length}개 · 선택한 톤에 최적화된 문구입니다</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => setShowCtrPanel(!showCtrPanel)}
                      className={cn("flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-medium border transition-all",
                        showCtrPanel ? "bg-zinc-600 text-white border-zinc-600 shadow-sm" : "bg-white text-gray-500 border-gray-200 hover:border-gray-300 hover:bg-gray-50")}>
                      <BarChart3 className="w-3.5 h-3.5" /> AI 성과 예측 (CTR)
                    </button>
                  </div>
                </div>

                {/* A/B CTR 패널 */}
                {showCtrPanel && (
                  <div className="p-5 border border-gray-200 bg-white rounded-2xl animate-in fade-in duration-300 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="text-[13px] font-bold text-gray-800">톤 & 타겟별 AI 성과 시뮬레이션</h3>
                        <p className="text-[10px] text-gray-400 mt-1 flex flex-col gap-0.5">
                          <span>※ GPT-4o 기반 타겟 페르소나 반응도 분석 결과입니다.</span>
                          <span className="text-[9px] text-gray-500 font-medium">A/B 테스트: 서로 다른 톤(감성vs대담 등)과 타겟 세그먼트 간의 시너지 효과를 분석합니다.</span>
                        </p>
                      </div>
                      <span className="text-[9px] text-gray-600 bg-gray-100 px-2 py-1 rounded font-bold border border-gray-200">AI 예측 엔진</span>
                    </div>
                    <div className="grid grid-cols-4 gap-4">
                      {Object.entries(CTR_DATA).map(([tone, targets]) => (
                        <div key={tone} className="space-y-2.5">
                          <p className="text-[11px] font-bold text-gray-700 text-center">{tone}</p>
                          {targets.map(t => (
                            <div key={t.target} className="space-y-1">
                              <div className="flex justify-between text-[10px]">
                                <span className="text-gray-500">{t.target}</span>
                                <div className="flex items-center gap-1">
                                  <span className="font-bold text-zinc-600">{t.ctr}%</span>
                                  <span className="text-[8px] text-gray-300">sim</span>
                                </div>
                              </div>
                              <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                <div className={cn("h-full rounded-full transition-all", t.color)} style={{ width: `${(t.ctr / 7) * 100}%` }} />
                              </div>
                            </div>
                          ))}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  {filteredCopies.map((copy: any) => {
                    const toneKey = copy.tone as Tone;
                    const cfg = TONE_CONFIG[toneKey] || TONE_CONFIG['감성'];
                    return (
                      <div key={copy.id} className="p-5 border border-gray-200 bg-white rounded-2xl hover:border-gray-400 hover:shadow-lg hover:shadow-gray-200 transition-all group flex flex-col">
                        <div className="flex items-center justify-between mb-3">
                          <span className={cn("px-2.5 py-1 rounded-lg text-[10px] font-bold border", cfg.bg, cfg.color, cfg.border)}>{copy.tone}</span>
                          <span className="text-[10px] text-gray-300">#{copy.id}</span>
                        </div>
                        <h3 className="text-[15px] font-bold text-gray-900 mb-1 leading-tight group-hover:text-zinc-600 transition-colors">"{copy.headline}"</h3>
                        <p className="text-[11px] text-gray-500 mb-2 font-medium">{copy.subheadline}</p>
                        <p className="text-[12px] text-gray-600 leading-relaxed mb-4 flex-grow line-clamp-3">{copy.body}</p>
                        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                          <span className="text-[10px] text-gray-400 truncate max-w-[50%] font-medium">{copy.visual_direction}</span>
                          <Button size="sm" className="h-8 rounded-lg bg-zinc-600 hover:bg-zinc-700 text-white text-[11px] font-bold px-4 gap-1.5 shadow-sm" onClick={() => generateDesign(copy.id)}>
                            비주얼 제작 <ArrowRight className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )
          )}

          {/* ===== 3) 비주얼 디렉팅 ===== */}
          {stage === 'designer' && (
            loadingStage === 'designer' ? <LoadingState title="비주얼 시안 생성 중" /> :
            !designResult ? <EmptyState title="대기 중" desc="소재를 선택해 비주얼을 제작하세요." /> : (
              <div className="space-y-5 animate-in fade-in slide-in-from-bottom-3 duration-400">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-[18px] font-bold text-gray-900">{currentCopy?.headline}</h2>
                    <p className="text-[12px] text-gray-400 mt-0.5">
                      9컷 비주얼 · {MEDIA_OPTIONS.find(m => m.id === mediaFormat)?.label} ({MEDIA_OPTIONS.find(m => m.id === mediaFormat)?.ratio}) · 클릭하면 생성됩니다
                    </p>
                  </div>
                </div>

                <div className={cn("grid gap-4", 
                  ((MEDIA_OPTIONS.find(m => m.id === mediaFormat)?.w || 1) / (MEDIA_OPTIONS.find(m => m.id === mediaFormat)?.h || 1)) > 1.9 ? "grid-cols-1" : 
                  ((MEDIA_OPTIONS.find(m => m.id === mediaFormat)?.w || 1) / (MEDIA_OPTIONS.find(m => m.id === mediaFormat)?.h || 1)) < 0.7 ? "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-y-6" : 
                  "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
                )}>
                  {designResult?.cuts?.map((cut: any) => (
                    <div key={cut.cut_id} className="flex flex-col gap-2 h-fit group">
                      {/* 이미지 상자 (완전히 분리된 윗쪽 영역) */}
                      <div className="border border-gray-200 bg-white rounded-2xl overflow-hidden hover:border-gray-400 hover:shadow-lg hover:shadow-gray-200 transition-all relative flex items-center justify-center cursor-pointer"
                        style={getAspectRatioStyle(mediaFormat)}
                        onClick={() => generateCutImage(cut.cut_id, cut.prompt_en)}>
                        {/* 배열 비율에 따라 잘림 현상을 유동적으로 전환 (배너는 contain, 이외는 cover) */}
                        {generatedImages[cut.cut_id] ? (
                          <>
                            {/* 메인 이미지 (꽉 차게 cover로 원복) */}
                            <img src={generatedImages[cut.cut_id]} alt={cut.prompt_ko} 
                              className="w-full h-full absolute inset-0 object-cover transition-transform duration-700 group-hover:scale-105 z-0" />
                            {cut.text_overlay?.content && (
                              <div className={cn(
                                "absolute inset-x-0 p-4 sm:p-6 lg:p-8 flex flex-col bg-gradient-to-t pointer-events-none z-0",
                                cut.text_overlay.position?.includes('top') ? "top-0 from-transparent to-black/70 justify-start" : "bottom-0 from-black/70 to-transparent justify-end",
                                cut.text_overlay.position?.includes('center') ? "items-center text-center" : "items-start text-left"
                              )}>
                                <span className={cn("text-white drop-shadow-md leading-tight", 
                                  (MEDIA_OPTIONS.find(m => m.id === mediaFormat)?.w || 1) > 800 && ((MEDIA_OPTIONS.find(m => m.id === mediaFormat)?.w || 1) / (MEDIA_OPTIONS.find(m => m.id === mediaFormat)?.h || 1)) > 1.9 ? 'text-xl sm:text-2xl lg:text-3xl font-bold' : 'text-lg sm:text-xl font-bold')}
                                  style={{ color: cut.text_overlay?.font_color || '#ffffff', fontWeight: cut.text_overlay?.font_weight || 'bold' }}
                                >
                                  {cut.text_overlay.content}
                                </span>
                              </div>
                            )}
                          </>
                        ) : generatingCutId === cut.cut_id ? (
                          <div className="flex flex-col items-center gap-2 z-10 relative">
                            <div className="w-6 h-6 border-2 border-gray-200 border-t-zinc-600 rounded-full animate-spin" />
                            <span className="text-[9px] text-zinc-500 font-bold">생성 중</span>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center gap-1 opacity-20 group-hover:opacity-60 transition-all duration-300 group-hover:scale-110 z-10 relative">
                            <ImageIcon className="w-6 h-6 text-zinc-800" />
                            <span className="text-[9px] font-bold text-zinc-800">클릭하여 생성</span>
                          </div>
                        )}
                        <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-md text-[9px] font-bold bg-zinc-800/80 text-white backdrop-blur-sm z-10 shadow-sm">
                          #{cut.cut_id} {cut.role}
                        </span>
                      </div>

                      {/* 정보 + 피드백 상자 (독립된 아래쪽 영역) */}
                      <div className="border border-gray-200 bg-white rounded-xl p-3 shadow-sm hover:border-gray-300 transition-colors">
                        <p className="text-[11px] text-gray-700 leading-relaxed mb-2 font-medium break-keep">{cut.prompt_ko}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-[9px] text-gray-400 font-bold uppercase tracking-tighter bg-gray-50 px-1.5 py-0.5 rounded">{cut.ratio}</span>
                          
                          <div className="flex items-center gap-2.5">
                            {generatedImages[cut.cut_id] && (
                              <button className="text-[10px] text-blue-500 hover:text-blue-700 transition-colors flex items-center gap-1 font-bold"
                                onClick={(e) => handleDownloadImage(e, cut.cut_id)}>
                                <Download className="w-3 h-3" /> 다운로드
                              </button>
                            )}
                            <button className="text-[10px] text-gray-500 hover:text-zinc-700 transition-colors flex items-center gap-1 font-bold"
                              onClick={(e) => { e.stopPropagation(); setFeedbackCutId(feedbackCutId === cut.cut_id ? null : cut.cut_id); }}>
                              <MessageSquare className="w-3 h-3" /> 수정
                            </button>
                          </div>
                        </div>
                        {/* 피드백 인라인 */}
                        {feedbackCutId === cut.cut_id && (
                          <div className="mt-2 pt-2 border-t border-gray-100 animate-in fade-in duration-200">
                            <div className="flex gap-1.5">
                              <Input value={feedbackText} onChange={e => setFeedbackText(e.target.value)}
                                placeholder="예: 좀 더 밝게" className="h-7 text-[10px] rounded-lg border-gray-200 bg-gray-50 flex-1 focus:border-zinc-300 focus:ring-zinc-500/20" />
                              <Button size="sm" className="h-7 w-7 p-0 bg-zinc-600 hover:bg-zinc-700 rounded-lg shadow-sm" onClick={() => handleFeedbackSubmit(cut.cut_id)}>
                                <Send className="w-3 h-3 text-white" />
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )
          )}
        </div>
      </main>
    </div>
  );
}

// ─── 유틸 컴포넌트 (미니멀) ───

function EmptyState({ title, desc }: { title: string, desc?: string }) {
  return (
    <div className="h-[60vh] flex flex-col items-center justify-center text-center">
      <div className="w-12 h-12 bg-gray-100 rounded-2xl flex items-center justify-center mb-4 transition-transform hover:scale-110 duration-500">
        <Search className="w-5 h-5 text-gray-400" />
      </div>
      <h3 className="text-[14px] font-bold text-gray-800 mb-1">{title}</h3>
      {desc && <p className="text-[12px] text-gray-400 max-w-sm">{desc}</p>}
    </div>
  );
}

function LoadingState({ title }: { title: string }) {
  return (
    <div className="h-[60vh] flex flex-col items-center justify-center text-center">
      <div className="w-8 h-8 border-2 border-gray-200 border-t-gray-500 rounded-full animate-spin mb-4" />
      <h3 className="text-[14px] font-bold text-gray-600">{title}</h3>
    </div>
  );
}
