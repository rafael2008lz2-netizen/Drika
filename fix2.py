import re

with open('guia-de-tecidos.html', 'r', encoding='utf-8') as f:
    text = f.read()

text = text.replace(\"images/piquet.jpg\\'\", \"images/piquet.jpg'\")
text = text.replace(\"images/moletom.jpg\\'\", \"images/moletom.jpg'\")
text = text.replace(\"images/malha.jpg\\'\", \"images/malha.jpg'\")
text = text.replace(\"images/tactel.jpg\\'\", \"images/tactel.jpg'\")

with open('guia-de-tecidos.html', 'w', encoding='utf-8') as f:
    f.write(text)
