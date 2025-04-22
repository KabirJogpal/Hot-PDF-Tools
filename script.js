
// UI Elements
// Use event delegation for better performance
document.addEventListener('DOMContentLoaded', () => {
    // Cache DOM elements
    const navBrand = document.querySelector('.nav-brand');
    const progressBar = document.querySelector('.progress-bar-fill');
    const heroSubtitle = document.querySelector('.hero-subtitle');
    
    navBrand.addEventListener('click', () => {
      showTab('home');
    });
    
    // Set initial quote
    heroSubtitle.textContent = quotes[Math.floor(Math.random() * quotes.length)];
  });
  
  // Tab functionality
  function showTab(tabId) {
    document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
    document.querySelectorAll('.nav-link').forEach(link => link.classList.remove('active'));
    
    document.getElementById(tabId).classList.add('active');
    document.querySelector(`[data-tab="${tabId}"]`).classList.add('active');
  }
  
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      showTab(link.getAttribute('data-tab'));
    });
  });
  
  // PDF Merger
  const pdfDropZone = document.getElementById('pdfDropZone');
  const pdfInput = document.getElementById('pdfInput');
  const mergeBtn = document.getElementById('mergeBtn');
  let pdfsToMerge = [];
  
  pdfDropZone.addEventListener('click', () => pdfInput.click());
  pdfDropZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    pdfDropZone.style.borderColor = 'var(--secondary-color)';
  });
  
  pdfDropZone.addEventListener('dragleave', () => {
    pdfDropZone.style.borderColor = 'var(--primary-color)';
  });
  
  pdfDropZone.addEventListener('drop', (e) => {
    e.preventDefault();
    pdfDropZone.style.borderColor = 'var(--primary-color)';
    handlePDFFiles(e.dataTransfer.files);
  });
  
  pdfInput.addEventListener('change', (e) => {
    handlePDFFiles(e.target.files);
  });
  
  function handlePDFFiles(files) {
    const invalidFiles = Array.from(files).filter(file => !file.type.includes('pdf'));
    if (invalidFiles.length > 0) {
      alert('Warning: Some files were not PDFs and will be ignored');
    }
    
    pdfsToMerge = Array.from(files).filter(file => file.type.includes('pdf'));
    if (pdfsToMerge.length > 0) {
      const totalSize = pdfsToMerge.reduce((sum, file) => sum + file.size, 0);
      const sizeMB = (totalSize / (1024 * 1024)).toFixed(2);
      pdfDropZone.innerHTML = `${pdfsToMerge.length} PDFs selected<br>Total size: ${sizeMB} MB`;
    } else {
      pdfDropZone.textContent = 'Drop PDF files here or click to select';
    }
  }
  
  mergeBtn.addEventListener('click', async () => {
    if (pdfsToMerge.length < 2) {
      alert('Please select at least 2 PDF files to merge');
      return;
    }
  
    const mergedPdf = await PDFLib.PDFDocument.create();
    const progressBar = document.querySelector('.progress-bar-fill');
    
    mergeBtn.disabled = true;
    mergeBtn.querySelector('.loading-spinner').style.display = 'inline-block';
    
    try {
      for (let i = 0; i < pdfsToMerge.length; i++) {
        const file = pdfsToMerge[i];
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await PDFLib.PDFDocument.load(arrayBuffer);
        const pages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
        pages.forEach(page => mergedPdf.addPage(page));
        
        progressBar.style.width = `${((i + 1) / pdfsToMerge.length) * 100}%`;
      }
  
      const mergedPdfFile = await mergedPdf.save();
      const blob = new Blob([mergedPdfFile], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      
      const fileSize = (blob.size / 1024).toFixed(2);
      alert(`Merged PDF created! File size: ${fileSize} KB`);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = 'merged.pdf';
      link.click();
      
      URL.revokeObjectURL(url);
      progressBar.style.width = '0%';
      pdfsToMerge = [];
      pdfDropZone.textContent = 'Drop PDF files here or click to select';
    } catch (error) {
      alert('Error merging PDFs: ' + error.message);
    } finally {
      mergeBtn.disabled = false;
      mergeBtn.querySelector('.loading-spinner').style.display = 'none';
    }
  });
  
  // Image to PDF Converter
  const imageInput = document.getElementById('imageInput');
  const convertToPdfBtn = document.getElementById('convertToPdfBtn');
  
  convertToPdfBtn.addEventListener('click', async () => {
    const files = imageInput.files;
    if (files.length === 0) {
      alert('Please select at least one image');
      return;
    }
  
    convertToPdfBtn.disabled = true;
    
    try {
      const pdfDoc = await PDFLib.PDFDocument.create();
      
      for (const file of files) {
        const imageBytes = await file.arrayBuffer();
        let image;
        
        if (file.type.includes('png')) {
          image = await pdfDoc.embedPng(imageBytes);
        } else if (file.type.includes('jpg') || file.type.includes('jpeg')) {
          image = await pdfDoc.embedJpg(imageBytes);
        } else {
          continue;
        }
        
        const page = pdfDoc.addPage([image.width, image.height]);
        page.drawImage(image, {
          x: 0,
          y: 0,
          width: image.width,
          height: image.height,
        });
      }
      
      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      
      const fileSize = (blob.size / 1024).toFixed(2);
      alert(`PDF created! File size: ${fileSize} KB`);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = 'converted_images.pdf';
      link.click();
      
      URL.revokeObjectURL(url);
      imageInput.value = '';
    } catch (error) {
      alert('Error converting images to PDF: ' + error.message);
    } finally {
      convertToPdfBtn.disabled = false;
    }
  });
  
  // PDF Compressor
  const pdfCompressInput = document.getElementById('pdfCompressInput');
  const compressionLevel = document.getElementById('compressionLevel');
  const compressBtn = document.getElementById('compressBtn');
  
  compressBtn.addEventListener('click', async () => {
    if (!pdfCompressInput.files[0]) {
      alert('Please select a PDF file to compress');
      return;
    }
  
    compressBtn.disabled = true;
    
    try {
      const file = pdfCompressInput.files[0];
      const arrayBuffer = await file.arrayBuffer();
      const pdfDoc = await PDFLib.PDFDocument.load(arrayBuffer);
      
      // Apply compression based on selected level
      const level = compressionLevel.value;
      const options = {
        useObjectStreams: true,
        addDefaultPage: false,
      };
      
      if (level === 'high') {
        options.objectsPerTick = 50;
      } else if (level === 'medium') {
        options.objectsPerTick = 100;
      }
      
      const compressedBytes = await pdfDoc.save(options);
      const blob = new Blob([compressedBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      
      const fileSize = (blob.size / 1024).toFixed(2);
      const originalSize = (file.size / 1024).toFixed(2);
      const reduction = (100 - (blob.size / file.size * 100)).toFixed(1);
      alert(`Compression complete!\nOriginal size: ${originalSize} KB\nNew size: ${fileSize} KB\nReduction: ${reduction}%`);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = 'compressed.pdf';
      link.click();
      
      URL.revokeObjectURL(url);
      pdfCompressInput.value = '';
    } catch (error) {
      alert('Error compressing PDF: ' + error.message);
    } finally {
      compressBtn.disabled = false;
    }
  });
  
  // Initialize with a random quote
  const quotes = [
    "Transform Your PDFs with Ease! 📄✨",
    "Professional PDF Tools at Your Fingertips 🚀",
    "Edit, Merge, Convert - All in One Place 🎯",
    "Your PDF Solutions, Our Priority 💫",
  ];
  
  document.querySelector('.hero-subtitle').textContent = 
    quotes[Math.floor(Math.random() * quotes.length)];
  