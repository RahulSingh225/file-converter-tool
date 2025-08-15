const fs = require('fs');
const path = require('path');

const cleanupInterval = 15 * 60 * 1000; // 15 minutes
const maxFileAge = 60 * 60 * 1000; // 60 minutes
const tempDir = path.join(__dirname, '../temp');

function cleanupTempFiles() {
  fs.readdir(tempDir, (err, files) => {
    if (err) return;
    
    const now = Date.now();
    files.forEach(file => {
      const filePath = path.join(tempDir, file);
      fs.stat(filePath, (err, stats) => {
        if (err) return;
        
        if (now - stats.birthtimeMs > maxFileAge) {
          fs.unlink(filePath, () => {});
        }
      });
    });
  });
}

// Start cleanup scheduler
module.exports = {
  start: () => setInterval(cleanupTempFiles, cleanupInterval)
};