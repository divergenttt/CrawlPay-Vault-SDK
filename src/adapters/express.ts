import type { Request, Response, NextFunction } from "express";
import { crawlpay, type CrawlPayConfig } from "../middleware";

export function crawlpayExpress(config: CrawlPayConfig) {
  const handler = crawlpay(config);

  return async (req: Request, res: Response, next: NextFunction) => {
    const protocol = req.protocol || "http";
    const host = req.get("host") || "localhost";
    const url = `${protocol}://${host}${req.originalUrl}`;
    const headers = new Headers();
    Object.entries(req.headers).forEach(([key, value]) => {
      if (value) headers.set(key, Array.isArray(value) ? value[0] : value);
    });
    const webRequest = new Request(url, {
      method: req.method,
      headers,
    });

    const result = handler(webRequest);
    if (!result) return next();

    res.status(result.status);
    result.headers.forEach((value, key) => res.setHeader(key, value));
    const body = await result.json();
    res.json(body);
  };
}
