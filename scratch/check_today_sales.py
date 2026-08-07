import json

filename = r"c:\Users\ferra\.gemini\antigravity\scratch\Conveniencia\backup_conveniencia_02-08-2026.json"

with open(filename, "r", encoding="utf-8") as f:
    data = json.load(f)

vendas = data.get("vendas", [])
print(f"Total de vendas no backup: {len(vendas)}")

vendas_hoje = [v for v in vendas if v.get("data") == "2026-08-02" or v.get("dt", "").startswith("2026-08-02")]
print(f"Vendas encontradas para 2026-08-02: {len(vendas_hoje)}")

if vendas_hoje:
    print(json.dumps(vendas_hoje, indent=2, ensure_ascii=False))
else:
    # List unique dates in the backup
    datas = sorted(list(set(v.get("data") for v in vendas if v.get("data"))))
    print("Datas de vendas presentes no backup:", datas)
