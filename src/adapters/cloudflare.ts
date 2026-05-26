import { crawlpay, type CrawlPayConfig } from "../middleware";

export function crawlpayCloudflare(config: CrawlPayConfig) {
  const handler = crawlpay(config);

  return {
    async fetch(request: Request): Promise<Response | undefined> {
      const result = handler(request);
      if (!result) return undefined;
      return result;
    },
  };
}
