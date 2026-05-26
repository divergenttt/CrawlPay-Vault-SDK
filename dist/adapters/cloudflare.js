"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.crawlpayCloudflare = crawlpayCloudflare;
const middleware_1 = require("../middleware");
function crawlpayCloudflare(config) {
    const handler = (0, middleware_1.crawlpay)(config);
    return {
        async fetch(request) {
            const result = handler(request);
            if (!result)
                return undefined;
            return result;
        },
    };
}
