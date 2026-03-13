import os
import re

source_file = r'c:\Users\ferra\Downloads\index.html'
dest_dir = r'c:\Users\ferra\.gemini\antigravity\scratch\Conveniencia'

if not os.path.exists(dest_dir):
    os.makedirs(dest_dir)

with open(source_file, 'r', encoding='utf-8') as f:
    content = f.read()

# Extract CSS
css_match = re.search(r'<style>(.*?)</style>', content, re.DOTALL)
css_content = css_match.group(1).strip() if css_match else ''

os.makedirs(os.path.join(dest_dir, 'css'), exist_ok=True)
with open(os.path.join(dest_dir, 'css', 'style.css'), 'w', encoding='utf-8') as f:
    f.write(css_content)

# Extract JS
js_match = re.search(r'<script>(.*?)</script>', content, re.DOTALL)
js_content = js_match.group(1).strip() if js_match else ''

# Replace inline with linked
html_content = re.sub(r'<style>.*?</style>', '<link rel="stylesheet" href="css/style.css">', content, flags=re.DOTALL)
html_content = re.sub(r'<script>.*?</script>', '<script type="module" src="js/main.js"></script>', html_content, flags=re.DOTALL)

with open(os.path.join(dest_dir, 'index.html'), 'w', encoding='utf-8') as f:
    f.write(html_content)

os.makedirs(os.path.join(dest_dir, 'js'), exist_ok=True)
with open(os.path.join(dest_dir, 'js', 'legacy.js'), 'w', encoding='utf-8') as f:
    f.write(js_content)

print('Separation done.')
