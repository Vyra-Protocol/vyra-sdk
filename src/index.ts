export * from "./types";
export * from "./client";
export * from "./verify";

import type { VyraConfig, WalletLike } from "./types";
import { getX402, paySOLLegacy, unlock } from "./client";
import { verifyOnChain } from "./verify";

export const Vyra = {
  async payVerifyAccess(opts: {
    endpoint: string;
    cfg: VyraConfig;
    wallet: WalletLike;
  }): Promise<Response> {
    const bill = await getX402(opts.endpoint);
    if (!bill) {
      // already accessible
      return fetch(opts.endpoint);
    }
    const sig = await paySOLLegacy(opts.cfg, opts.wallet, Number(bill.amount), bill.memo);
    const apiBase = opts.cfg.apiBase ?? "/api";
    const v = await verifyOnChain(apiBase, sig, bill.amount, bill.memo);
    if (!v?.ok) throw new Error(v?.error || "Verification failed");
    return unlock(opts.endpoint);
  }
};
