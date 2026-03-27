import fs from 'fs';
import path from 'path';

export async function getAgentPrompt(agentName: string): Promise<string> {
  try {
    const filePath = path.join(process.cwd(), '.agents', `${agentName}.md`);
    const content = fs.readFileSync(filePath, 'utf-8');
    
    // Extract the prompt section (between ``` and ``` if exists, or everything after '프롬프트:')
    const promptMatch = content.match(/시스템 프롬프트\n\n```([\s\S]*?)```/i) || 
                      content.match(/프롬프트:\n([\s\S]*)/i) || 
                      content.match(/프롬프트:([\s\S]*)/i);
    
    if (promptMatch) {
      return promptMatch[1].trim();
    }
    
    return content; // Fallback to full content
  } catch (err) {
    console.error(`Error reading prompt for ${agentName}:`, err);
    return "";
  }
}

export function parseJSON(text: string) {
  try {
    // LLMs often wrap JSON in markdown code blocks
    const jsonMatch = text.match(/```json\n([\s\S]*?)\n```/) || text.match(/```([\s\S]*?)```/) || [null, text];
    const raw = jsonMatch[1].trim();
    return JSON.parse(raw);
  } catch (err: any) {
    console.error("Failed to parse JSON. Raw text snippet:", text.substring(0, 200));
    throw new Error(`JSON 파싱 실패: ${err.message}. (Raw: ${text.substring(0, 50)}...)`);
  }
}
