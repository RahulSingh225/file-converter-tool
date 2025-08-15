require('dotenv').config();
const express = require('express');
const fileUpload = require('express-fileupload');
const cors = require('cors');
const { convertHandler } = require('./converters');

const app = express();
app.use(cors());
app.use(fileUpload());

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
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));