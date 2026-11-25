# e-Fatura Oku — örnekler / examples

**e-Fatura ve e-Arşiv dosyalarını (GİB UBL-TR XML) okuyan ve hatalarını yakalayan servis.** İnsanlar için ücretsiz web görüntüleyici; yazılımlar ve yapay zeka ajanları için **x402 ile istek başına** ücretli okuma (hesap ve API anahtarı yok).

**Turkish e-invoice (GİB UBL-TR) parser** — free web viewer for people, x402 pay-per-call for software and AI agents (no account, no API key).

🌐 https://efaturaoku.site · 👩‍💻 [Geliştiriciler](https://efaturaoku.site/gelistiriciler) · 📄 [OpenAPI](https://efaturaoku.site/openapi.json) · 🤖 [llms.txt](https://efaturaoku.site/llms.txt) · 🧪 [Ücretsiz örnek çıktı / free demo](https://efaturaoku.site/v1/demo)

> Bu depo yalnızca kullanım örneklerini içerir. Servisin kendisi barındırılan (hosted) bir hizmettir.
> This repository contains usage examples only; the service itself is hosted.

## Ne yapar?

- **Okur:** fatura no, ETTN, tarih; satıcı, alıcı ve ihracatta asıl alıcı (unvan, VKN/TCKN, vergi dairesi, MERSİS gibi diğer kimlikler, adres, iletişim); kalemler (stok kodu, sınıf kodu, marka/model, satır tevkifatı); KDV, ÖTV, tevkifat ve istisna kodları; toplamlar; IBAN, vade ve ödeme koşulu; iade edilen fatura, sipariş, irsaliye ve fatura dönemi
- **Kontrol eder:** VKN/TCKN ve IBAN kontrol haneleri, fatura no, ETTN ve tarih biçimi, satır / KDV / vergiler dahil / ödenecek tutar hesapları, satır KDV'si ile belge KDV'sinin uyumu, KDV oranı, %0 KDV'de istisna kodu, tevkifat ve iade bilgisi, dövizli faturada kur
- **Saklamaz:** fatura okunur ve unutulur; hatalı okumalar ücretsizdir
- **Destekler:** TEMELFATURA, TICARIFATURA, EARSIVFATURA, IHRACAT, TEVKIFAT, ISTISNA, IADE, OZELMATRAH, HKS, YATIRIMTESVIK; GİB zarfı; UTF-8, UTF-16 ve Windows-1254; en fazla 2 MB

Örnek girdi: [`samples/ornek-fatura.xml`](samples/ornek-fatura.xml) (uydurma veri) → çıktı: [`samples/ornek-cikti.json`](samples/ornek-cikti.json)

## Fiyat / Pricing

Başarıyla okunan fatura başına **$0.01**, **x402** ile Base ağında USDC olarak otomatik ödenir. Hesap, API anahtarı ya da abonelik yok; okunamayan dosyalar ücretsizdir.

Tek tük fatura için koda gerek yok: [efaturaoku.site](https://efaturaoku.site) üzerindeki görüntüleyici ücretsizdir ve dosya bilgisayarınızdan çıkmaz.

## Ücretsiz web araçları

Kod yazmadan, tarayıcıda çalışan araçlar (veriler bilgisayarınızdan çıkmaz):

- [e-Fatura XML görüntüleyici](https://efaturaoku.site/) · [XML'i Excel'e çevirme](https://efaturaoku.site/e-fatura-excel-donusturme) · [e-Arşiv fatura görüntüleme](https://efaturaoku.site/e-arsiv-fatura-goruntuleme)
- [KDV hesaplama](https://efaturaoku.site/kdv-hesaplama) · [Tevkifat hesaplama](https://efaturaoku.site/tevkifat-hesaplama) · [TCMB döviz kuru hesaplama](https://efaturaoku.site/tcmb-doviz-kuru-hesaplama) · [Tutarı yazıya çevirme](https://efaturaoku.site/tutar-yaziya-cevirme)
- [VKN / TCKN doğrulama](https://efaturaoku.site/vkn-dogrulama) · [Toplu VKN kontrolü](https://efaturaoku.site/toplu-vkn-kontrol) · [IBAN doğrulama](https://efaturaoku.site/iban-dogrulama)
- GİB kod listeleri: [KDV istisna kodları](https://efaturaoku.site/kdv-istisna-kodlari) · [Tevkifat kodları ve oranları](https://efaturaoku.site/tevkifat-kodlari) · [Vergi kodları](https://efaturaoku.site/vergi-kodlari) · [Ölçü birimi kodları](https://efaturaoku.site/olcu-birimi-kodlari)
- Rehberler: [XML fatura nasıl açılır?](https://efaturaoku.site/rehber/xml-fatura-nasil-acilir) · [Gelen e-fatura nasıl kontrol edilir?](https://efaturaoku.site/rehber/gelen-e-fatura-nasil-kontrol-edilir) · [Tüm rehberler](https://efaturaoku.site/rehber)

## Örnekler

| Dosya | Açıklama |
|---|---|
| [`examples/x402-client.mjs`](examples/x402-client.mjs) | Node.js, x402 ile istek başına ödeme |
| [`examples/curl.md`](examples/curl.md) | curl ile ücretsiz örnek ve 402 ödeme talimatı |
| [`examples/mcp/`](examples/mcp/) | Claude Code ve diğer MCP istemcileri (ücretsiz örnek aracı) |

### Hızlı başlangıç (Node.js, x402)

```bash
npm i @x402/fetch @x402/evm viem
PRIVATE_KEY=0x... node examples/x402-client.mjs samples/ornek-fatura.xml
```

Cüzdana yalnızca küçük tutarlar koyun; örnek, servis 0,01 USDC'den fazlasını isterse ödeme yapmaz.

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

Hata kodları: `402` x402 ödemesi gerekli · `413` 2 MB üstü · `422` UBL-TR fatura değil (ücret alınmaz) · `429` çok fazla istek.

## English

e-Fatura Oku parses Turkish e-invoices (GİB UBL-TR 1.2 XML — e-Fatura and e-Arşiv, also inside GİB envelopes) into structured JSON (parties with addresses and identifiers, lines with item codes, taxes with exemption codes, payment means/IBAN, return and order references) and validates them: VKN/TCKN and IBAN checksums, invoice number, ETTN and date format, line, VAT (KDV), withholding (tevkifat) and payable totals, VAT rates and exemption codes. Every check has a `severity` (`error`, `warning`, `info`); `allChecksPassed` ignores info notes. Software and AI agents pay per call with x402 (USDC on Base) — no account or API key; people can use the free web viewer at efaturaoku.site. $0.01 per successfully parsed invoice; invoices are never stored.

## Lisans

Bu depodaki örnekler MIT lisanslıdır. Örnek fatura uydurma verilerle hazırlanmıştır.
