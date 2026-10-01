import re

with open('script.js', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace cleanAllElfsight with a safer version
safe_js = """// ── Hide Elfsight Watermarks & Title Overrides ───────────────────────────────────
function cleanAllElfsight() {
  const hideCSS = `
    a[href*="elfsight"],
    a[href*="apps.elfsight.com"],
    .eapps-link,
    [class*="eapps-link"],
    [class*="Badge__"],
    [class*="badge__"],
    [class*="FloatingBadge"],
    [class*="FreeLink"],
    [class*="free-link"],
    [class*="WidgetTitle"],
    [class*="Header__Title"],
    [class*="Title__Container"],
    [class*="Title__TitleComponent"],
    [class*="Title-sc"],
    [class*="es-widget-title"],
    [class*="es-header-title"],
    [class*="es-badge"] {
      display: none !important;
      opacity: 0 !important;
      visibility: hidden !important;
      height: 0 !important;
      max-height: 0 !important;
      overflow: hidden !important;
      margin: 0 !important;
      padding: 0 !important;
      pointer-events: none !important;
    }
  `;

  // Inject CSS into all shadow roots
  function injectIntoShadows(root) {
    if (!root) return;
    if (root.shadowRoot) {
      if (!root.shadowRoot.querySelector('#elfsight-safe-cleaner')) {
        const st = document.createElement('style');
        st.id = 'elfsight-safe-cleaner';
        st.textContent = hideCSS;
        root.shadowRoot.appendChild(st);
      }
      injectIntoShadows(root.shadowRoot);
    }
    
    // Also safely hide specific elements without touching parents
    if (root.querySelectorAll) {
      root.querySelectorAll('[class*="elfsight-app"]').forEach(widget => {
         // Only search INSIDE the widget
         const walker = document.createTreeWalker(widget, NodeFilter.SHOW_TEXT, null, false);
         let n;
         while(n = walker.nextNode()) {
           if (n.nodeValue.includes("What Our Customers Say") || n.nodeValue.includes("Free Google Reviews") || n.nodeValue.includes("Reviews Widget")) {
              if (n.parentElement && n.parentElement.tagName !== 'BODY') {
                  n.parentElement.style.setProperty('display', 'none', 'important');
              }
           }
         }
         
         // If widget has shadowRoot, search there too safely
         if (widget.shadowRoot) {
           const sWalker = document.createTreeWalker(widget.shadowRoot, NodeFilter.SHOW_TEXT, null, false);
           let sn;
           while(sn = sWalker.nextNode()) {
             if (sn.nodeValue.includes("What Our Customers Say") || sn.nodeValue.includes("Free Google Reviews") || sn.nodeValue.includes("Reviews Widget")) {
                if (sn.parentElement && sn.parentElement.tagName !== 'BODY') {
                    sn.parentElement.style.setProperty('display', 'none', 'important');
                }
             }
           }
         }
      });
    }

    if (root.childNodes) {
      root.childNodes.forEach(child => injectIntoShadows(child));
    }
  }

  injectIntoShadows(document.body || document.documentElement);
}

// Run immediately
cleanAllElfsight();

// Run frequently during page lifecycle
const elfsightInterval = setInterval(cleanAllElfsight, 250);
setTimeout(() => {
  clearInterval(elfsightInterval);
  setInterval(cleanAllElfsight, 1500);
}, 8000);

// Observer for any new DOM insertions
const elfsightObserver = new MutationObserver(function() {
  cleanAllElfsight();
});
elfsightObserver.observe(document.documentElement, { childList: true, subtree: true });
"""

pattern = r'// ── Hide Elfsight Watermarks & Title Overrides ───────────────────────────────────.*?elfsightObserver\.observe\(document\.documentElement, \{ childList: true, subtree: true, attributes: true \}\);\n\nwindow\.addEventListener\(\'load\', cleanAllElfsight\);\nwindow\.addEventListener\(\'scroll\', cleanAllElfsight, \{ passive: true \}\);'

content = re.sub(pattern, safe_js, content, flags=re.DOTALL)

with open('script.js', 'w', encoding='utf-8') as f:
    f.write(content)

print("Script fixed")
