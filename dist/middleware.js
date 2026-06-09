"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.crawlpay = crawlpay;
const detector_1 = require("./detector");
const DEFAULT_PRICE = "0.001";
const DEFAULT_NETWORK = "base";
const NETWORK_CHAIN_IDS = {
    base: 8453,
    polygon: 137,
};
const BOTH_NETWORKS = "base,polygon";
const BOTH_CHAIN_IDS = "8453,137";
function hasPaymentSignature(request) {
    // Headers.get() matches names case-insensitively (payment-signature / PAYMENT-SIGNATURE)
    return request.headers.get("payment-signature") !== null;
}
function getPriceForPath(pathname, config) {
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
function crawlpay(config) {
    const network = config.network ?? DEFAULT_NETWORK;
    const paymentNetwork = network === "both" ? BOTH_NETWORKS : network;
    const paymentChainId = network === "both" ? BOTH_CHAIN_IDS : String(NETWORK_CHAIN_IDS[network]);
    return (request) => {
        const userAgent = request.headers.get("user-agent") ?? "";
        if (!(0, detector_1.isAIBot)(userAgent)) {
            return null;
        }
        if (hasPaymentSignature(request)) {
            return null;
        }
        const bot = (0, detector_1.getBotName)(userAgent) ?? "Unknown Bot";
        const pathname = new URL(request.url).pathname;
        const price = getPriceForPath(pathname, config);
        const body = {
            error: "payment_required",
            message: `This content requires payment via x402 protocol. Pay $${price} USDC to access.`,
            bot,
            wallet: config.wallet,
            price,
            network,
        };
        return new Response(JSON.stringify(body), {
            status: 402,
            headers: {
                "Content-Type": "application/json",
                "X-Payment-Required": `amount=${price};currency=USDC;network=${paymentNetwork};chainId=${paymentChainId}`,
                "X-Payment-Wallet": config.wallet,
                "X-Payment-Network": paymentNetwork,
                "X-Payment-Chain-Id": paymentChainId,
                "X-CrawlPay": "1.0",
            },
        });
    };
}
