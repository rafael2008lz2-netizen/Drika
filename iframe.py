import re

with open('style.css', 'r', encoding='utf-8') as f:
    content = f.read()

# Add iframe hiding
if 'iframe[src*="elfsight"]' not in content:
    content += '''
/* Force hide any elfsight iframes that might contain the badge */
iframe[src*="elfsight"],
iframe[title*="elfsight"],
iframe[name*="elfsight"] {
  display: none !important;
  opacity: 0 !important;
  pointer-events: none !important;
  z-index: -9999 !important;
}
'''
    with open('style.css', 'w', encoding='utf-8') as f:
        f.write(content)
        print("Iframe hiding added to CSS")
