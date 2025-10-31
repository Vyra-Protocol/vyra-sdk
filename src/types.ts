export type Base64 = string;

export interface WalletLike {
  publicKey: { toBase58(): string };
  signTransaction(tx: any): Promise<any>;
}

export interface VyraConfig {
  apiBase?: string; // e.g. "/api"
  receiver: string; // destination wallet
}

export interface X402Bill {
  protocol: "x402";
  chain: "solana";
  amount: string; // "0.01"
  memo: string;   // e.g. "article_42"
}
