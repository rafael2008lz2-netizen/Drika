import re

with open('script.js', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace the global scanner
new_scanner = '''
    // ALSO scan globally for the floating badge which might be appended directly to BODY
    const allLinks = document.querySelectorAll('a, div, span');
    allLinks.forEach(el => {
        if (!el.textContent) return;
        const text = el.textContent.toLowerCase();
        if (text.includes('free google') || text.includes('reviews widget') || text.includes('free instagram')) {
            const style = window.getComputedStyle(el);
            // Floating badges usually have fixed/absolute positioning and high z-index
            if (el.tagName === 'A' || style.position === 'fixed' || style.position === 'absolute' || (el.className && typeof el.className === 'string' && (el.className.toLowerCase().includes('badge') || el.className.toLowerCase().includes('watermark')))) {
                el.style.setProperty('display', 'none', 'important');
                el.style.setProperty('opacity', '0', 'important');
                el.style.setProperty('visibility', 'hidden', 'important');
                el.style.setProperty('pointer-events', 'none', 'important');
                el.style.setProperty('z-index', '-9999', 'important');
            }
        }
    });

    // Nuclear option for any div that looks like the widget badge based on inline styles
    document.querySelectorAll('div, a').forEach(el => {
        const style = window.getComputedStyle(el);
        if (style.position === 'fixed' || style.position === 'absolute') {
            if (style.zIndex && parseInt(style.zIndex, 10) > 9999) {
                // If it's a fixed element with huge z-index and contains an SVG or Elfsight link, kill it
                if (el.innerHTML.includes('elfsight') || (el.textContent && el.textContent.toLowerCase().includes('free '))) {
                    el.style.setProperty('display', 'none', 'important');
                }
            }
        }
    });
'''

# Find the old global scanner and replace it
# We know it starts with "// ALSO scan globally" and ends with "});" before "// Observer for any new DOM insertions"
content = re.sub(r'// ALSO scan globally.*?}\s*\);', new_scanner, content, flags=re.DOTALL)

with open('script.js', 'w', encoding='utf-8') as f:
    f.write(content)

print("Brutal scanner added")
