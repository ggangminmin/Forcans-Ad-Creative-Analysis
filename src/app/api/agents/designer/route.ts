import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { getAgentPrompt, parseJSON } from '@/lib/agents';

// OpenAI SDK v6.x uses the Responses API as the primary interface
const openai = new OpenAI({
  apiKey: process.env.VITE_OPENAI_API_KEY
});

export async function POST(req: Request) {
  try {
    const { writerResult, selectedCopyId } = await req.json();
    const systemPrompt = await getAgentPrompt('designer');

    const copy = writerResult.copies.find((c: any) => c.id === selectedCopyId);

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: systemPrompt },
        { 
          role: "user", 
          content: `아래 광고 카피를 실제 배너 광고 레이아웃(헤드라인, 본문, CTA, 로고)이 포함된 4컷 이미지 시안 프롬프트로 변환하라.\n\n반드시 아래의 JSON 형식으로만 응답하라:\n\`\`\`json\n{\n  "total_cuts": 4,\n  "cuts": [\n    {\n      "cut_id": 1,\n      "role": "hero",\n      "ratio": "1200x628",\n      "prompt_en": "...",\n      "prompt_ko": "...",\n      "headline": "<배너용 메인 헤드라인>",\n      "subheadline": "<배너용 서브 카피>",\n      "cta_text": "<CTA 버튼 문구>",\n      "show_logo": true,\n      "logo_position": "top-left",\n      "text_overlay": {\n        "position": "center | bottom-left | top-right",\n        "font_color": "#ffffff",\n        "bg_shadow": "soft"\n      },\n      "layout_note": "..."\n    }\n  ]\n}\n\`\`\`\n\n<광고 카피>\n${JSON.stringify(copy)}` 
        }
      ]
    });

    const raw = response.choices?.[0]?.message?.content || "{}";
    const result = parseJSON(raw);
    
    return NextResponse.json(result);
  } catch (err: any) {
    console.error("Designer Agent Error (Responses API):", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
