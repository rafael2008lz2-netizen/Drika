import re

with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

fixed = '''st.textContent = `
          a[href*="elfsight"], a[href*="apps.elfsight.com"], .eapps-link, [class*="eapps-link"], 
          [class*="Badge__"], [class*="badge__"], [class*="FloatingBadge"], [class*="FreeLink"], 
          [class*="free-link"], [class*="es-badge"],
          [class*="WidgetTitle"], [class*="Header__Title"], [class*="Title__Container"], 
          [class*="Title__TitleComponent"], [class*="Title-sc"], [class*="es-widget-title"], [class*="es-header-title"] {
            display: none !important; opacity: 0 !important; visibility: hidden !important; 
            height: 0 !important; max-height: 0 !important; overflow: hidden !important; 
            margin: 0 !important; padding: 0 !important; pointer-events: none !important;
          }
        `;'''

# The current code in index.html has:
# st.textContent = 
#           a[href*="elfsight"], a[href*="apps.elfsight.com"] ...
#         ;

content = re.sub(r'st\.textContent =\s*a\[href\*="elfsight"\].*?\}\s*;', fixed, content, flags=re.DOTALL)

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(content)

print("Syntax fixed")
