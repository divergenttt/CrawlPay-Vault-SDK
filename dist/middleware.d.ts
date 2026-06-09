export interface CrawlPayConfig {
    wallet: string;
    price?: string;
    network?: "base" | "polygon" | "both";
    vault?: string;
    paths?: {
        [pattern: string]: string;
    };
}
export declare function crawlpay(config: CrawlPayConfig): (request: Request) => Response | null;
