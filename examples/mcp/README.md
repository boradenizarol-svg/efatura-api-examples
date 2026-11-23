# MCP ile kullanım

Sunucu adresi: `https://efaturaoku.site/mcp` (Streamable HTTP)
Resmî MCP kaydı: `io.github.boradenizarol-svg/efatura`

Araçlar:
- `efatura_demo` — ücretsiz, örnek çıktı
- `parse_efatura` — ücretli (fatura başına $0.01), `Authorization: Bearer <anahtar>` başlığı gerekir

## Claude Code

```bash
claude mcp add --transport http efatura https://efaturaoku.site/mcp --header "Authorization: Bearer ANAHTARINIZ"
```

## URL ve başlık destekleyen MCP istemcileri (ör. Cursor)

[`mcp.json`](mcp.json) dosyasındaki yapıyı istemcinizin MCP ayarlarına ekleyin.
