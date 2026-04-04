import {GROKAI_API_URL} from '@env';;

const XAI_API_URL = 'https://api.x.ai/v1/chat/completions';
const GROK_MODEL = 'grok-3-mini-beta';

const API_KEY = GROKAI_API_URL ?? '';

export type GrokMessage = {
  role: 'system' | 'user' | 'assistant';
  content: string;
};

const validateApiKey = () => {
  if (!API_KEY || API_KEY.trim().length === 0) {
    throw new Error('Missing GROK API key. Check your .env file.');
  }
};

export const sendGrokMessage = async (
  userMessage: string,
  articleContext: { title: string; summary: string[] },
  history: GrokMessage[] = []
): Promise<string> => {
  try {
    validateApiKey();

    const systemPrompt = `You are Layman — a friendly, casual AI assistant inside a news app.
You help people understand a specific article they're reading right now.

Article the user is reading:
Title: "${articleContext.title}"
Summary:
${articleContext.summary.map((s, i) => `Part ${i + 1}: ${s}`).join('\n')}

Your rules:
- Max 2 sentences per reply. Never go longer.
- Write like you're texting a smart friend — casual, clear, zero jargon.
- If asked something unrelated to the article, say: "That's outside this article — want to know more about [topic from article]?"
- Never say "According to the article" or "The article states". Just answer naturally.
- Don't bullet point. Plain prose only.`;

    const messages: GrokMessage[] = [
      { role: 'system', content: systemPrompt },
      ...history.slice(-6),
      { role: 'user', content: userMessage },
    ];

    const response = await fetch(XAI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        model: GROK_MODEL,
        messages,
        max_tokens: 120,
        temperature: 0.7,
      }),
    });

    const rawText = await response.text();

    if (!response.ok) {
      let err: any = {};
      try {
        err = JSON.parse(rawText);
      } catch {}

      console.error('Grok API Error:', {
        status: response.status,
        response: rawText,
      });

      throw new Error(
        err?.error?.message ??
          `Grok API error ${response.status}: ${response.statusText}`
      );
    }

    const data = JSON.parse(rawText);

    return (
      data?.choices?.[0]?.message?.content?.trim() ??
      "I'm not sure about that one!"
    );
  } catch (error) {
    console.error('sendGrokMessage failed:', error);
    throw error;
  }
};

export const generateGrokSuggestions = async (
  title: string,
  summary: string[]
): Promise<string[]> => {
  try {
    validateApiKey();

    const prompt = `Given this news article, write exactly 3 short questions a curious reader might ask.

Article: "${title}"
Summary: ${summary.join(' ')}

Rules:
- Under 10 words each
- Casual, conversational tone
- Cover 3 different angles
- Return ONLY a raw JSON array of 3 strings. No markdown. No explanation.
Example output: ["Who funded this?","How does this affect regular people?","What happens next?"]`;

    const response = await fetch(XAI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        model: GROK_MODEL,
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 120,
        temperature: 0.5,
      }),
    });

    const rawText = await response.text();

    if (!response.ok) {
      console.error('Suggestion API failed:', {
        status: response.status,
        response: rawText,
      });
      return fallbackSuggestions(title);
    }

    const data = JSON.parse(rawText);
    const raw = data?.choices?.[0]?.message?.content?.trim() ?? '[]';

    try {
      const cleaned = raw.replace(/```json|```/g, '').trim();
      const parsed = JSON.parse(cleaned);

      if (
        Array.isArray(parsed) &&
        parsed.length === 3 &&
        parsed.every((item) => typeof item === 'string')
      ) {
        return parsed;
      }
    } catch (error) {
      console.error('Suggestion parse error:', error, raw);
    }

    return fallbackSuggestions(title);
  } catch (error) {
    console.error('generateGrokSuggestions failed:', error);
    return fallbackSuggestions(title);
  }
};

const fallbackSuggestions = (_title: string): string[] => [
  "What's the biggest impact here?",
  'Who does this affect most?',
  'What should I know going forward?',
];