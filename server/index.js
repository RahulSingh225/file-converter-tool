require('dotenv').config();
const express = require('express');
const fileUpload = require('express-fileupload');
const cors = require('cors');
const { convertHandler } = require('./converters');
const cleanup = require('./utils/cleanup');


const app = express();
app.use(cors());
app.use(fileUpload());
// Add after fileUpload middleware
app.use(fileUpload({
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB limit
  abortOnLimit: true,
}));

// Add error handling middleware
app.use((err, req, res, next) => {
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(413).json({ error: 'File size exceeds 50MB limit' });
  }
  next(err);
});

// Conversion endpoint
app.post('/convert', async (req, res) => {
  if (!req.files || !req.files.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  try {
    const convertedFile = await convertHandler(
      req.files.file.data,
      req.body.format,
      req.files.file.name
    );
    res.setHeader('Content-Type', 'application/pdf');
    res.send(convertedFile);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  cleanup.start();
});