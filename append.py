import re

with open('script.js', 'r', encoding='utf-8') as f:
    content = f.read()

perfect = '''// ── Hide Elfsight Watermarks & Title Overrides ───────────────────────────────────
(function() {
  function removeElfsight() {
    // 1. Find all Anchor tags (links) and hide them if they contain badge text
    document.querySelectorAll('a').forEach(a => {
      const text = (a.textContent || '').toLowerCase();
      if (text.includes('free google') || text.includes('reviews widget') || text.includes('free instagram')) {
         a.style.setProperty('display', 'none', 'important');
         a.style.setProperty('opacity', '0', 'important');
         a.style.setProperty('pointer-events', 'none', 'important');
         a.remove(); // safe to remove an A tag
      }
    });

    // 2. Hide titles and inner badges safely
    const walker = document.createTreeWalker(
      document.body || document.documentElement, 
      NodeFilter.SHOW_TEXT, 
      null, 
      false
    );
    
    let n;
    while (n = walker.nextNode()) {
      const val = (n.nodeValue || '').toLowerCase();
      if (val.includes('free google') || val.includes('reviews widget') || val.includes('what our customers say')) {
        let p = n.parentElement;
        
        // Safety check: never hide structural elements
        if (p && !['BODY','MAIN','SECTION','HTML','HEAD'].includes(p.tagName)) {
           // Hide immediate parent text container
           p.style.setProperty('display', 'none', 'important');
           
           // Look up exactly 1-3 levels to find the floating wrapper and kill it
           let wrapper = p;
           let depth = 0;
           while (wrapper && !['BODY','MAIN','SECTION'].includes(wrapper.tagName) && depth < 4) {
               const style = window.getComputedStyle(wrapper);
               if (wrapper.tagName === 'A' || style.position === 'fixed' || style.position === 'absolute') {
                   wrapper.style.setProperty('display', 'none', 'important');
                   break;
               }
               wrapper = wrapper.parentElement;
               depth++;
           }
        }
      }
    }
    
    // 3. Remove by fixed z-index heuristics
    document.querySelectorAll('div, a, span').forEach(el => {
      try {
        const style = window.getComputedStyle(el);
        if (style.position === 'fixed' || style.position === 'absolute') {
          if (style.zIndex && parseInt(style.zIndex, 10) > 9999) {
            const html = el.innerHTML.toLowerCase();
            if (html.includes('elfsight') || html.includes('free google') || html.includes('reviews widget')) {
                el.style.setProperty('display', 'none', 'important');
            }
          }
        }
      } catch (e) {}
    });
  }

  removeElfsight();
  setInterval(removeElfsight, 500); // Check every half second

  const observer = new MutationObserver(removeElfsight);
  observer.observe(document.documentElement, { childList: true, subtree: true });
})();
'''

content = re.sub(r'// ── Hide Elfsight Watermarks & Title Overrides.*$', perfect, content, flags=re.DOTALL)

with open('script.js', 'w', encoding='utf-8') as f:
    f.write(content)

print("Properly appended")
