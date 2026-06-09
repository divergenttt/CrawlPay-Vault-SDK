# CrawlPay SDK

Charge AI bots $0.001 USDC per page. Two lines of code.

GPTBot, ClaudeBot, PerplexityBot crawl your site constantly. They read your content, train models on it, and pay you nothing. CrawlPay fixes that - bots that handle HTTP correctly pay via x402, the rest pass through untouched.

## Install

```bash
npm install @crawlpay/sdk
```

## Quick start

### Next.js

```ts
import { crawlpay } from "@crawlpay/sdk"
import { NextResponse } from "next/server"

const paywall = crawlpay({ wallet: "0xYourWallet" })

export function middleware(request) {
  return paywall(request) ?? NextResponse.next()
}
```

### Express

```ts
import { crawlpayExpress } from "@crawlpay/sdk/express"
import express from "express"

const app = express()
app.use(crawlpayExpress({ wallet: "0xYourWallet" }))
```

### Cloudflare Workers

```ts
import { crawlpayCloudflare } from "@crawlpay/sdk/cloudflare"

const paywall = crawlpayCloudflare({ wallet: "0xYourWallet" })

export default {
  async fetch(request, env, ctx) {
    return paywall.fetch(request) ?? new Response("Hello")
  }
}
```

### Vault Mode (Story CDR)

Private encrypted datasets - content that doesn't exist in plaintext anywhere. Bots pay, Story Protocol decrypts.

```ts
crawlpay({
  wallet: "0xYourWallet",
  vault: process.env.CDR_VAULT_UUID
})
```

## Configuration

| Option   | Required | Default        | Description                    |
| -------- | -------- | -------------- | ------------------------------ |
| `wallet` | Yes      | -              | Your Arc wallet address        |
| `price`  | No       | `"0.001"`      | Default price in USDC          |
| `paths`  | No       | -              | Per-path prices via patterns   |
| `network`| No       | `"base"`       | Payment network (`base` or `polygon`) |
| `vault`  | No       | -              | Story CDR vault UUID           |

### Per-path pricing

```ts
crawlpay({
  wallet: "0xYourWallet",
  price: "0.001", // default for all pages
  paths: {
    "/premium/*": "0.01", // 10x for premium content
    "/api/*": "0.005", // 5x for API endpoints
    "/vault/*": "0.001", // CDR vault pages
  },
})
```

## Supported AI bots

| Bot               | Provider    |
| ----------------- | ----------- |
| GPTBot            | OpenAI      |
| ChatGPT-User      | OpenAI      |
| ClaudeBot         | Anthropic   |
| anthropic-ai      | Anthropic   |
| GoogleOther       | Google      |
| Google-Extended   | Google      |
| PerplexityBot     | Perplexity  |
| CCBot             | Common Crawl|
| Bytespider        | ByteDance   |
| FacebookBot       | Meta        |
| Applebot-Extended | Apple       |

## Links

- **Demo:** [crawl-pay.com](https://crawl-pay.com)
- **Dashboard:** [crawl-pay.com/dashboard](https://crawl-pay.com/dashboard)
- **GitHub:** [divergenttt/CrawlPay-Vault-SDK](https://github.com/divergenttt/CrawlPay-Vault-SDK)
- **App:** [divergenttt/CrawlPay-Vault](https://github.com/divergenttt/CrawlPay-Vault)
- **License:** MIT
