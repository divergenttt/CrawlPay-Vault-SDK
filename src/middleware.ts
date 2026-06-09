import { getBotName, isAIBot } from "./detector";

export interface CrawlPayConfig {
  wallet: string;
  price?: string;
  network?: "base" | "polygon";
  vault?: string;
  paths?: {
    [pattern: string]: string;
  };
}

const DEFAULT_PRICE = "0.001";
const DEFAULT_NETWORK = "base";
const NETWORK_CHAIN_IDS: Record<NonNullable<CrawlPayConfig["network"]>, number> = {
  base: 8453,
  polygon: 137,
};

function hasPaymentSignature(request: Request): boolean {
  // Headers.get() matches names case-insensitively (payment-signature / PAYMENT-SIGNATURE)
  return request.headers.get("payment-signature") !== null;
}

function getPriceForPath(pathname: string, config: CrawlPayConfig): string {
  const defaultPrice = config.price ?? DEFAULT_PRICE;
  const pathPricing = config.paths;

  if (!pathPricing) {
    return defaultPrice;
  }

  for (const [pattern, price] of Object.entries(pathPricing)) {
    if (pattern.endsWith("/*")) {
      const prefix = pattern.slice(0, -1);
      if (pathname.startsWith(prefix)) {
        return price;
      }
      continue;
    }

    if (pathname === pattern) {
      return price;
    }
  }

  return defaultPrice;
}

export function crawlpay(config: CrawlPayConfig) {
  const network = config.network ?? DEFAULT_NETWORK;
  const chainId = NETWORK_CHAIN_IDS[network];

  return (request: Request): Response | null => {
    const userAgent = request.headers.get("user-agent") ?? "";

    if (!isAIBot(userAgent)) {
      return null;
    }

    if (hasPaymentSignature(request)) {
      return null;
    }

    const bot = getBotName(userAgent) ?? "Unknown Bot";
    const pathname = new URL(request.url).pathname;
    const price = getPriceForPath(pathname, config);

    const body = {
      error: "payment_required",
      message:
        `This content requires payment via x402 protocol. Pay $${price} USDC to access.`,
      bot,
      wallet: config.wallet,
      price,
      network,
    };

    return new Response(JSON.stringify(body), {
      status: 402,
      headers: {
        "Content-Type": "application/json",
        "X-Payment-Required": `amount=${price};currency=USDC;network=${network};chainId=${chainId}`,
        "X-Payment-Wallet": config.wallet,
        "X-Payment-Network": network,
        "X-Payment-Chain-Id": String(chainId),
        "X-CrawlPay": "1.0",
      },
    });
  };
}
