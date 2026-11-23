# e-Fatura API — örnekler / examples

**Türk e-Fatura ve e-Arşiv XML'ini (GİB UBL-TR) tek istekte JSON'a çeviren ve kontrol eden API.** REST, MCP sunucusu (Claude ve diğer ajanlar) ve x402 ile istek başına ödeme.

**Turkish e-invoice (GİB UBL-TR) parser API** for developers and AI agents — REST, MCP server and x402 pay-per-call.

🌐 https://efatura-api.efatura-api.workers.dev · 📄 [OpenAPI](https://efatura-api.efatura-api.workers.dev/openapi.json) · 🤖 [llms.txt](https://efatura-api.efatura-api.workers.dev/llms.txt) · 🧪 [Ücretsiz örnek çıktı / free demo](https://efatura-api.efatura-api.workers.dev/v1/demo)

> Bu depo yalnızca kullanım örneklerini içerir. Servisin kendisi barındırılan (hosted) bir API'dir.
> This repository contains usage examples only; the service itself is a hosted API.

## Ne yapar?

- **Okur:** fatura no, ETTN, tarih, satıcı/alıcı (unvan, VKN/TCKN, vergi dairesi), kalemler, KDV, ÖTV, tevkifat, toplamlar
- **Kontrol eder:** VKN/TCKN kontrol hanesi, fatura no ve ETTN biçimi, satır / KDV / vergiler dahil / ödenecek tutar hesapları
- **Saklamaz:** fatura okunur ve unutulur; hatalı okumalar ücretsizdir
- **Destekler:** TEMELFATURA, TICARIFATURA, EARSIVFATURA, IHRACAT, TEVKIFAT, ISTISNA, IADE, OZELMATRAH, HKS, YATIRIMTESVIK; GİB zarfı; UTF-8 ve Windows-1254; en fazla 2 MB

Örnek girdi: [`samples/ornek-fatura.xml`](samples/ornek-fatura.xml) (uydurma veri) → çıktı: [`samples/ornek-cikti.json`](samples/ornek-cikti.json)

## Fiyat / Pricing

Fatura başına **$0.01** — yalnızca başarılı okumalar. Abonelik yok.

| Yol | Nasıl |
|---|---|
| **x402** | Hesap ve anahtar yok; her istek Base ağında 0,01 USDC ile otomatik ödenir. Ajanlar için ideal. |
| **API anahtarı** | Ön ödemeli kredi, `Authorization: Bearer <anahtar>` |

## Örnekler

| Dosya | Açıklama |
|---|---|
| [`examples/curl.md`](examples/curl.md) | curl ile REST |
| [`examples/node-fetch.mjs`](examples/node-fetch.mjs) | Node.js, API anahtarı |
| [`examples/python_requests.py`](examples/python_requests.py) | Python, API anahtarı |
| [`examples/x402-client.mjs`](examples/x402-client.mjs) | Node.js, x402 ile hesapsız ödeme |
| [`examples/mcp/`](examples/mcp/) | Claude Code ve diğer MCP istemcileri |

### Hızlı başlangıç (curl)

```bash
curl -X POST https://efatura-api.efatura-api.workers.dev/v1/parse \
  -H "Authorization: Bearer ANAHTARINIZ" \
  -H "Content-Type: application/xml" \
  --data-binary @samples/ornek-fatura.xml
```

### Claude Code (MCP)

```bash
claude mcp add --transport http efatura https://efatura-api.efatura-api.workers.dev/mcp --header "Authorization: Bearer ANAHTARINIZ"
```

## Yanıt / Response

```json
{
  "invoice": {
    "invoiceNumber": "ORN2026000000042",
    "ettn": "3f2b8c1e-7a4d-4e9b-9c21-5d6e8f0a1b2c",
    "type": "SATIS",
    "supplier": { "name": "Örnek Yazılım A.Ş.", "taxId": "1234567890", "taxIdType": "VKN" },
    "customer": { "name": "Deneme Ticaret Ltd. Şti.", "taxId": "9876543217", "taxIdType": "VKN" },
    "taxes": [{ "type": "KDV", "code": "0015", "percent": 20, "taxableAmount": 3900, "amount": 780 }],
    "withholdings": [],
    "totals": { "taxExclusive": 3900, "taxInclusive": 4680, "payable": 4680 }
  },
  "checks": [{ "check": "payable", "ok": true, "message": "Ödenecek tutar tutarlı." }],
  "allChecksPassed": true
}
```

Hata kodları: `401` anahtar yok/geçersiz · `402` kredi bitti ya da x402 ödemesi gerekli · `413` 2 MB üstü · `422` UBL-TR fatura değil (ücret alınmaz).

## English

e-Fatura API parses Turkish e-invoices (GİB UBL-TR 1.2 XML — e-Fatura and e-Arşiv, also inside GİB envelopes) into structured JSON and validates them: VKN/TCKN checksums, invoice number and ETTN format, line, VAT (KDV), withholding (tevkifat) and payable totals. Use it over REST, as an MCP server for Claude and other agents, or pay per call with x402 (USDC on Base). $0.01 per successfully parsed invoice; invoices are never stored.

## Lisans

Bu depodaki örnekler MIT lisanslıdır. Örnek fatura uydurma verilerle hazırlanmıştır.
