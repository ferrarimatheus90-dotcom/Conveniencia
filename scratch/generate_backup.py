import urllib.request
import json
import os
import datetime

url = "https://ryizqbbjxjrxcortkshv.supabase.co/rest/v1/config_app?select=json_db"
apikey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ5aXpxYmJqeGpyeGNvcnRrc2h2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYzNDk3MzQsImV4cCI6MjA5MTkyNTczNH0.nhb-bPiPN_q29-LfdrnjtYLq4k38hFwuuYu6bjuDCUM"

req = urllib.request.Request(url, headers={"apikey": apikey, "Authorization": f"Bearer {apikey}"})

try:
    with urllib.request.urlopen(req) as response:
        data = json.loads(response.read().decode('utf-8'))
        if data and len(data) > 0 and 'json_db' in data[0]:
            db_json = data[0]['json_db']
            
            # Format filename
            today_str = datetime.datetime.now().strftime("%d-%m-%Y")
            filename = f"backup_conveniencia_{today_str}.json"
            
            # Paths to save
            project_path = os.path.join(r"c:\Users\ferra\.gemini\antigravity\scratch\Conveniencia", filename)
            downloads_path = os.path.join(r"C:\Users\ferra\Downloads", filename)
            
            # Write files
            with open(project_path, "w", encoding="utf-8") as f:
                json.dump(db_json, f, ensure_ascii=False, indent=2)
                
            with open(downloads_path, "w", encoding="utf-8") as f:
                json.dump(db_json, f, ensure_ascii=False, indent=2)
                
            print(f"SUCCESS: Saved backup to {project_path} and {downloads_path}")
            print(f"Stats: {len(db_json.get('produtos', []))} produtos, {len(db_json.get('vendas', []))} vendas")
        else:
            print("ERROR: Empty or invalid response from Supabase")
except Exception as e:
    print(f"EXCEPTION: {e}")
