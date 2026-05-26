export interface CrawlPayConfig {
    wallet: string;
    price?: string;
    network?: string;
    vault?: string;
    paths?: {
        [pattern: string]: string;
    };
}
export declare function crawlpay(config: CrawlPayConfig): (request: Request) => Response | null;
