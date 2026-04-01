import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { getAgentPrompt, parseJSON } from '@/lib/agents';

// Unifying all agents to use OpenAI current flagship models for stability
const openai = new OpenAI({
  apiKey: process.env.VITE_OPENAI_API_KEY
});

export async function POST(req: Request) {
  try {
    const { scoutData, category, tone } = await req.json();
    const systemPrompt = await getAgentPrompt('writer');

    // Using standard OpenAI Chat Completions API with gpt-4o
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: systemPrompt },
        { 
          role: "user", 
          content: `카테고리: ${category || '미지정'}\n광고 톤: ${tone || '기본'}\n\n위의 정보와 아래 제공된 <트렌드 분석 데이터>를 바탕으로 배너 광고에 최적화된 카피 4안을 작성하라.\n\n### 필독 요구사항:\n1. **4가지 페르소나 준수**: [공감/일상형], [도발/호기심형], [정보/혜택형], [비전/브랜드형]으로 안을 구성할 것.\n2. **글자 수 제약**: 헤드라인은 최대 15자 이내로 짧고 강렬하게 작성할 것.\n3. **안티-클리셰**: 데이터의 'tired_phrases'는 절대 사용하지 말고 신선한 Hook을 만들 것.\n\n반드시 아래의 JSON 형식으로만 응답하라:\n\`\`\`json\n{\n  "category": "...",\n  "insight_applied": "...",\n  "copies": [\n    {\n      "id": 1,\n      "tone": "공감/일상형",\n      "headline": "...",\n      "subheadline": "...",\n      "body": "...",\n      "cta": "...",\n      "visual_direction": "...",\n      "color_mood": [],\n      "keywords_used": []\n    }\n    // [도발/호기심형], [정보/혜택형], [비전/브랜드형] 순서로 총 4개 작성\n  ]\n}\n\`\`\`\n\n<트렌드 분석 데이터>\n${JSON.stringify(scoutData)}` 
        }
      ]
    });

    const raw = response.choices?.[0]?.message?.content || "{}";
    const parsed = parseJSON(raw);
    
    return NextResponse.json(parsed);
  } catch (err: any) {
    console.error("Writer Agent Error (GPT-5.4):", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
