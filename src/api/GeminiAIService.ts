import { GoogleGenAI } from '@google/genai';
import { GEMINI_API_KEY } from '@env';

const GEMINI_MODEL = 'gemini-2.5-flash-lite';

let _client: GoogleGenAI | null = null;

const getClient = (): GoogleGenAI => {
  const key = GEMINI_API_KEY ?? '';
  if (!key || key.trim().length === 0) {
    throw new Error('Missing GEMINI_API_KEY. Add it to your .env file.');
  }
  if (!_client) {
    _client = new GoogleGenAI({ apiKey: key });
  }
  return _client;
};

export type ChatMessage = {
  role: 'user' | 'model';
  content: string;
};

const buildChatPrompt = (
  userMessage: string,
  articleContext: { title: string; summary: string[] },
  history: ChatMessage[]
): string => {
  const summary = articleContext.summary
    .slice(0, 2)
    .map(s => s.slice(0, 60))
    .join(' ');

  const historyText = history
    .slice(-4)
    .map(m => `${m.role === 'user' ? 'U' : 'A'}: ${m.content}`)
    .join('\n');

  return `Layman AI: casual news assistant. 2-sentence max replies. No jargon.
Article: "${articleContext.title.slice(0, 80)}"
Context: ${summary}
${historyText ? `Chat:\n${historyText}\n` : ''}U: ${userMessage}
A:`;
};

const buildSuggestionsPrompt = (title: string, summary: string[]): string => {
  const context = summary.slice(0, 1).map(s => s.slice(0, 80)).join(' ');
  return `Article: "${title.slice(0, 80)}"
Summary: ${context}
Write 3 short reader questions (under 8 words each).
Return ONLY a JSON array of 3 strings. No markdown.
Example: ["Who funded this?","What happens next?","Who's affected?"]`;
};

export const sendMessage = async (
  userMessage: string,
  articleContext: { title: string; summary: string[] },
  history: ChatMessage[] = []
): Promise<string> => {
  try {
    const ai = getClient();

    const response = await ai.models.generateContent({
      model: GEMINI_MODEL,
      contents: buildChatPrompt(userMessage, articleContext, history),
      config: {
        maxOutputTokens: 80,
        temperature: 0.7,
      },
    });

    return response.text?.trim() || "I'm not sure about that one!";
  } catch (error: any) {
    if (error?.status === 429) {
      throw new Error('Rate limit hit. Wait a moment and try again.');
    }
    console.error('[GeminiAI] sendMessage failed:', error.message);
    throw error;
  }
};

export const generateSuggestions = async (
  title: string,
  summary: string[]
): Promise<string[]> => {
  try {
    const ai = getClient();

    const response = await ai.models.generateContent({
      model: GEMINI_MODEL,
      contents: buildSuggestionsPrompt(title, summary),
      config: {
        maxOutputTokens: 80,
        temperature: 0.5,
      },
    });

    const raw = response.text ?? '';
    const cleaned = raw.replace(/```json|```/g, '').trim();
    const parsed = JSON.parse(cleaned);

    if (
      Array.isArray(parsed) &&
      parsed.length === 3 &&
      parsed.every(item => typeof item === 'string')
    ) {
      return parsed;
    }
  } catch (error) {
    console.error('[GeminiAI] generateSuggestions failed:', error);
  }

  return fallbackSuggestions();
};

export const fallbackSuggestions = (): string[] => [
  "What's the biggest impact here?",
  'Who does this affect most?',
  'What should I know going forward?',
];