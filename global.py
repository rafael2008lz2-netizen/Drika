import re

with open('script.js', 'r', encoding='utf-8') as f:
    content = f.read()

# Add a global scanner for the floating badge
global_scanner = '''
    // ALSO scan globally for the floating badge which might be appended directly to BODY
    const allLinks = document.querySelectorAll('a, div');
    allLinks.forEach(el => {
        if (el.textContent && (el.textContent.includes('Free Google Reviews Widget') || el.textContent.includes('Free Instagram Feed') || el.textContent.includes('Reviews Widget'))) {
            const style = window.getComputedStyle(el);
            // Floating badges usually have fixed/absolute positioning and high z-index
            if (el.tagName === 'A' || style.position === 'fixed' || style.position === 'absolute' || (el.className && typeof el.className === 'string' && el.className.includes('badge'))) {
                el.style.setProperty('display', 'none', 'important');
                el.style.setProperty('opacity', '0', 'important');
                el.style.setProperty('visibility', 'hidden', 'important');
                el.style.setProperty('pointer-events', 'none', 'important');
            }
        }
    });
'''

# insert before if (root.childNodes) {
content = content.replace('if (root.childNodes) {', global_scanner + '\n    if (root.childNodes) {')

with open('script.js', 'w', encoding='utf-8') as f:
    f.write(content)

print("Global scanner added")
