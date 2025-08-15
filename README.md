# viberand

`viberand` is a tiny TypeScript library that uses OpenAI's GPT‑5 nano model to generate a random integer between two inclusive bounds.

## Installation

```bash
npm install viberand
```

## Usage

```ts
import { initVibeRand } from 'viberand';

const vibeRand = initVibeRand('YOUR_OPENAI_API_KEY');
const value = vibeRand(1, 10);
console.log(value);
```

The API key can also be supplied via the `OPENAI_API_KEY` environment variable:

```ts
process.env.OPENAI_API_KEY = 'YOUR_KEY';
const vibeRand = initVibeRand();
const value = vibeRand(1, 10);
```

`vibeRand` performs a synchronous network request and will block execution until a response is received.

## How it works

The library asks the OpenAI API with the following prompt:

> Return a single integer chosen uniformly at random from the inclusive range `<min>` to `<max>`. IMPORTANT: Output only the number.

It attempts up to three times if the response is malformed. If the API returns a number outside the provided range, it retries once more before failing.

## Testing

```bash
npm test
```

## License

MIT
