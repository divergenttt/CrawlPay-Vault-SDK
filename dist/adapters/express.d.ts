import type { Request, Response, NextFunction } from "express";
import { type CrawlPayConfig } from "../middleware";
export declare function crawlpayExpress(config: CrawlPayConfig): (req: Request, res: Response, next: NextFunction) => Promise<void>;
