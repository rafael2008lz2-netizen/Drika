import re

with open('guia-de-tecidos.html', 'r', encoding='utf-8') as f:
    text = f.read()

# Replace in Javascript dictionary
text = text.replace("'img': 'images/guia-de-tecidos.png'", "'img': 'images/guia-de-tecidos.png'") # Not generic enough
text = re.sub(r"('piquet': \{.*?img:\s*)'images/guia-de-tecidos\.png'", r"\1'images/piquet.jpg'", text, flags=re.DOTALL)
text = re.sub(r"('moletom': \{.*?img:\s*)'images/guia-de-tecidos\.png'", r"\1'images/moletom.jpg'", text, flags=re.DOTALL)
text = re.sub(r"('pv': \{.*?img:\s*)'images/guia-de-tecidos\.png'", r"\1'images/malha.jpg'", text, flags=re.DOTALL)
text = re.sub(r"('tactel': \{.*?img:\s*)'images/guia-de-tecidos\.png'", r"\1'images/tactel.jpg'", text, flags=re.DOTALL)

# HTML cards
text = re.sub(r'<img loading="lazy" src="images/guia-de-tecidos\.png" alt="Piquet".*?>', '<img loading="lazy" src="images/piquet.jpg" alt="Piquet" style="opacity: 1; width: 100%; height: 100%; object-fit: cover;">', text)
text = re.sub(r'<img loading="lazy" src="images/guia-de-tecidos\.png" alt="Moletom".*?>', '<img loading="lazy" src="images/moletom.jpg" alt="Moletom" style="opacity: 1; width: 100%; height: 100%; object-fit: cover;">', text)
text = re.sub(r'<img loading="lazy" src="images/guia-de-tecidos\.png" alt="PV.*?Viscose.*?.*?>', '<img loading="lazy" src="images/malha.jpg" alt="PV (Poliéster + Viscose)" style="opacity: 1; width: 100%; height: 100%; object-fit: cover;">', text)
text = re.sub(r'<img loading="lazy" src="images/guia-de-tecidos\.png" alt="Tactel".*?>', '<img loading="lazy" src="images/tactel.jpg" alt="Tactel" style="opacity: 1; width: 100%; height: 100%; object-fit: cover;">', text)

with open('guia-de-tecidos.html', 'w', encoding='utf-8') as f:
    f.write(text)
print('Images replaced successfully')
