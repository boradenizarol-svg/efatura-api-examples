// e-Fatura API — Node.js (18+) örneği, API anahtarı ile.
// Çalıştırma:  EFATURA_API_KEY=efa_... node examples/node-fetch.mjs samples/ornek-fatura.xml
// PowerShell:  $env:EFATURA_API_KEY="efa_..."; node examples/node-fetch.mjs samples/ornek-fatura.xml
import { readFile } from "node:fs/promises";

const API = "https://efaturaoku.site";
const key = process.env.EFATURA_API_KEY;
const file = process.argv[2] ?? "samples/ornek-fatura.xml";
if (!key) {
  console.error("EFATURA_API_KEY ortam değişkenini ayarlayın.");
  process.exit(1);
}

const res = await fetch(`${API}/v1/parse`, {
  method: "POST",
  headers: { "content-type": "application/xml", authorization: `Bearer ${key}` },
  body: await readFile(file), // ham baytlar: UTF-8 ve Windows-1254 desteklenir
});

if (!res.ok) {
  console.error(res.status, await res.text());
  process.exit(1);
}

const { invoice, checks, allChecksPassed } = await res.json();
console.log(`${invoice.invoiceNumber} | ${invoice.supplier.name} -> ${invoice.customer.name}`);
console.log(`Ödenecek: ${invoice.totals.payable} ${invoice.currency}`);
// severity: error | warning | info — bilgi notları (info) sorun sayılmaz
const problems = checks.filter((c) => !c.ok && c.severity !== "info").map((c) => `[${c.severity}] ${c.message}`);
console.log(`Kontroller: ${allChecksPassed ? "hepsi geçti" : problems.join("; ")}`);
console.log(`Kalan kredi: ${res.headers.get("x-credits-remaining")}`);
