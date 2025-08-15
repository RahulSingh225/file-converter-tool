import { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { FiUpload, FiFile } from 'react-icons/fi';
import AdBanner from './components/AdBanner';


function App() {
  const [file, setFile] = useState(null);
  const [format, setFormat] = useState('img2pdf');
  const [isConverting, setIsConverting] = useState(false);
  const [error, setError] = useState('');
  const [conversionError, setConversionError] = useState(null);
  const [downloadReady, setDownloadReady] = useState(false);
  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      'image/*': ['.jpg', '.jpeg', '.png'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
    },
    maxFiles: 1,
    maxSize: 50 * 1024 * 1024, 
    onDrop: acceptedFiles => {
      setFile(acceptedFiles[0]);
    },
     onDropRejected: (rejectedFiles) => {
    const file = rejectedFiles[0];
    if (file?.errors?.[0]?.code === 'file-too-large') {
      setError('File exceeds 50MB limit');
    } else {
      setError('Unsupported file type');
    }
  }
  });

  const handleConvert = async () => {
    if (!file) return;
      setConversionError(null);
  setDownloadReady(false);

    setIsConverting(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('format', format);

    try {
      const response = await fetch('/convert', {
        method: 'POST',
        body: formData
      });
      
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `converted.${format === 'img2pdf' ? 'pdf' : 'jpg'}`;
      document.body.appendChild(a);
      a.click();
      a.remove();
          setDownloadReady(true);

    } catch (error) {
      console.error('Conversion error:', error);
          setConversionError('Conversion failed. Please try another file.');

    } finally {
      setIsConverting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-6 px-4">
    <div className="max-w-2xl mx-auto">
      <AdBanner slotId="TOP_BANNER" />
      
      <div className="bg-white rounded-xl shadow-md p-6">
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-md p-6">
        <h1 className="text-2xl font-bold text-center mb-6">File Converter</h1>

        {error && (
  <div className="mt-2 text-red-500 text-center">
    {error}
  </div>
)}
        {isConverting && (
  <div className="mt-4 text-center">
    <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
    <p className="mt-2 text-gray-600">Processing your file...</p>
  </div>
)}
{conversionError && (
  <div className="mt-4 p-3 bg-red-50 text-red-700 rounded-md">
    {conversionError}
  </div>
)}
{downloadReady && !isConverting && (
  <div className="mt-4 p-3 bg-green-50 text-green-700 rounded-md text-center">
    Conversion successful! Your download should start automatically.
  </div>
)}
        <div {...getRootProps()} className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer mb-4">
          <input {...getInputProps()} />
          <FiUpload className="mx-auto h-12 w-12 text-gray-400" />
          <p className="mt-2">Drag files here or click to browse</p>
        </div>

        {file && (
          <div className="flex items-center p-3 bg-gray-100 rounded-lg mb-4">
            <FiFile className="text-blue-500 mr-2" />
            <span className="truncate">{file.name}</span>
          </div>
        )}

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Convert to:</label>
          <select 
            value={format} 
            onChange={(e) => setFormat(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md"
          >
            <option value="img2pdf">Image to PDF</option>
            <option value="doc2pdf">DOC/DOCX to PDF</option>
            <option value="pdf2img">PDF to Image</option>
          </select>
        </div>

        <button
          onClick={handleConvert}
          disabled={!file || isConverting}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-400"
        >
          {isConverting ? 'Converting...' : 'Convert File'}
        </button>
      </div>
    </div>
    </div>
      
      <AdBanner slotId="BOTTOM_BANNER" />
    </div>
  </div>
  );
}

export default App;