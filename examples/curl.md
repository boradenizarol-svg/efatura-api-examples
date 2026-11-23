# curl ile kullanım

Taban adres: `https://efaturaoku.site`

## Ücretsiz örnek çıktı

```bash
curl https://efaturaoku.site/v1/demo
```

## Fatura okuma (x402)

Okuma istek başına ücretlidir ve **x402** ile ödenir; hesap ya da API anahtarı yoktur. Ödemesiz istek, `402 Payment Required` ve `PAYMENT-REQUIRED` başlığında ödeme talimatını döner:

```bash
curl -i -X POST https://efaturaoku.site/v1/parse \
  -H "Content-Type: application/xml" \
  --data-binary @samples/ornek-fatura.xml
```

curl ödeme yapamaz; ödemeyi x402 destekli bir istemci otomatik yapar. Bkz. [`x402-client.mjs`](x402-client.mjs).

Gövde ham XML (UTF-8, UTF-16 ve Windows-1254 desteklenir) ya da JSON olabilir: `{"xml": "..."}` veya `{"xmlBase64": "..."}`.
