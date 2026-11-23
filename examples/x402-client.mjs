// e-Fatura API — x402 ile hesapsız, istek başına ödeme (Base ağında USDC).
// Yapay zeka ajanları için: kayıt yok, API anahtarı yok; her başarılı fatura 0,01 USDC.
//
// Kurulum:   npm i @x402/fetch @x402/evm viem
// Çalıştırma: PRIVATE_KEY=0x... node examples/x402-client.mjs samples/ornek-fatura.xml
//
// Güvenlik: Bu cüzdana yalnızca küçük tutarlar koyun. Örnek, servis 0,01 USDC'den fazlasını
// isterse ödeme yapmaz.
import { readFile } from "node:fs/promises";
import { privateKeyToAccount } from "viem/accounts";
import { wrapFetchWithPaymentFromConfig } from "@x402/fetch";
import { ExactEvmScheme } from "@x402/evm";

const URL_ = "https://efaturaoku.site/v1/parse";
const NETWORK = "eip155:8453"; // Base
const MAX_AMOUNT = 10000n; // 0,01 USDC (6 ondalık)

const account = privateKeyToAccount(process.env.PRIVATE_KEY);
const fetchWithPayment = wrapFetchWithPaymentFromConfig(fetch, {
  schemes: [{ network: NETWORK, client: new ExactEvmScheme(account) }],
  // Yalnızca beklenen ağda ve en fazla 0,01 USDC'lik teklifleri kabul et
  paymentRequirementsSelector: (_version, accepts) => {
    const ok = accepts.find((a) => a.network === NETWORK && BigInt(a.amount) <= MAX_AMOUNT);
    if (!ok) throw new Error("Beklenmeyen fiyat veya ağ; ödeme yapılmadı.");
    return ok;
  },
});

const res = await fetchWithPayment(URL_, {
  method: "POST",
  headers: { "content-type": "application/xml", accept: "application/json" },
  body: await readFile(process.argv[2] ?? "samples/ornek-fatura.xml"),
});

console.log("HTTP", res.status);
const body = await res.json();
if (body.invoice) console.log("Ödenecek:", body.invoice.totals.payable, "| Kontroller geçti:", body.allChecksPassed);
else console.log(body);
