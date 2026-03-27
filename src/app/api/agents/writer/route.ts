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
          content: `카테고리: ${category || '미지정'}\n광고 톤: ${tone || '기본'}\n\n위의 <카테고리>와 <광고 톤>, 그리고 아래 제공된 <트렌드 분석 데이터>를 바탕으로 영화적 서사를 가진 광고 카피를 최소 10안 이상(10~12개) 다양하게 작성하라.\n\n중요 1: 모든 제안(10개 이상)은 반드시 제공된 <카테고리> 내용과 직접적으로 관련된 소재여야 합니다. (예: 자동차면 엔진, 주행, 배터리 등 자동차 관련 카피)\n중요 2: "tone" 필드의 값은 반드시 제공된 <광고 톤> 문자열('${tone}')과 정확히 일치해야 합니다. (예: '감성적'이 아닌 '${tone}' 그대로 사용)\n\n반드시 아래의 JSON 형식으로만 응답하라:\n\`\`\`json\n{\n  "category": "...",\n  "insight_applied": "...",\n  "copies": [\n    {\n      "id": 1,\n      "tone": "...",\n      "headline": "...",\n      "subheadline": "...",\n      "body": "...",\n      "cta": "...",\n      "visual_direction": "...",\n      "color_mood": [],\n      "keywords_used": []\n    }\n    // ... 총 10개 이상 작성 ...\n  ]\n}\n\`\`\`\n\n<트렌드 분석 데이터>\n${JSON.stringify(scoutData)}` 
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
