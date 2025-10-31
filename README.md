# Vyra SDK ⚡

JavaScript/TypeScript SDK for **Vyra** — connecting on-chain payments to instant web access via the x402 flow.

## Install
```bash
npm install @vyra/sdk @solana/web3.js
```
## Usage
```ts
import { Vyra } from "@vyra/sdk";

const res = await Vyra.payVerifyAccess({
  endpoint: "/api/article?id=42",
  cfg: { apiBase: "/api", receiver: "HWAyopVZUZkboNQEkKMNpYa4oUU8vR9eT59UMqzjLe7x" },
  wallet
});
```
**Requires backend routes:**
- GET /api/article (returns 402 bill or 200)
- GET /api/solana/blockhash
- POST /api/solana/send
- POST /api/verify
