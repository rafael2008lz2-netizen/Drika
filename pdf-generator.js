document.addEventListener('DOMContentLoaded', () => {
  const downloadBtns = document.querySelectorAll('.download-pdf-trigger');
  
  downloadBtns.forEach(downloadBtn => {
    downloadBtn.addEventListener('click', function() {
      // Change button state to loading
      const originalText = downloadBtn.innerHTML;
      downloadBtn.innerHTML = `
        <svg class="spinner" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="animation: spin 1s linear infinite;"><path d="M21 12a9 9 0 1 1-6.219-8.56"></path></svg>
        <style>@keyframes spin { 100% { transform: rotate(360deg); } }</style>
        Gerando PDF...
      `;
      downloadBtn.disabled = true;

      // Select the catalog container to convert
      // We take the product grid part
      const catalogSection = document.querySelector('.catalog-section .container').cloneNode(true);
      
      // Let's create a temporary wrapper for the PDF to ensure it has a good background
      // and layout for A4 size.
      const printWrapper = document.createElement('div');
      printWrapper.style.backgroundColor = '#0f1115'; // Dark background
      printWrapper.style.color = '#ffffff';
      printWrapper.style.padding = '20px';
      printWrapper.style.width = '1000px'; // Fixed width to ensure grid columns look good
      
      // Add custom styles for printing to ensure images and grid look right
      const styleNode = document.createElement('style');
      styleNode.textContent = `
        * {
          opacity: 1 !important;
          transform: none !important;
          animation: none !important;
          transition: none !important;
        }
        .product-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr) !important;
          gap: 20px !important;
        }
        .product-card {
          page-break-inside: avoid;
          background: #1a1d24 !important;
          border: 1px solid rgba(255,215,0,0.1) !important;
          padding: 15px !important;
          border-radius: 12px !important;
          margin-bottom: 20px !important;
        }
        .product-card-image img {
          max-width: 100% !important;
          height: 200px !important;
          object-fit: contain !important;
        }
        .product-cta {
          display: none !important; /* Hide whatsapp buttons in PDF */
        }
        .gold-text {
          color: #FFD700 !important;
        }
        .section-title {
          text-align: center;
          font-size: 2rem !important;
          color: #ffffff;
        }
        .section-subtitle {
          text-align: center;
          color: #a0aabf;
          margin-bottom: 30px;
        }
        .gold-line {
          height: 2px;
          background: #FFD700;
          width: 50px;
          margin: 10px auto;
        }
      `;
      printWrapper.appendChild(styleNode);
      printWrapper.appendChild(catalogSection);

      // Append to body temporarily (hidden via z-index and opacity so html2canvas can read it)
      printWrapper.style.position = 'absolute';
      printWrapper.style.top = '0';
      printWrapper.style.left = '0';
      printWrapper.style.zIndex = '-9999';
      document.body.appendChild(printWrapper);

      // html2pdf options
      const opt = {
        margin:       10,
        filename:     'Catalogo_Drika_Atelie.pdf',
        image:        { type: 'jpeg', quality: 0.98 },
        html2canvas:  { scale: 2, useCORS: true, logging: false },
        jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
      };

      // Generate PDF
      html2pdf().set(opt).from(printWrapper).save().then(() => {
        // Restore button state
        downloadBtn.innerHTML = originalText;
        downloadBtn.disabled = false;
        
        // Remove temporary wrapper
        document.body.removeChild(printWrapper);
      }).catch(err => {
        console.error("Erro ao gerar PDF:", err);
        downloadBtn.innerHTML = originalText;
        downloadBtn.disabled = false;
        alert("Ocorreu um erro ao gerar o PDF. Tente novamente.");
      });
    });
  });
});
