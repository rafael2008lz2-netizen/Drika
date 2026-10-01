import re

with open('style.css', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace iframe hiding to be safer (only iframes that are direct children of body or outside containers)
content = re.sub(r'iframe\[src\*="elfsight"\].*?}', '''
body > iframe[src*="elfsight"],
body > iframe[title*="elfsight"],
body > iframe[name*="elfsight"] {
  display: none !important;
  opacity: 0 !important;
  pointer-events: none !important;
}
''', content, flags=re.DOTALL)

with open('style.css', 'w', encoding='utf-8') as f:
    f.write(content)
