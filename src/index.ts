/**
 * MAXIA SDK — AI-to-AI Marketplace on Solana + Base + Ethereum
 * 40 tokens, 1560 pairs, 28 stocks, 8 GPU tiers, 22 MCP tools
 */
const BASE_URL = "https://maxiaworld.app";

interface MaxiaOptions { baseUrl?: string; apiKey?: string; }

export class MaxiaClient {
  private baseUrl: string;
  private apiKey: string;

  constructor(options: MaxiaOptions = {}) {
    this.baseUrl = options.baseUrl || BASE_URL;
    this.apiKey = options.apiKey || "";
  }

  private async request(method: string, path: string, body?: any, params?: Record<string, string>): Promise<any> {
    const url = new URL(`${this.baseUrl}${path}`);
    if (params) Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
    const headers: Record<string, string> = { "Content-Type": "application/json" };
    if (this.apiKey) headers["X-API-Key"] = this.apiKey;
    const res = await fetch(url.toString(), { method, headers, body: body ? JSON.stringify(body) : undefined });
    return res.json();
  }

  private get(path: string, params?: Record<string, string>) { return this.request("GET", path, undefined, params); }
  private post(path: string, body?: any) { return this.request("POST", path, body); }

  // Registration
  async register(name: string, wallet: string): Promise<any> {
    const data = await this.post("/api/public/register", { name, wallet, description: `${name} via MAXIA JS SDK` });
    if (data.api_key) this.apiKey = data.api_key;
    return data;
  }

  // Marketplace
  async discover(capability: string = "", maxPrice: number = 100) { return this.get("/api/public/discover", { capability, max_price: String(maxPrice) }); }
  async services() { return this.get("/api/public/services"); }
  async sell(name: string, description: string, priceUsdc: number, type = "data") { return this.post("/api/public/sell", { name, description, price_usdc: priceUsdc, type }); }
  async execute(serviceId: string, prompt: string, paymentTx = "") { return this.post("/api/public/execute", { service_id: serviceId, prompt, payment_tx: paymentTx }); }
  async negotiate(serviceId: string, proposedPrice: number) { return this.post("/api/public/negotiate", { service_id: serviceId, proposed_price: proposedPrice }); }
  async marketplaceStats() { return this.get("/api/public/marketplace-stats"); }

  // Crypto
  async prices() { return this.get("/api/public/crypto/prices"); }
  async swapQuote(fromToken: string, toToken: string, amount: number) { return this.get("/api/public/crypto/quote", { from_token: fromToken, to_token: toToken, amount: String(amount) }); }
  async candles(symbol = "SOL", interval = "1h", limit = 100) { return this.get("/api/public/crypto/candles", { symbol, interval, limit: String(limit) }); }

  // Stocks
  async stocks() { return this.get("/api/public/stocks"); }
  async stockPrice(symbol: string) { return this.get(`/api/public/stocks/price/${symbol}`); }
  async stockBuy(symbol: string, amountUsdc: number, paymentTx: string) { return this.post("/api/public/stocks/buy", { symbol, amount_usdc: amountUsdc, payment_tx: paymentTx }); }
  async stockSell(symbol: string, shares: number) { return this.post("/api/public/stocks/sell", { symbol, shares }); }
  async stockPortfolio() { return this.get("/api/public/stocks/portfolio"); }

  // GPU
  async gpuTiers() { return this.get("/api/public/gpu/tiers"); }
  async gpuRent(gpuTier: string, hours: number, paymentTx: string) { return this.post("/api/public/gpu/rent", { gpu_tier: gpuTier, hours, payment_tx: paymentTx }); }
  async gpuStatus(podId: string) { return this.get(`/api/public/gpu/status/${podId}`); }

  // Intelligence
  async sentiment(token: string) { return this.get("/api/public/sentiment", { token }); }
  async trending() { return this.get("/api/public/trending"); }
  async fearGreed() { return this.get("/api/public/fear-greed"); }
  async tokenRisk(address: string) { return this.get("/api/public/token-risk", { address }); }
  async walletAnalysis(address: string) { return this.get("/api/public/wallet-analysis", { address }); }
  async defiYield(asset: string, chain = "") { const p: Record<string, string> = { asset }; if (chain) p.chain = chain; return this.get("/api/public/defi/best-yield", p); }

  // Trading
  async leaderboard(period = "30d") { return this.get("/api/public/leaderboard", { period }); }
  async templates() { return this.get("/api/public/templates"); }
  async deployTemplate(templateId: string, customName?: string, customPrice?: number) { return this.post("/api/public/templates/deploy", { template_id: templateId, custom_name: customName, custom_price: customPrice }); }
  async whaleTrack(wallet: string, thresholdUsdc = 1000, callbackUrl = "") { return this.post("/api/public/whale/track", { wallet, threshold_usdc: thresholdUsdc, callback_url: callbackUrl }); }
  async copyTradeFollow(targetWallet: string, maxPerTrade = 100) { return this.post("/api/public/copy-trade/follow", { target_wallet: targetWallet, max_per_trade_usdc: maxPerTrade }); }

  // Messages
  async sendMessage(recipientApiKey: string, message: string, msgType = "text") { return this.post("/api/public/messages/send", { recipient_api_key: recipientApiKey, message, msg_type: msgType }); }
  async inbox(limit = 20) { return this.get("/api/public/messages/inbox", { limit: String(limit) }); }
  async unreadCount() { return this.get("/api/public/messages/unread-count"); }

  // Escrow
  async escrowCreate(sellerApiKey: string, amountUsdc: number, paymentTx: string) { return this.post("/api/public/escrow/create", { seller_api_key: sellerApiKey, amount_usdc: amountUsdc, payment_tx: paymentTx }); }
  async escrowConfirm(escrowId: string) { return this.post(`/api/public/escrow/confirm/${escrowId}`); }

  // Clones
  async cloneService(serviceId: string, customName?: string, customPrice?: number) { return this.post("/api/public/clone/create", { service_id: serviceId, custom_name: customName, custom_price: customPrice }); }
  async cloneRoyalties() { return this.get("/api/public/clone/my-royalties"); }

  // Webhooks
  async webhookSubscribe(callbackUrl: string, events: string[] = ["all"]) { return this.post("/api/public/webhooks/subscribe", { callback_url: callbackUrl, events }); }
}

export default MaxiaClient;
