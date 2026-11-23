"""e-Fatura API — Python örneği, API anahtarı ile.

Kurulum:   pip install requests
Çalıştırma: EFATURA_API_KEY=efa_... python examples/python_requests.py samples/ornek-fatura.xml
"""
import os
import sys

import requests

API = "https://efatura-api.efatura-api.workers.dev"
key = os.environ.get("EFATURA_API_KEY")
path = sys.argv[1] if len(sys.argv) > 1 else "samples/ornek-fatura.xml"
if not key:
    sys.exit("EFATURA_API_KEY ortam değişkenini ayarlayın.")

with open(path, "rb") as f:  # ham baytlar: UTF-8 ve Windows-1254 desteklenir
    res = requests.post(
        f"{API}/v1/parse",
        data=f.read(),
        headers={"Content-Type": "application/xml", "Authorization": f"Bearer {key}"},
        timeout=30,
    )

if not res.ok:
    sys.exit(f"{res.status_code} {res.text}")

body = res.json()
inv = body["invoice"]
print(f"{inv['invoiceNumber']} | {inv['supplier']['name']} -> {inv['customer']['name']}")
print(f"Ödenecek: {inv['totals']['payable']} {inv['currency']}")
failed = [c["message"] for c in body["checks"] if not c["ok"]]
print("Kontroller:", "hepsi geçti" if body["allChecksPassed"] else "; ".join(failed))
print("Kalan kredi:", res.headers.get("X-Credits-Remaining"))
