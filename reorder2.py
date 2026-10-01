import re

with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

depoimentos_pattern = r'(<!-- ==========================================\s*DEPOIMENTOS\s*========================================== -->\s*<section class="section testimonials-section" id="depoimentos">.*?</section>\s*)'
match_dep = re.search(depoimentos_pattern, content, flags=re.DOTALL)

if match_dep:
    depo_str = match_dep.group(1)
    # Remove from original position
    content = content.replace(depo_str, '')
    
    # Insert before Diferenciais
    diferenciais_pattern = r'(<!-- ==========================================\s*DIFERENCIAIS\s*========================================== -->)'
    
    content = re.sub(diferenciais_pattern, depo_str + r'\n  \1', content)

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(content)

print("Reorder done correctly")
