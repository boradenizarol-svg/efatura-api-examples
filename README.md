# e-Fatura API — örnekler / examples

**e-Fatura ve e-Arşiv dosyalarını (GİB UBL-TR XML) otomatik okuyan ve hatalarını yakalayan API.** Sonucu yazılımınızın doğrudan kullanabileceği JSON olarak verir. REST, MCP sunucusu (Claude ve diğer ajanlar) ve x402 ile istek başına ödeme.

**Turkish e-invoice (GİB UBL-TR) parser API** for developers and AI agents — REST, MCP server and x402 pay-per-call.

🌐 https://efaturaoku.site · 📄 [OpenAPI](https://efaturaoku.site/openapi.json) · 🤖 [llms.txt](https://efaturaoku.site/llms.txt) · 🧪 [Ücretsiz örnek çıktı / free demo](https://efaturaoku.site/v1/demo)

> Bu depo yalnızca kullanım örneklerini içerir. Servisin kendisi barındırılan (hosted) bir API'dir.
> This repository contains usage examples only; the service itself is a hosted API.

## Ne yapar?

- **Okur:** fatura no, ETTN, tarih; satıcı, alıcı ve ihracatta asıl alıcı (unvan, VKN/TCKN, vergi dairesi, MERSİS gibi diğer kimlikler, adres, iletişim); kalemler (stok kodu, sınıf kodu, marka/model, satır tevkifatı); KDV, ÖTV, tevkifat ve istisna kodları; toplamlar; IBAN, vade ve ödeme koşulu; iade edilen fatura, sipariş, irsaliye ve fatura dönemi
- **Kontrol eder:** VKN/TCKN ve IBAN kontrol haneleri, fatura no, ETTN ve tarih biçimi, satır / KDV / vergiler dahil / ödenecek tutar hesapları, satır KDV'si ile belge KDV'sinin uyumu, KDV oranı, %0 KDV'de istisna kodu, tevkifat ve iade bilgisi, dövizli faturada kur
- **Saklamaz:** fatura okunur ve unutulur; hatalı okumalar ücretsizdir
- **Destekler:** TEMELFATURA, TICARIFATURA, EARSIVFATURA, IHRACAT, TEVKIFAT, ISTISNA, IADE, OZELMATRAH, HKS, YATIRIMTESVIK; GİB zarfı; UTF-8, UTF-16 ve Windows-1254; en fazla 2 MB

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
curl -X POST https://efaturaoku.site/v1/parse \
  -H "Authorization: Bearer ANAHTARINIZ" \
  -H "Content-Type: application/xml" \
  --data-binary @samples/ornek-fatura.xml
```

### Claude Code (MCP)

```bash
claude mcp add --transport http efatura https://efaturaoku.site/mcp --header "Authorization: Bearer ANAHTARINIZ"
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
  "checks": [
    { "check": "payable", "ok": true, "severity": "error", "message": "Ödenecek tutar tutarlı." },
    { "check": "kdv_rate_18", "ok": false, "severity": "info", "message": "%18 eski bir KDV oranı (10.07.2023'ten beri %20)." }
  ],
  "allChecksPassed": true,
  "issues": { "error": 0, "warning": 0, "info": 1 }
}
```

Tam çıktı: [`samples/ornek-cikti.json`](samples/ornek-cikti.json).

### Kontrollerin önem derecesi

Her kontrolde `severity` vardır; kontrol başarısız olursa ne kadar ciddi olduğunu söyler:

| severity | Anlamı |
|---|---|
| `error` | Tutarlar ya da kimlik numaraları tutmuyor; fatura büyük olasılıkla hatalı |
| `warning` | Kurallara aykırı görünen ya da eksik bir bilgi var (ör. %0 KDV'de istisna kodu yok) |
| `info` | Bilgi notu; meşru olabilir (ör. eski tarihli bir sözleşmede %18 KDV) |

`allChecksPassed`, hata ya da uyarı yoksa `true` olur; bilgi notları sonucu etkilemez. `issues` başarısız kontrolleri derecesine göre sayar.

Hata kodları: `401` anahtar yok/geçersiz · `402` kredi bitti ya da x402 ödemesi gerekli · `413` 2 MB üstü · `422` UBL-TR fatura değil (ücret alınmaz).

## English

e-Fatura API parses Turkish e-invoices (GİB UBL-TR 1.2 XML — e-Fatura and e-Arşiv, also inside GİB envelopes) into structured JSON (parties with addresses and identifiers, lines with item codes, taxes with exemption codes, payment means/IBAN, return and order references) and validates them: VKN/TCKN and IBAN checksums, invoice number, ETTN and date format, line, VAT (KDV), withholding (tevkifat) and payable totals, VAT rates and exemption codes. Every check has a `severity` (`error`, `warning`, `info`); `allChecksPassed` ignores info notes. Use it over REST, as an MCP server for Claude and other agents, or pay per call with x402 (USDC on Base). $0.01 per successfully parsed invoice; invoices are never stored.

## Lisans

Bu depodaki örnekler MIT lisanslıdır. Örnek fatura uydurma verilerle hazırlanmıştır.
