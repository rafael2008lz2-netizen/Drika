import re

with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Inject attachShadow interceptor in <head>
interceptor = '''
  <script>
    // Interceptar Shadow DOM para garantir que podemos ocultar marcas d'água
    (function() {
      const origAttachShadow = Element.prototype.attachShadow;
      Element.prototype.attachShadow = function(init) {
        const shadow = origAttachShadow.call(this, { mode: 'open', delegatesFocus: init.delegatesFocus });
        
        // Injetar CSS de limpeza instantaneamente
        const st = document.createElement('style');
        st.textContent = 
          a[href*="elfsight"], a[href*="apps.elfsight.com"], .eapps-link, [class*="eapps-link"], 
          [class*="Badge__"], [class*="badge__"], [class*="FloatingBadge"], [class*="FreeLink"], 
          [class*="free-link"], [class*="es-badge"],
          [class*="WidgetTitle"], [class*="Header__Title"], [class*="Title__Container"], 
          [class*="Title__TitleComponent"], [class*="Title-sc"], [class*="es-widget-title"], [class*="es-header-title"] {
            display: none !important; opacity: 0 !important; visibility: hidden !important; 
            height: 0 !important; max-height: 0 !important; overflow: hidden !important; 
            margin: 0 !important; padding: 0 !important; pointer-events: none !important;
          }
        ;
        shadow.appendChild(st);
        
        // Registrar shadowRoot na janela (opcional, para limpezas futuras)
        window._allShadows = window._allShadows || [];
        window._allShadows.push(shadow);
        
        return shadow;
      };
    })();
  </script>
'''

if 'origAttachShadow' not in content:
    content = content.replace('<head>', '<head>\n' + interceptor)

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(content)

print("Interceptor injected")
