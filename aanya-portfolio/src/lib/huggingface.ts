import { ORACLE_SYSTEM_PROMPT } from '@/data/oracle-prompt';

const HF_API_URL = 'https://router.huggingface.co/novita/v3/openai/chat/completions';
const HF_MODEL = 'deepseek/deepseek-r1-0528';

// Alternative free models to try if one fails:
// 'mistralai/Mistral-7B-Instruct-v0.3'
// 'HuggingFaceH4/zephyr-7b-beta'
// 'meta-llama/Meta-Llama-3-8B-Instruct'

interface OracleResponse {
  content: string;
  error?: string;
}

export async function queryOracle(
  userMessage: string,
  apiKey: string
): Promise<OracleResponse> {
  if (!apiKey || apiKey.trim() === '') {
    return {
      content: '',
      error: 'Please enter your HuggingFace API token to use The Oracle. You can get a free one at huggingface.co/settings/tokens',
    };
  }

  try {
    const response = await fetch(HF_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: HF_MODEL,
        messages: [
          { role: 'system', content: ORACLE_SYSTEM_PROMPT },
          { role: 'user', content: userMessage },
        ],
        max_tokens: 1024,
        temperature: 0.7,
        top_p: 0.9,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMsg = (errorData as any)?.error || response.statusText;

      if (response.status === 401) {
        return { content: '', error: 'Invalid API token. Please check your HuggingFace token.' };
      }
      if (response.status === 429) {
        return { content: '', error: 'Rate limited — the stars need a moment. Try again in a few seconds.' };
      }
      if (response.status === 503) {
        return { content: '', error: 'Model is loading — give it 20-30 seconds and try again. Free tier models sometimes need a warm-up.' };
      }

      return { content: '', error: `API error: ${errorMsg}` };
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || '';

    if (!content) {
      return { content: '', error: 'The Oracle received an empty response. Try again.' };
    }

    return { content };
  } catch (err) {
    console.error('Oracle query failed:', err);
    return {
      content: '',
      error: 'Connection failed — check your internet and try again.',
    };
  }
}
