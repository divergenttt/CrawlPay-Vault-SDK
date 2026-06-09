import { crawlpay, type CrawlPayConfig } from "../middleware";

export function crawlpayCloudflare(config: CrawlPayConfig) {
  const handler = crawlpay(config);

  return {
    async fetch(request: Request): Promise<Response> {
      const result = handler(request);
      if (result) return result;
      return fetch(request);
    },
  };
}

export function crawlpayCheck(config: CrawlPayConfig) {
  return crawlpay(config);
}
