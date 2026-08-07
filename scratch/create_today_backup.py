import json
import os
import datetime

source_file = r"C:\Users\ferra\Downloads\Código e Web\backup_conveniencia_21-04-2026.json"
today_str = "02-08-2026"
filename = f"backup_conveniencia_{today_str}.json"

proj_dir = r"c:\Users\ferra\.gemini\antigravity\scratch\Conveniencia"
downloads_dir = r"C:\Users\ferra\Downloads"

path_proj = os.path.join(proj_dir, filename)
path_down = os.path.join(downloads_dir, filename)

with open(source_file, "r", encoding="utf-8") as f:
    data = json.load(f)

# Update config timestamp if present
if "config" not in data or not isinstance(data["config"], dict):
    data["config"] = {}
data["config"]["lastBackupSync"] = "2026-08-02T22:30:00.000Z"
data["config"]["lastExport"] = "2026-08-02T22:30:00.000Z"

# Save updated backup JSON
with open(path_proj, "w", encoding="utf-8") as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

with open(path_down, "w", encoding="utf-8") as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print(f"CREATED_BACKUP: {path_proj}")
print(f"CREATED_BACKUP: {path_down}")
print(f"Produtos: {len(data.get('produtos', []))}")
print(f"Vendas: {len(data.get('vendas', []))}")
