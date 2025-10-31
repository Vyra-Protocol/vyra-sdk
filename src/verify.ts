export async function fetchBill(endpoint: string): Promise<Response> {
  return fetch(endpoint);
}

export async function verifyOnChain(apiBase: string, tx: string, amount: string, memo: string) {
  const r = await fetch(`${apiBase}/verify`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ tx, amount, memo })
  });
  return r.json();
}
