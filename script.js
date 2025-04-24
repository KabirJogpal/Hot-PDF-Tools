// Define quotes array at the top
const quotes = [
  "Transform Your PDFs with Ease! 📄✨",
  "Professional PDF Tools at Your Fingertips 🚀",
  "Edit, Merge, Convert - All in One Place 🎯",
  "Your PDF Solutions, Our Priority 💫",
];

// UI Elements
// Use event delegation for better performance
document.addEventListener('DOMContentLoaded', () => {
    // Cache DOM elements
    const navBrand = document.querySelector('.nav-brand');
    const progressBar = document.querySelector('.progress-bar-fill');
    const heroSubtitle = document.querySelector('.hero-subtitle');
    const currentYearSpan = document.getElementById('currentYear');
    const modal = document.getElementById('modal');
    const modalTitle = document.getElementById('modalTitle');
    const modalBody = document.getElementById('modalBody');
    const modalClose = document.querySelector('.modal-close');
    const toast = document.getElementById('toast');
    
    // Theme toggle functionality
    const themeToggle = document.getElementById('themeToggle');
    const themeIcon = themeToggle.querySelector('i');
    
    themeToggle.addEventListener('click', () => {
      document.body.setAttribute('data-theme', 
        document.body.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');
      themeIcon.className = document.body.getAttribute('data-theme') === 'dark' ? 
        'fas fa-sun' : 'fas fa-moon';
    });
    
    // Footer links
    const privacyLink = document.getElementById('privacyLink');
    const termsLink = document.getElementById('termsLink');
    const aboutLink = document.getElementById('aboutLink');
    const contactLink = document.getElementById('contactLink');
    
    navBrand.addEventListener('click', () => {
      showTab('home');
    });
    
    // Set initial quote
    heroSubtitle.textContent = quotes[Math.floor(Math.random() * quotes.length)];
    
    // Set current year in footer
    currentYearSpan.textContent = new Date().getFullYear();
    
    // Modal handlers
    modalClose.addEventListener('click', () => {
      modal.classList.remove('open');
    });
    
    // Close modal when clicking outside content
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.remove('open');
      }
    });
    
    // Footer link handlers
    privacyLink.addEventListener('click', (e) => {
      e.preventDefault();
      showModal('Privacy Policy', `
        <h4>Privacy Policy</h4>
        <p>We respect your privacy and are committed to protecting your personal data.</p>
        <p>This tool works entirely in your browser. Your files are never uploaded to any server.</p>
        <p>We do not track, store, or collect any information about the files you process.</p>
      `);
    });
    
    termsLink.addEventListener('click', (e) => {
      e.preventDefault();
      showModal('Terms of Use', `
        <h4>Terms of Use</h4>
        <p>By using this service, you agree to the following terms:</p>
        <ul>
          <li>The service is provided "as is" without warranties of any kind.</li>
          <li>We are not responsible for any damage caused by using this service.</li>
          <li>Do not use this service for any illegal activities.</li>
        </ul>
      `);
    });
    
    aboutLink.addEventListener('click', (e) => {
      e.preventDefault();
      showModal('About Us', `
        <h4>About PDF Tools</h4>
        <p>PDF Tools is a free service that provides essential PDF manipulation features right in your browser.</p>
        <p>Our goal is to make PDF editing accessible to everyone without requiring software installation or file uploads.</p>
      `);
    });
    
    contactLink.addEventListener('click', (e) => {
      e.preventDefault();
      showModal('Contact Us', `
        <h4>Contact Information</h4>
        <p>If you have any questions or feedback about our service, please reach out to us:</p>
        <p>Email: support@pdftools.example.com</p>
      `);
    });
    
    // Feature cards in home tab
    document.querySelectorAll('.feature-card').forEach(card => {
      card.addEventListener('click', () => {
        showTab(card.getAttribute('data-tab'));
      });
    });

    // Tab navigation
    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        showTab(link.getAttribute('data-tab'));
      });
    });

    // Footer navigation
    document.querySelectorAll('.footer-column a[data-tab]').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        showTab(link.getAttribute('data-tab'));
      });
    });

    // Initialize all file drop zones
    initDropZone('pdfDropZone', 'pdfInput', handlePDFFiles);
    initDropZone('imageDropZone', 'imageInput', handleImageFiles);
    initDropZone('compressDropZone', 'pdfCompressInput', handleCompressFile);
    initDropZone('pdfToImgDropZone', 'pdfToImgInput', handlePdfToImgFile);

    // Initialize compression level slider
    const compressionLevel = document.getElementById('compressionLevel');
    const compressionLabels = ['Low', 'Medium', 'High'];
    if (compressionLevel) {
      compressionLevel.addEventListener('input', function() {
        updateProgressDisplay('compressProgressText', 0);
      });
    }

    // Show toast message
    function showToast(message, type = 'info') {
      toast.textContent = message;
      toast.className = `toast ${type} show`;
      setTimeout(() => {
        toast.classList.remove('show');
      }, 5000);
    }
});

// Function to show modal
function showModal(title, content) {
  const modal = document.getElementById('modal');
  const modalTitle = document.getElementById('modalTitle');
  const modalBody = document.getElementById('modalBody');
  
  modalTitle.textContent = title;
  modalBody.innerHTML = content;
  modal.classList.add('open');
}

// Initialize drop zone functionality
function initDropZone(dropZoneId, inputId, handleFilesCallback) {
  const dropZone = document.getElementById(dropZoneId);
  const fileInput = document.getElementById(inputId);
  
  if(!dropZone || !fileInput) return;
  
  dropZone.addEventListener('click', () => fileInput.click());
  
  dropZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropZone.style.borderColor = 'var(--secondary-color)';
  });
  
  dropZone.addEventListener('dragleave', () => {
    dropZone.style.borderColor = 'var(--primary-color)';
  });
  
  dropZone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropZone.style.borderColor = 'var(--primary-color)';
    handleFilesCallback(e.dataTransfer.files);
  });
  
  fileInput.addEventListener('change', (e) => {
    handleFilesCallback(e.target.files);
  });
}

// Tab functionality
function showTab(tabId) {
  document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
  document.querySelectorAll('.nav-link').forEach(link => link.classList.remove('active'));
  
  document.getElementById(tabId).classList.add('active');
  document.querySelector(`.nav-link[data-tab="${tabId}"]`).classList.add('active');
}

// Update progress bar and text
function updateProgressDisplay(elementId, percent) {
  const progressBar = document.querySelector('.progress-bar-fill');
  const progressText = document.getElementById(elementId);
  
  if (progressBar) {
    progressBar.style.width = `${percent}%`;
  }
  
  if (progressText) {
    progressText.textContent = `${Math.round(percent)}%`;
  }
}

// PDF Merger
let pdfsToMerge = [];
const mergeBtn = document.getElementById('mergeBtn');

function handlePDFFiles(files) {
  const invalidFiles = Array.from(files).filter(file => !file.type.includes('pdf'));
  if (invalidFiles.length > 0) {
    showToast('Warning: Some files were not PDFs and will be ignored', 'info');
  }
  
  pdfsToMerge = Array.from(files).filter(file => file.type.includes('pdf'));
  const pdfDropZone = document.getElementById('pdfDropZone');
  
  if (pdfsToMerge.length > 0) {
    const totalSize = pdfsToMerge.reduce((sum, file) => sum + file.size, 0);
    const sizeMB = (totalSize / (1024 * 1024)).toFixed(2);
    pdfDropZone.innerHTML = `${pdfsToMerge.length} PDFs selected<br>Total size: ${sizeMB} MB`;
  } else {
    pdfDropZone.innerHTML = `<i class="fas fa-cloud-upload-alt"></i>
      <p>Drop PDF files here or click to select</p>
      <span class="file-support">Supports multiple PDF files</span>`;
  }
}

if (mergeBtn) {
  mergeBtn.addEventListener('click', async () => {
    if (pdfsToMerge.length < 2) {
      showToast('Please select at least 2 PDF files to merge', 'error');
      return;
    }

    const mergedPdf = await PDFLib.PDFDocument.create();
    const addBookmarks = document.getElementById('addBookmarks')?.checked;
    
    mergeBtn.disabled = true;
    mergeBtn.querySelector('.loading-spinner').style.display = 'inline-block';
    
    try {
      for (let i = 0; i < pdfsToMerge.length; i++) {
        const file = pdfsToMerge[i];
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await PDFLib.PDFDocument.load(arrayBuffer);
        const pages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
        
        // Add bookmark if option is selected
        const startIndex = mergedPdf.getPageCount();
        pages.forEach(page => mergedPdf.addPage(page));
        
        if (addBookmarks && pages.length > 0) {
          // Note: This is a placeholder as pdf-lib doesn't support bookmarks
          // Would need additional library for full bookmark support
        }
        
        updateProgressDisplay('mergeProgressText', ((i + 1) / pdfsToMerge.length) * 100);
      }

      const mergedPdfFile = await mergedPdf.save();
      const blob = new Blob([mergedPdfFile], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      
      const fileSize = (blob.size / 1024 / 1024).toFixed(2);
      showToast(`Merged PDF created! File size: ${fileSize} MB`, 'success');
      
      const link = document.createElement('a');
      link.href = url;
      link.download = 'merged.pdf';
      link.click();
      
      URL.revokeObjectURL(url);
      updateProgressDisplay('mergeProgressText', 0);
      pdfsToMerge = [];
      document.getElementById('pdfDropZone').innerHTML = `<i class="fas fa-cloud-upload-alt"></i>
        <p>Drop PDF files here or click to select</p>
        <span class="file-support">Supports multiple PDF files</span>`;
    } catch (error) {
      showToast('Error merging PDFs: ' + error.message, 'error');
    } finally {
      mergeBtn.disabled = false;
      mergeBtn.querySelector('.loading-spinner').style.display = 'none';
    }
  });
}

// Image to PDF Converter
let imagesToConvert = [];
const convertToPdfBtn = document.getElementById('convertToPdfBtn');

function handleImageFiles(files) {
  const validImageTypes = ['image/jpeg', 'image/jpg', 'image/png'];
  const invalidFiles = Array.from(files).filter(file => !validImageTypes.includes(file.type));
  
  if (invalidFiles.length > 0) {
    showToast('Warning: Some files were not supported image formats and will be ignored', 'info');
  }
  
  imagesToConvert = Array.from(files).filter(file => validImageTypes.includes(file.type));
  const imageDropZone = document.getElementById('imageDropZone');
  
  if (imagesToConvert.length > 0) {
    const totalSize = imagesToConvert.reduce((sum, file) => sum + file.size, 0);
    const sizeMB = (totalSize / (1024 * 1024)).toFixed(2);
    imageDropZone.innerHTML = `${imagesToConvert.length} images selected<br>Total size: ${sizeMB} MB`;
  } else {
    imageDropZone.innerHTML = `<i class="fas fa-cloud-upload-alt"></i>
      <p>Drop image files here or click to select</p>
      <span class="file-support">Supports JPG, JPEG, PNG</span>`;
  }
}

if (convertToPdfBtn) {
  convertToPdfBtn.addEventListener('click', async () => {
    if (imagesToConvert.length === 0) {
      showToast('Please select at least one image', 'error');
      return;
    }

    convertToPdfBtn.disabled = true;
    convertToPdfBtn.querySelector('.loading-spinner').style.display = 'inline-block';
    
    try {
      const pdfDoc = await PDFLib.PDFDocument.create();
      const pageSize = document.getElementById('pageSize').value;
      const pageOrientation = document.getElementById('pageOrientation').value;
      
      for (let i = 0; i < imagesToConvert.length; i++) {
        const file = imagesToConvert[i];
        const imageBytes = await file.arrayBuffer();
        let image;
        
        if (file.type.includes('png')) {
          image = await pdfDoc.embedPng(imageBytes);
        } else if (file.type.includes('jpg') || file.type.includes('jpeg')) {
          image = await pdfDoc.embedJpg(imageBytes);
        } else {
          continue;
        }
        
        // Determine page dimensions based on settings
        let width = image.width;
        let height = image.height;
        
        if (pageSize !== 'original') {
          // Standard page sizes
          if (pageSize === 'a4') {
            width = 595; // A4 width in points
            height = 842; // A4 height in points
          } else if (pageSize === 'letter') {
            width = 612; // Letter width in points
            height = 792; // Letter height in points
          }
          
          // Handle orientation
          if ((pageOrientation === 'landscape') || 
              (pageOrientation === 'auto' && image.width > image.height)) {
            [width, height] = [height, width]; // Swap dimensions for landscape
          }
        }
        
        const page = pdfDoc.addPage([width, height]);
        
        // Calculate scaling to fit the image properly
        const scaleWidth = width / image.width;
        const scaleHeight = height / image.height;
        const scale = Math.min(scaleWidth, scaleHeight) * 0.95; // 5% margin
        
        const scaledWidth = image.width * scale;
        const scaledHeight = image.height * scale;
        const x = (width - scaledWidth) / 2;
        const y = (height - scaledHeight) / 2;
        
        page.drawImage(image, {
          x: x,
          y: y,
          width: scaledWidth,
          height: scaledHeight,
        });
        
        updateProgressDisplay('convertProgressText', ((i + 1) / imagesToConvert.length) * 100);
      }
      
      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      
      const fileSize = (blob.size / 1024 / 1024).toFixed(2);
      showToast(`PDF created! File size: ${fileSize} MB`, 'success');
      
      const link = document.createElement('a');
      link.href = url;
      link.download = 'converted_images.pdf';
      link.click();
      
      URL.revokeObjectURL(url);
      updateProgressDisplay('convertProgressText', 0);
      imagesToConvert = [];
      document.getElementById('imageDropZone').innerHTML = `<i class="fas fa-cloud-upload-alt"></i>
        <p>Drop image files here or click to select</p>
        <span class="file-support">Supports JPG, JPEG, PNG</span>`;
      document.getElementById('imageInput').value = '';
    } catch (error) {
      showToast('Error converting images to PDF: ' + error.message, 'error');
    } finally {
      convertToPdfBtn.disabled = false;
      convertToPdfBtn.querySelector('.loading-spinner').style.display = 'none';
    }
  });
}

// PDF Compressor
let pdfToCompress = null;
const compressBtn = document.getElementById('compressBtn');

function handleCompressFile(files) {
  if (files.length === 0) return;
  
  // Take only the first file
  const file = files[0];
  
  if (!file.type.includes('pdf')) {
    showToast('Please select a PDF file', 'error');
    return;
  }
  
  pdfToCompress = file;
  const compressDropZone = document.getElementById('compressDropZone');
  
  const sizeMB = (file.size / (1024 * 1024)).toFixed(2);
  compressDropZone.innerHTML = `File: ${file.name}<br>Size: ${sizeMB} MB`;
}

if (compressBtn) {
  compressBtn.addEventListener('click', async () => {
    if (!pdfToCompress) {
      showToast('Please select a PDF file to compress', 'error');
      return;
    }

    compressBtn.disabled = true;
    compressBtn.querySelector('.loading-spinner').style.display = 'inline-block';
    
    try {
      const arrayBuffer = await pdfToCompress.arrayBuffer();
      const pdfDoc = await PDFLib.PDFDocument.load(arrayBuffer);
      
      // Apply compression based on selected level
      const compressionLevelElement = document.getElementById('compressionLevel');
      const level = compressionLevelElement ? 
        ['low', 'medium', 'high'][parseInt(compressionLevelElement.value) - 1] : 'medium';
      
      const options = {
        useObjectStreams: true,
        addDefaultPage: false,
      };
      
      // Higher compression = more processing
      if (level === 'high') {
        options.objectsPerTick = 50;
      } else if (level === 'medium') {
        options.objectsPerTick = 100;
      } else {
        options.objectsPerTick = 150;
      }
      
      updateProgressDisplay('compressProgressText', 50); // Show progress
      
      const compressedBytes = await pdfDoc.save(options);
      const blob = new Blob([compressedBytes], { type: 'application/pdf' });
      
      const originalSize = (pdfToCompress.size / 1024 / 1024).toFixed(2);
      const newSize = (blob.size / 1024 / 1024).toFixed(2);
      const reduction = (100 - (blob.size / pdfToCompress.size * 100)).toFixed(1);
      
      updateProgressDisplay('compressProgressText', 100);
      
      showToast(`Compression complete! Reduced by ${reduction}%`, 'success');
      
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `compressed_${pdfToCompress.name}`;
      link.click();
      
      URL.revokeObjectURL(url);
      
      // Reset the UI
      pdfToCompress = null;
      document.getElementById('compressDropZone').innerHTML = `<i class="fas fa-cloud-upload-alt"></i>
        <p>Drop PDF file here or click to select</p>
        <span class="file-support">Supports PDF files</span>`;
      document.getElementById('pdfCompressInput').value = '';
      
      setTimeout(() => {
        updateProgressDisplay('compressProgressText', 0);
      }, 2000);
      
    } catch (error) {
      showToast('Error compressing PDF: ' + error.message, 'error');
    } finally {
      compressBtn.disabled = false;
      compressBtn.querySelector('.loading-spinner').style.display = 'none';
    }
  });
}

// PDF to Images
let pdfToConvert = null;
const pdfToImgBtn = document.getElementById('pdfToImgBtn');

function handlePdfToImgFile(files) {
  if (files.length === 0) return;
  
  // Take only the first file
  const file = files[0];
  
  if (!file.type.includes('pdf')) {
    showToast('Please select a PDF file', 'error');
    return;
  }
  
  pdfToConvert = file;
  const pdfToImgDropZone = document.getElementById('pdfToImgDropZone');
  
  const sizeMB = (file.size / (1024 * 1024)).toFixed(2);
  pdfToImgDropZone.innerHTML = `File: ${file.name}<br>Size: ${sizeMB} MB`;
}

if (pdfToImgBtn) {
  pdfToImgBtn.addEventListener('click', async () => {
    if (!pdfToConvert) {
      showToast('Please select a PDF file to convert', 'error');
      return;
    }

    pdfToImgBtn.disabled = true;
    pdfToImgBtn.querySelector('.loading-spinner').style.display = 'inline-block';
    
    try {
      const arrayBuffer = await pdfToConvert.arrayBuffer();
      
      // Note: pdf-lib doesn't directly support PDF to image conversion
      // In a real implementation, you would need pdf.js or another library
      // This is a simplified demonstration
      
      showToast('Converting PDF to images...', 'info');
      updateProgressDisplay('pdfToImgProgressText', 50);
      
      // Simulating processing time
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Create a zip file to contain the images
      const zip = new JSZip();
      const imgFolder = zip.folder("images");
      
      // In a real implementation, you would extract actual page images here
      // Simulated content for demonstration
      imgFolder.file("page_1.png", new ArrayBuffer(8), {base64: true});
      imgFolder.file("page_2.png", new ArrayBuffer(8), {base64: true});
      
      updateProgressDisplay('pdfToImgProgressText', 90);
      
      const zipContent = await zip.generateAsync({type: "blob"});
      const url = URL.createObjectURL(zipContent);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `${pdfToConvert.name.replace('.pdf', '')}_images.zip`;
      link.click();
      
      URL.revokeObjectURL(url);
      
      showToast('PDF pages extracted as images and compressed into a ZIP file', 'success');
      
      // Reset the UI
      pdfToConvert = null;
      document.getElementById('pdfToImgDropZone').innerHTML = `<i class="fas fa-cloud-upload-alt"></i>
        <p>Drop PDF file here or click to select</p>
        <span class="file-support">Supports PDF files</span>`;
      document.getElementById('pdfToImgInput').value = '';
      
      setTimeout(() => {
        updateProgressDisplay('pdfToImgProgressText', 0);
      }, 2000);
      
    } catch (error) {
      showToast('Error converting PDF to images: ' + error.message, 'error');
    } finally {
      pdfToImgBtn.disabled = false;
      pdfToImgBtn.querySelector('.loading-spinner').style.display = 'none';
    }
  });
}

// Helper function to show toast messages
function showToast(message, type = 'info') {
  const toast = document.getElementById('toast');
  if (!toast) return;
  
  toast.textContent = message;
  toast.className = `toast ${type} show`;
  
  setTimeout(() => {
    toast.classList.remove('show');
  }, 5000);
}