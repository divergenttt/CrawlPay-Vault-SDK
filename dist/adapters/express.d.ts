import type { Request as ExpressRequest, Response, NextFunction } from "express";
import { type CrawlPayConfig } from "../middleware";
export declare function crawlpayExpress(config: CrawlPayConfig): (req: ExpressRequest, res: Response, next: NextFunction) => Promise<void>;
