const { PDFDocument } = require('pdf-lib');
const sharp = require('sharp');
const libre = require('libreoffice-convert');
const path = require('path');
const fs = require('fs');
const { promisify } = require('util');
const libreConvert = promisify(libre.convert);

// Temporary directory setup
const tempDir = path.join(__dirname, '../temp');
if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir);

module.exports.convertHandler = async (fileBuffer, format, filename) => {
  try {
    switch (format) {
      case 'img2pdf':
        return await imageToPdf(fileBuffer);
      
      case 'doc2pdf':
        return await docToPdf(fileBuffer, filename);
      
      case 'pdf2img':
        return await pdfToImg(fileBuffer);
      
      default:
        throw new Error('Unsupported conversion format');
    }
  } finally {
    // Cleanup will be handled separately
  }
};

// Image to PDF conversion
async function imageToPdf(imageBuffer) {
  const pdfDoc = await PDFDocument.create();
  const image = await pdfDoc.embedJpg(imageBuffer);
  const page = pdfDoc.addPage([image.width, image.height]);
  page.drawImage(image, {
    x: 0,
    y: 0,
    width: image.width,
    height: image.height,
  });
  return await pdfDoc.save();
}

// DOC to PDF conversion
async function docToPdf(docBuffer, filename) {
  const ext = path.extname(filename).slice(1);
  if (!['doc', 'docx'].includes(ext)) {
    throw new Error('Unsupported document format');
  }
  
  return await libreConvert(docBuffer, '.pdf', undefined);
}

// PDF to Image conversion (first page only)
async function pdfToImg(pdfBuffer) {
  const tempPdfPath = path.join(tempDir, `temp-${Date.now()}.pdf`);
  fs.writeFileSync(tempPdfPath, pdfBuffer);
  
  const image = await sharp(tempPdfPath, { density: 300 })
    .flatten({ background: '#ffffff' })
    .jpeg()
    .toBuffer();
    
  fs.unlinkSync(tempPdfPath);
  return image;
}