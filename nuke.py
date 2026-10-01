import re

with open('script.js', 'r', encoding='utf-8') as f:
    content = f.read()

# Let's replace the whole Elfsight script with a foolproof nuke
foolproof = '''// ── Hide Elfsight Watermarks & Title Overrides ───────────────────────────────────
(function() {
  const BADGE_TEXTS = ['free google', 'reviews widget', 'free instagram'];
  
  function nukeElfsight(root) {
    if (!root) return;
    
    try {
      // 1. Nuke IFrames related to elfsight (except the main widget container if it's one, but usually it's not)
      const frames = root.querySelectorAll('iframe');
      frames.forEach(f => {
         if (f.src && (f.src.includes('elfsight') || f.src.includes('elfsig.ht'))) {
            // Check if it's small (a badge)
            if (f.offsetWidth < 300 || f.offsetHeight < 100) {
                f.remove();
            }
         }
      });
      
      // 2. Scan all elements for text
      const elements = root.querySelectorAll('a, div, span');
      elements.forEach(el => {
          if (!el.textContent) return;
          const text = el.textContent.toLowerCase();
          
          let hasBadgeText = false;
          for (let t of BADGE_TEXTS) {
              if (text.includes(t)) {
                  hasBadgeText = true;
                  break;
              }
          }
          
          if (hasBadgeText) {
              // Hide it instantly
              el.style.setProperty('display', 'none', 'important');
              el.style.setProperty('opacity', '0', 'important');
              
              // If it's a link or fixed position, it's definitely the badge wrapper, so remove it
              const style = window.getComputedStyle(el);
              if (el.tagName === 'A' || style.position === 'fixed' || style.position === 'absolute') {
                  el.remove(); // BE GONE!
              }
          }
      });
      
      // 3. Nuke specific known elfsight links
      root.querySelectorAll('a[href*="elfsight"], a[href*="elfsig.ht"]').forEach(a => a.remove());
      
    } catch (e) {}

    // Recurse into shadow roots
    if (root.shadowRoot) nukeElfsight(root.shadowRoot);
    if (window._allShadows) {
        window._allShadows.forEach(sr => nukeElfsight(sr));
    }
    
    // Recurse into children
    try {
      if (root.childNodes) {
          root.childNodes.forEach(child => {
             if (child.nodeType === 1) nukeElfsight(child);
          });
      }
    } catch (e) {}
  }

  function runNuke() {
      nukeElfsight(document.body || document.documentElement);
  }

  // Run immediately and repeatedly
  runNuke();
  setInterval(runNuke, 100); // Very aggressive
  
  // Observer for any new DOM insertions
  const observer = new MutationObserver(runNuke);
  observer.observe(document.documentElement, { childList: true, subtree: true });
})();
'''

# Replace everything from function cleanAllElfsight to the end
content = re.sub(r'function cleanAllElfsight.*?\}\s*\);\n*$', foolproof, content, flags=re.DOTALL)

with open('script.js', 'w', encoding='utf-8') as f:
    f.write(content)

print("Foolproof nuke installed")
