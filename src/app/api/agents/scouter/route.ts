import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { tavily } from '@tavily/core';
import { getAgentPrompt, parseJSON } from '@/lib/agents';

// OpenAI SDK v6.x uses the Responses API as the primary interface
const openai = new OpenAI({
  apiKey: process.env.VITE_OPENAI_API_KEY
});

const tvly = tavily({
  apiKey: process.env.VITE_TAVILY_API_KEY
});

export async function POST(req: Request) {
  try {
    const { category } = await req.json();
    const systemPrompt = await getAgentPrompt('scouter');

    // 1. Search for real trends using Tavily
    const searchResult = await tvly.search(`${category} 광고 트렌드 2026 SNS 피로 문구`, {
      searchDepth: "advanced",
      maxResults: 5
    });

    const searchContext = searchResult.results.map(r => `Title: ${r.title}\nContent: ${r.content}`).join("\n\n");

    // 2. Analyze with OpenAI using standard Chat Completions API
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: systemPrompt },
        { 
          role: "user", 
          content: `아래 검색 데이터를 참고하여 '${category}' 광고 크리에이티브 분석 결과를 생성해줘.\n\n반드시 아래의 JSON 형식으로만 응답해야 합니다:\n\`\`\`json\n{\n  "timestamp": "ISO8601",\n  "category": "분석 카테고리",\n  "tired_phrases": ["피해할 문구 5개"],\n  "trending_keywords": ["트렌딩 키워드 5개"],\n  "content_trends": [ { "title": "콘텐츠명", "type": "드라마|영화|숏폼", "keywords": [] } ],\n  "insight": "핵심 인사이트 한 줄"\n}\n\`\`\`\n\n<검색 데이터>\n${searchContext}` 
        }
      ]
    });

    // Extract content
    const raw = response.choices?.[0]?.message?.content || "{}";
    const result = parseJSON(raw);
    
    return NextResponse.json(result);
  } catch (err: any) {
    console.error("Scouter Agent Error (Responses API):", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
