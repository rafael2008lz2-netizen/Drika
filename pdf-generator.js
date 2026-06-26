document.addEventListener('DOMContentLoaded', () => {
  const downloadBtns = document.querySelectorAll('.download-pdf-trigger');

  downloadBtns.forEach(btn => {
    btn.addEventListener('click', async function () {
      const originalHTML = btn.innerHTML;
      btn.innerHTML = 'Gerando PDF...';
      btn.disabled = true;

      try {
        await gerarCatalogoPDF();
      } catch (err) {
        console.error('Erro ao gerar PDF:', err);
        alert('Ocorreu um erro ao gerar o PDF. Tente novamente.');
      }

      btn.innerHTML = originalHTML;
      btn.disabled = false;
    });
  });

  // ─── Helpers ─────────────────────────────────────────────────
  function loadImage(src) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error('Falha ao carregar: ' + src));
      img.src = src;
    });
  }

  function imgToDataURL(img) {
    const canvas = document.createElement('canvas');
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0);
    return canvas.toDataURL('image/jpeg', 0.92);
  }

  // ─── Main generator ─────────────────────────────────────────
  async function gerarCatalogoPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

    const pageW = 210;
    const pageH = 297;
    const margin = 12;
    const cols = 3;
    const gap = 8;
    const cardW = (pageW - margin * 2 - gap * (cols - 1)) / cols;
    const imgH = 50;    // height for product image area
    const textH = 22;   // space for name + price
    const cardH = imgH + textH;

    // ── Collect products from DOM ──
    const cards = document.querySelectorAll('.product-card');
    const products = [];

    cards.forEach(card => {
      // skip the custom "Não encontrou" card
      if (card.querySelector('.product-card-name') &&
          card.querySelector('.product-card-name').textContent.includes('Não encontrou')) return;

      const imgEl = card.querySelector('.product-card-image img');
      const nameEl = card.querySelector('.product-card-name');
      const priceEl = card.querySelector('.product-price');

      if (!imgEl || !nameEl) return;

      let priceText = '';
      if (priceEl) {
        priceText = priceEl.textContent.replace(/\s+/g, '').trim();
      }

      products.push({
        imgSrc: imgEl.src,
        name: nameEl.textContent.trim(),
        price: priceText ? 'A partir de ' + priceText : ''
      });
    });

    // ── Pre-load all images ──
    const loadedImages = [];
    for (const p of products) {
      try {
        const img = await loadImage(p.imgSrc);
        loadedImages.push({ ...p, img });
      } catch {
        // if image fails, still include product but without image
        loadedImages.push({ ...p, img: null });
      }
    }

    // ── Draw pages ──
    let x = margin;
    let y = margin;
    let col = 0;
    let isFirstPage = true;

    function drawBackground() {
      doc.setFillColor(15, 17, 21); // #0f1115
      doc.rect(0, 0, pageW, pageH, 'F');
    }

    function drawHeader() {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(22);
      doc.setTextColor(255, 255, 255);
      doc.text('Drika Ateliê', pageW / 2, 18, { align: 'center' });

      doc.setFontSize(10);
      doc.setTextColor(180, 180, 200);
      doc.text('Catálogo de Produtos', pageW / 2, 25, { align: 'center' });

      // gold line
      doc.setDrawColor(255, 215, 0);
      doc.setLineWidth(0.6);
      doc.line(pageW / 2 - 20, 28, pageW / 2 + 20, 28);
    }

    function drawFooter() {
      doc.setFontSize(7);
      doc.setTextColor(120, 120, 140);
      doc.text('WhatsApp: (16) 98833-6070  |  Ribeirão Preto - SP  |  @drika.atelie', pageW / 2, pageH - 6, { align: 'center' });
    }

    // First page
    drawBackground();
    drawHeader();
    drawFooter();
    y = 34; // start below header

    for (let i = 0; i < loadedImages.length; i++) {
      const p = loadedImages[i];

      // Check if we need a new row
      if (col >= cols) {
        col = 0;
        x = margin;
        y += cardH + gap;
      }

      // Check if card fits on page
      if (y + cardH > pageH - 14) {
        doc.addPage();
        drawBackground();
        drawFooter();
        y = margin;
        col = 0;
        x = margin;
      }

      // ── Draw card background ──
      doc.setFillColor(26, 29, 36); // #1a1d24
      doc.roundedRect(x, y, cardW, cardH, 3, 3, 'F');

      // ── Draw product image ──
      if (p.img) {
        try {
          const dataURL = imgToDataURL(p.img);
          // Calculate aspect-fitted dimensions inside card
          const aspect = p.img.naturalWidth / p.img.naturalHeight;
          let drawW = cardW - 6;
          let drawH = drawW / aspect;
          if (drawH > imgH - 4) {
            drawH = imgH - 4;
            drawW = drawH * aspect;
          }
          const imgX = x + (cardW - drawW) / 2;
          const imgY = y + (imgH - drawH) / 2;
          doc.addImage(dataURL, 'JPEG', imgX, imgY, drawW, drawH);
        } catch (e) {
          // silently skip image
        }
      }

      // ── Draw product name ──
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.setTextColor(255, 255, 255);
      const nameLines = doc.splitTextToSize(p.name, cardW - 6);
      doc.text(nameLines, x + 3, y + imgH + 5);

      // ── Draw product price ──
      if (p.price) {
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(7);
        doc.setTextColor(180, 180, 200);
        doc.text(p.price, x + 3, y + imgH + 13);
      }

      // Move to next column
      x += cardW + gap;
      col++;
    }

    doc.save('Catalogo_Drika_Atelie.pdf');
  }
});
