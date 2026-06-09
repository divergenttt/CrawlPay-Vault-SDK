"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.crawlpayCloudflare = crawlpayCloudflare;
exports.crawlpayCheck = crawlpayCheck;
const middleware_1 = require("../middleware");
function crawlpayCloudflare(config) {
    const handler = (0, middleware_1.crawlpay)(config);
    return {
        async fetch(request) {
            const result = handler(request);
            if (result)
                return result;
            return fetch(request);
        },
    };
}
function crawlpayCheck(config) {
    return (0, middleware_1.crawlpay)(config);
}
