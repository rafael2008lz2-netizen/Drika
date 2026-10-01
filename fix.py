import re

with open('guia-de-tecidos.html', 'r', encoding='utf-8') as f:
    text = f.read()

text = re.sub(r'(\'piquet\': \{[\s\S]*?img:\s*\')images/guia-de-tecidos\.png\'', r'\g<1>images/piquet.jpg\'', text)
text = re.sub(r'(\'moletom\': \{[\s\S]*?img:\s*\')images/guia-de-tecidos\.png\'', r'\g<1>images/moletom.jpg\'', text)
text = re.sub(r'(\'pv\': \{[\s\S]*?img:\s*\')images/guia-de-tecidos\.png\'', r'\g<1>images/malha.jpg\'', text)
text = re.sub(r'(\'tactel\': \{[\s\S]*?img:\s*\')images/guia-de-tecidos\.png\'', r'\g<1>images/tactel.jpg\'', text)

with open('guia-de-tecidos.html', 'w', encoding='utf-8') as f:
    f.write(text)
