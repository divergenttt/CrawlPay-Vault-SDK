import { describe, it, expect } from "vitest";
import { crawlpay } from "./middleware";

const handler = crawlpay({ wallet: "0xSeller", price: "0.001" });

function req(
  ua: string,
  opts: { signature?: boolean; url?: string } = {},
) {
  const headers = new Headers({ "user-agent": ua });
  if (opts.signature) headers.set("payment-signature", "0xabc");
  return new Request(opts.url ?? "https://example.com/blog/post", { headers });
}

describe("crawlpay middleware", () => {
  it("returns 402 for an AI bot without payment", () => {
    const res = handler(req("GPTBot/1.0"));
    expect(res?.status).toBe(402);
  });

  it("returns null for a human", () => {
    expect(handler(req("Mozilla/5.0"))).toBeNull();
  });

  it("returns null when payment-signature present", () => {
    expect(handler(req("GPTBot/1.0", { signature: true }))).toBeNull();
  });

  it("includes X-Payment-Network header for base", () => {
    const res = handler(req("ClaudeBot/1.0"));
    expect(res?.headers.get("X-Payment-Network")).toBe("base");
  });

  it("uses comma-separated networks for both", () => {
    const h = crawlpay({ wallet: "0xS", network: "both" });
    const res = h(req("GPTBot/1.0"));
    expect(res?.headers.get("X-Payment-Network")).toBe("base,polygon");
  });

  it("uses path-specific price for matching paths", async () => {
    const h = crawlpay({ wallet: "0xS", paths: { "/premium/*": "0.01" } });
    const res = h(
      req("GPTBot/1.0", { url: "https://example.com/premium/x" }),
    );
    expect(res?.status).toBe(402);
    const body = await res!.json();
    expect(body.price).toBe("0.01");
  });
});
