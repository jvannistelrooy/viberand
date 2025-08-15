import request from 'sync-request';

/**
 * Initialize the vibeRand function with the provided OpenAI API key.
 * The returned function synchronously generates a random integer within
 * the given inclusive range by querying the OpenAI API.
 */
export function initVibeRand(apiKey?: string) {
  const key = apiKey || process.env.OPENAI_API_KEY;
  if (!key) {
    throw new Error('OpenAI API key is required');
  }

  return function vibeRand(min: number, max: number): number {
    if (!Number.isInteger(min) || !Number.isInteger(max)) {
      throw new Error('min and max must be integers');
    }
    if (min > max) {
      throw new Error('min must be less than or equal to max');
    }

    const prompt = `Return a single integer chosen uniformly at random from the inclusive range ${min} to ${max}. IMPORTANT: Output only the number.`;

    let outOfRangeCount = 0;

    for (let attempt = 1; attempt <= 3; attempt++) {
      const res = request('POST', 'https://api.openai.com/v1/responses', {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${key}`
        },
        json: {
          model: 'gpt-5-nano',
          input: prompt
        }
      });

      const data = JSON.parse(res.getBody('utf8'));
      const text = data?.output?.[0]?.content?.[0]?.text ?? data?.choices?.[0]?.message?.content ?? '';
      const trimmed = String(text).trim();

      if (!/^[-+]?\d+$/.test(trimmed)) {
        if (attempt === 3) {
          throw new Error('OpenAI API did not return an integer');
        }
        continue;
      }

      const value = parseInt(trimmed, 10);
      if (value < min || value > max) {
        outOfRangeCount++;
        if (outOfRangeCount >= 2 || attempt === 3) {
          throw new Error('OpenAI API returned integer out of range');
        }
        continue;
      }

      return value;
    }

    throw new Error('Failed to generate integer');
  };
}

export default initVibeRand;

