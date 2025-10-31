import { PublicKey, SystemProgram, Transaction } from "@solana/web3.js";
import type { VyraConfig, WalletLike, X402Bill } from "./types";

async function getBlockhash(apiBase: string) {
  const r = await fetch(`${apiBase}/solana/blockhash`);
  if (!r.ok) throw new Error("Failed to fetch blockhash");
  return r.json(); // { blockhash, lastValidBlockHeight }
}

async function sendRaw(apiBase: string, txBase64: string) {
  const r = await fetch(`${apiBase}/solana/send`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ txBase64 })
  });
  const j = await r.json();
  if (!r.ok || j.error) throw new Error(j?.error?.message || "sendRawTransaction failed");
  return j.signature as string;
}

export async function paySOLLegacy(
  cfg: VyraConfig,
  wallet: WalletLike,
  amountSOL: number,
  memo?: string
): Promise<string> {
  const apiBase = cfg.apiBase ?? "/api";
  const bh = await getBlockhash(apiBase);

  const tx = new Transaction({
    feePayer: wallet.publicKey as any,
    recentBlockhash: bh.blockhash
  }).add(
    SystemProgram.transfer({
      fromPubkey: wallet.publicKey as any,
      toPubkey: new PublicKey(cfg.receiver),
      lamports: Math.round(amountSOL * 1e9)
    })
  );

  const signed = await wallet.signTransaction(tx as any);
  const raw = (signed as any).serialize();
  const base64 = Buffer.from(raw).toString("base64");
  return sendRaw(apiBase, base64);
}

export async function unlock(endpoint: string) {
  return fetch(endpoint, { headers: { "x-vyra-paid": "true" } });
}

export async function getX402(endpoint: string): Promise<X402Bill | null> {
  const res = await fetch(endpoint);
  if (res.status !== 402) return null;
  return (await res.json()) as X402Bill;
}
