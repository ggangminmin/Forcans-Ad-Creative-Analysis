import { NextResponse } from 'next/server';

export const maxDuration = 60;

const IMAGE_MODELS = [
  'gemini-2.5-flash-image',           // 나노바나나 (Nano Banana)
  'gemini-3.1-flash-image-preview',    // 나노바나나 2
  'gemini-2.0-flash-exp',             // Legacy experimental
];

export async function POST(req: Request) {
  try {
    const { prompt, aspectHint } = await req.json();
    const apiKey = process.env.VITE_GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json({ error: 'GEMINI API key not configured' }, { status: 500 });
    }

    let aspectRatio = "1:1";
    if (aspectHint) {
      const match = aspectHint.match(/strictly (\d+):(\d+) aspect ratio/);
      if (match) {
        const w = parseInt(match[1], 10);
        const h = parseInt(match[2], 10);
        const r = w / h;
        if (r <= 0.65) aspectRatio = "9:16"; // C3 세로형(0.54) 등 초장축
        else if (r <= 0.85) aspectRatio = "3:4";
        else if (r >= 1.7) aspectRatio = "16:9";
        else if (r >= 1.25) aspectRatio = "4:3";
        else aspectRatio = "1:1";
      }
    }

    const aspectInstruction = aspectHint 
      ? `\n\nIMPORTANT: Compose and frame this image for ${aspectHint}. The composition must fit this exact aspect ratio.`
      : '';

    // 각 모델을 순차적으로 시도
    for (const model of IMAGE_MODELS) {
      try {
        console.log(`[Image Gen] Trying model: ${model}, target_ratio: ${aspectRatio}`);
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

        // Gemini 2.x Experimental Flash Image
        const body: any = {
          contents: [
            {
              parts: [
                {
                  text: `Generate a high-quality advertising campaign image based on this description. Do NOT include any text or letters in the image. Focus purely on the visual scene, composition, lighting, and mood:\n\nREQUIRED ASPECT RATIO: The image MUST be generated in EXACTLY ${aspectRatio} aspect ratio format (or exactly ${aspectHint}). This is a strictly enforced layout requirement.\n\n${prompt}`
                }
              ]
            }
          ],
          generationConfig: {
            responseModalities: ["TEXT", "IMAGE"],
            temperature: 1.0,
          }
        };

        const response = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body)
        });

        if (!response.ok) {
          const errText = await response.text();
          console.error(`[Image Gen] ${model} failed (${response.status}):`, errText.substring(0, 200));
          continue; // 다음 모델 시도
        }

        const data = await response.json();
        const image = extractImageFromResponse(data);

        if (image) {
          console.log(`[Image Gen] ✅ Success with model: ${model}`);
          return NextResponse.json({ image, model });
        } else {
          console.log(`[Image Gen] ${model} returned no image data, trying next...`);
          continue;
        }
      } catch (modelErr: any) {
        console.error(`[Image Gen] ${model} exception:`, modelErr.message);
        continue;
      }
    }

    // 모든 모델 실패
    return NextResponse.json({ 
      error: 'All image generation models failed. Check API key permissions.',
      tried: IMAGE_MODELS
    }, { status: 500 });

  } catch (err: any) {
    console.error('[Image Gen] Fatal error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

function extractImageFromResponse(data: any): string | null {
  try {
    const candidates = data.candidates || [];
    for (const candidate of candidates) {
      const parts = candidate.content?.parts || [];
      for (const part of parts) {
        if (part.inlineData) {
          const { mimeType, data: base64Data } = part.inlineData;
          return `data:${mimeType};base64,${base64Data}`;
        }
      }
    }
    return null;
  } catch {
    return null;
  }
}
