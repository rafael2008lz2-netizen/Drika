import re

with open('script.js', 'r', encoding='utf-8') as f:
    content = f.read()

replacement = '''         // Only search INSIDE the widget
         const walker = document.createTreeWalker(widget, NodeFilter.SHOW_TEXT, null, false);
         let n;
         while(n = walker.nextNode()) {
           if (n.nodeValue.includes("What Our Customers Say") || n.nodeValue.includes("Free Google Reviews") || n.nodeValue.includes("Reviews Widget")) {
              let p = n.parentElement;
              while(p && p.tagName !== 'BODY' && p.tagName !== 'HTML') {
                  p.style.setProperty('display', 'none', 'important');
                  p.style.setProperty('opacity', '0', 'important');
                  
                  // Stop going up if we hit the widget container to avoid hiding the whole site
                  if (p.classList && (p.classList.contains('elfsight-app-a5fbc70a-14f3-4f63-be5e-82d772f58d6d') || p.classList.contains('elfsight-widget-container'))) {
                      break;
                  }
                  
                  // For the badge, stop when we hit the fixed positioned wrapper or link
                  if (n.nodeValue.includes("Free Google") || n.nodeValue.includes("Reviews Widget")) {
                      if (p.tagName === 'A' || p.tagName === 'IFRAME') break;
                      const style = window.getComputedStyle(p);
                      if (style.position === 'fixed' || style.position === 'absolute') break;
                  } else {
                      // For title, stop if it's a heading container
                      if (p.tagName === 'H1' || p.tagName === 'H2' || p.tagName === 'H3' || p.tagName === 'H4' || p.tagName === 'H5' || p.tagName === 'H6') break;
                      if (p.className && typeof p.className === 'string' && (p.className.includes('Header') || p.className.includes('Title'))) break;
                  }
                  
                  p = p.parentElement;
              }
           }
         }'''

# Replace the inner block of the light DOM walker
content = re.sub(
    r'// Only search INSIDE the widget.*?if \(n\.parentElement && n\.parentElement\.tagName !== \'BODY\'\) {[^}]*}[^}]*\}',
    replacement,
    content,
    flags=re.DOTALL
)

# And do the same for the shadow DOM walker
replacement_shadow = replacement.replace('// Only search INSIDE the widget', '// If widget has shadowRoot, search there too safely').replace('walker = document.createTreeWalker(widget', 'sWalker = document.createTreeWalker(widget.shadowRoot').replace('walker.nextNode', 'sWalker.nextNode')

content = re.sub(
    r'// If widget has shadowRoot, search there too safely.*?if \(sn\.parentElement && sn\.parentElement\.tagName !== \'BODY\'\) {[^}]*}[^}]*\}',
    replacement_shadow,
    content,
    flags=re.DOTALL
)

with open('script.js', 'w', encoding='utf-8') as f:
    f.write(content)

print("Script upgraded")
