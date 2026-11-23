# MCP ile kullanım

Sunucu adresi: `https://efaturaoku.site/mcp` (Streamable HTTP)
Resmî MCP kaydı: `io.github.boradenizarol-svg/efatura`

Araçlar:
- `efatura_demo` — ücretsiz, örnek çıktı
- `parse_efatura` — ücret almaz; kendi faturanızı x402 ile nasıl okutacağınızı anlatır (`POST /v1/parse`)

Kendi faturalarınızı okutmak için ajanınızın x402 destekli bir HTTP istemcisi olmalı; bkz. [`../x402-client.mjs`](../x402-client.mjs).

## Claude Code

```bash
claude mcp add --transport http efatura https://efaturaoku.site/mcp
```

## URL destekleyen MCP istemcileri (ör. Cursor)

[`mcp.json`](mcp.json) dosyasındaki yapıyı istemcinizin MCP ayarlarına ekleyin.
