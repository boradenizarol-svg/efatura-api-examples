# curl ile kullanım

Taban adres: `https://efaturaoku.site`

## Ücretsiz örnek çıktı

```bash
curl https://efaturaoku.site/v1/demo
```

## Fatura okuma (API anahtarı)

Ham XML gönderin (UTF-8 ve Windows-1254 desteklenir):

```bash
curl -X POST https://efaturaoku.site/v1/parse \
  -H "Authorization: Bearer ANAHTARINIZ" \
  -H "Content-Type: application/xml" \
  --data-binary @samples/ornek-fatura.xml
```

Ya da JSON içinde:

```bash
curl -X POST https://efaturaoku.site/v1/parse \
  -H "Authorization: Bearer ANAHTARINIZ" \
  -H "Content-Type: application/json" \
  -d '{"xmlBase64": "'"$(base64 -w0 samples/ornek-fatura.xml)"'"}'
```

Yanıt başlığındaki `X-Credits-Remaining` kalan krediyi gösterir.

## Kalan kredi

```bash
curl https://efaturaoku.site/v1/credits -H "Authorization: Bearer ANAHTARINIZ"
```

## Anahtarsız istek (x402)

Anahtar göndermezseniz servis `402 Payment Required` ve `PAYMENT-REQUIRED` başlığında x402 ödeme talimatını döner. x402 istemcileri bunu otomatik öder; bkz. [`x402-client.mjs`](x402-client.mjs).
