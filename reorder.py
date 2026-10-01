import re

with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Reorder "Quem veste aprova"
# Extract Depoimentos section
depoimentos_pattern = r'(<!-- ==========================================\s*DEPOIMENTOS\s*========================================== -->\s*<section class="section testimonials-section" id="depoimentos">.*?</section>\s*)'

match_dep = re.search(depoimentos_pattern, content, flags=re.DOTALL)
if match_dep:
    depo_str = match_dep.group(1)
    # Remove from original position
    content = content.replace(depo_str, '')
    
    # Insert before Diferenciais
    diferenciais_pattern = r'<!-- ==========================================\s*DIFERENCIAIS\s*========================================== -->'
    
    content = content.replace(diferenciais_pattern, depo_str + '\n  ' + diferenciais_pattern)

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(content)

print("Reorder done")
