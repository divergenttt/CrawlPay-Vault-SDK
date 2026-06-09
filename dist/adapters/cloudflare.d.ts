import { type CrawlPayConfig } from "../middleware";
export declare function crawlpayCloudflare(config: CrawlPayConfig): {
    fetch(request: Request): Promise<Response>;
};
export declare function crawlpayCheck(config: CrawlPayConfig): (request: Request) => Response | null;
