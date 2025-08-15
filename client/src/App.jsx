import { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { FiUpload, FiFile } from 'react-icons/fi';

function App() {
  const [file, setFile] = useState(null);
  const [format, setFormat] = useState('img2pdf');
  const [isConverting, setIsConverting] = useState(false);

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      'image/*': ['.jpg', '.jpeg', '.png'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
    },
    maxFiles: 1,
    onDrop: acceptedFiles => {
      setFile(acceptedFiles[0]);
    }
  });

  const handleConvert = async () => {
    if (!file) return;
    
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
    } catch (error) {
      console.error('Conversion error:', error);
    } finally {
      setIsConverting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-md p-6">
        <h1 className="text-2xl font-bold text-center mb-6">File Converter</h1>
        
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
  );
}

export default App;