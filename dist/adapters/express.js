"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.crawlpayExpress = crawlpayExpress;
const middleware_1 = require("../middleware");
function crawlpayExpress(config) {
    const handler = (0, middleware_1.crawlpay)(config);
    return async (req, res, next) => {
        const protocol = req.protocol || "http";
        const host = req.get("host") || "localhost";
        const url = `${protocol}://${host}${req.originalUrl}`;
        const headers = new Headers();
        Object.entries(req.headers).forEach(([key, value]) => {
            if (value)
                headers.set(key, Array.isArray(value) ? value[0] : value);
        });
        const webRequest = new Request(url, {
            method: req.method,
            headers,
        });
        const result = handler(webRequest);
        if (!result)
            return next();
        res.status(result.status);
        result.headers.forEach((value, key) => res.setHeader(key, value));
        const body = await result.json();
        res.json(body);
    };
}
