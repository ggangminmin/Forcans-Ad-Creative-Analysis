export const MOCK_SCOUT_RESULT = {
  category: "뷰티/스킨케어",
  insight: "2026년 광고는 '설득'보다 '공감'이 핵심 — 자연스러운 일상 언어가 클릭률을 높인다.",
  tired_phrases: ["지금 바로 구매하세요", "놀라운 효과 보장", "한정 수량 특가", "피부과 추천 1위", "실시간 검색어 1위"],
  trending_keywords: ["비건 루틴", "유리 피부", "감성 스킨케어", "도파민 뷰티", "무드 메이크업", "슬로우 뷰티", "텍스처 케어"],
  content_trends: [
    { title: "졌잖아요", type: "드라마", keywords: ["감성", "일상", "자연스러움"] },
    { title: "피부 브이로그", type: "숏폼", keywords: ["루틴", "진정성", "투명함"] }
  ],
};

export const MOCK_WRITER_RESULT = {
  insight_applied: "설득보다 공감 — 일상 언어로 감정을 건드린다",
  copies: [
    { id: 1, tone: "감성", headline: "오늘 하루, 피부에게", subheadline: "바쁜 하루 끝, 조용히 나를 돌보는 시간", body: "퇴근 후 거울 앞에 서면, 그제야 오늘 내 얼굴이 보인다. 슬로우 뷰티 루틴으로 나만의 저녁을 시작해보세요.", cta: "루틴 시작하기", visual_direction: "따뜻한 침실 조명 아래 세럼을 바르는 손 클로즈업" },
    { id: 2, tone: "유머", headline: "피부과? 나는 집에 있어", subheadline: "굳이 예약 안 해도 되는 이유", body: "대기 번호 37번. 결국 점심도 못 먹었다. 근데 사실 비건 루틴 다 끝냈다. 뭔가 이겼다는 느낌?", cta: "홈케어 보러가기", visual_direction: "대기실 캐릭터 vs 홈케어 캐릭터 대비 일러스트" },
    { id: 3, tone: "미스터리", headline: "그 사람 피부, 뭔가 달랐다", subheadline: "물어봤더니 딱 한 가지라고 했다", body: "매일 마주치는 그 동료. 화장을 더 한 건 아닌데... 용기 내서 물어봤더니 대답은 단순했다.", cta: "정답 확인하기", visual_direction: "흐릿한 인물 실루엣 + 헤드라인 텍스트 강조" },
    { id: 4, tone: "감성", headline: "잠들기 전, 3분의 의식", subheadline: "아무것도 하기 싫은 밤에도 이것만은", body: "하루의 끝, 나를 위한 루틴. 세럼 한 방울에 오늘의 스트레스가 녹는다.", cta: "3분 루틴 보기", visual_direction: "야간 침실 조명, 세럼 드롭 매크로 샷" },
    { id: 5, tone: "대담", headline: "좋은 피부는 타고나는 거 아닙니다", subheadline: "유전자 탓은 이제 그만", body: "피부는 습관의 결과물. 과학적으로 설계된 루틴이 당신의 피부를 바꿉니다.", cta: "루틴 설계하기", visual_direction: "Before/After 스플릿 구도, 클린한 스튜디오 배경" },
  ]
};

export const MOCK_DESIGN_RESULT = {
  copy_id: 1, tone: "감성", headline: "오늘 하루, 피부에게",
  cuts: [
    { cut_id: 1, role: "히어로", ratio: "1200x628", prompt_en: "Cinematic close-up of delicate hands applying translucent facial serum on a cheek, warm golden hour lighting through bedroom curtains, soft depth of field bokeh with blurred city nightscape, beauty campaign photography, ultra-realistic skin texture, 16:9 wide composition", prompt_ko: "세럼을 바르는 손 클로즈업" },
    { cut_id: 2, role: "제품 디테일", ratio: "800x800", prompt_en: "Luxurious skincare cream texture macro photography, silky white cream swirl on reflective glass surface, soft pink ambient light, minimalist high-end beauty product advertisement, clean studio background, extreme close-up detail shot", prompt_ko: "제형 클로즈업, 실키한 질감" },
    { cut_id: 3, role: "라이프스타일", ratio: "800x800", prompt_en: "Elegant young Korean woman in a minimalist bright bathroom, looking at round mirror with gentle smile, dewy glass skin glow, morning natural sunlight from side window, authentic beauty lifestyle photography, warm pastel tones", prompt_ko: "거울을 보며 웃는 여성" },
    { cut_id: 4, role: "분위기", ratio: "800x800", prompt_en: "Aesthetic bedside scene with lit soy candle and premium skincare products on marble tray, soft warm bedroom ambiance, cozy evening self-care ritual, muted earth tones, editorial lifestyle photography, shallow depth of field", prompt_ko: "침대 옆 양초와 제품" },
    { cut_id: 5, role: "텍스처", ratio: "800x800", prompt_en: "Crystal clear water gently splashing on a woman's face during cleansing ritual, refreshing dewy droplets on skin, bright clean studio lighting, ultra-slow motion freeze frame aesthetic, purity and freshness concept", prompt_ko: "세안 중인 모습, 상쾌함" },
    { cut_id: 6, role: "오버레이", ratio: "1200x628", prompt_en: "Dreamy abstract soft gradient background, flowing mauve and lavender watercolor cloud shapes, gentle ethereal atmosphere, premium brand overlay backdrop, no text no objects, pure color and light composition, ultra-wide 16:9", prompt_ko: "부드러운 추상 배경" }
  ]
};
