import { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { FiUpload, FiFile } from 'react-icons/fi';
import AdBanner from './components/AdBanner';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import Loader from './components/Loader';
import ErrorScreen from './components/ErrorScreen';
import Card from './components/Card';


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
  // UI groups and converters
  const groups = {
    converters: {
      title: 'File Converters',
      items: [
        { key: 'img2pdf', label: 'Image → PDF' },
        { key: 'doc2pdf', label: 'DOC/DOCX → PDF' },
        { key: 'pdf2img', label: 'PDF → Image' },
      ]
    },
    media: {
      title: 'Media / Image',
      items: [
        { key: 'img-resize', label: 'Resize Image' },
        { key: 'img-optimize', label: 'Optimize Image' }
      ]
    },
    utils: {
      title: 'Utilities',
      items: [
        { key: 'base64', label: 'Base64 Encode/Decode' }
      ]
    }
  };

  const [selectedGroup, setSelectedGroup] = useState('converters');
  const [selectedConverter, setSelectedConverter] = useState('img2pdf');

  // Simple Base64 tool state (example)
  const [textInput, setTextInput] = useState('');
  const [base64Result, setBase64Result] = useState('');

  const runBase64Encode = () => {
    try {
      setBase64Result(btoa(unescape(encodeURIComponent(textInput))));
    } catch (e) {
      setBase64Result('Error encoding input');
    }
  };

  const runBase64Decode = () => {
    try {
      setBase64Result(decodeURIComponent(escape(atob(textInput))));
    } catch (e) {
      setBase64Result('Error decoding input');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-6 px-6">
      <div className="max-w-6xl mx-auto grid grid-cols-4 gap-6">
        <Sidebar
          groups={groups}
          selectedGroup={selectedGroup}
          onSelectGroup={(g) => { setSelectedGroup(g); setSelectedConverter(groups[g].items[0].key); }}
          selectedConverter={selectedConverter}
          onSelectConverter={(c) => setSelectedConverter(c)}
        />

        <main className="col-span-3 bg-white rounded-lg shadow p-6">
          <Topbar title="Utility Panel" />
          <div className="mb-4">
            <AdBanner slotId="TOP_BANNER" />
          </div>

          {/* Render converter panels conditionally */}
          {selectedConverter === 'base64' && (
            <Card title="Base64 Encode / Decode">
              <textarea value={textInput} onChange={(e) => setTextInput(e.target.value)} className="w-full h-40 border rounded p-2 mb-2" />
              <div className="flex gap-2 mb-4">
                <button onClick={runBase64Encode} className="bg-blue-600 text-white py-1 px-3 rounded">Encode</button>
                <button onClick={runBase64Decode} className="bg-gray-600 text-white py-1 px-3 rounded">Decode</button>
              </div>
              <div className="bg-gray-50 p-3 rounded">
                <label className="block text-sm text-gray-600 mb-1">Result</label>
                <textarea readOnly value={base64Result} className="w-full h-32 p-2 border rounded bg-white" />
              </div>
            </Card>
          )}

          {['img2pdf','doc2pdf','pdf2img'].includes(selectedConverter) && (
            <Card title={groups.converters.items.find(i=>i.key===selectedConverter).label}>
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

              {isConverting && (
                <div className="mt-4 text-center">
                  <Loader size={6} />
                  <p className="mt-2 text-gray-600">Processing your file...</p>
                </div>
              )}
              {conversionError && (
                <div className="mt-4">
                  <ErrorScreen message={conversionError} />
                </div>
              )}
              {downloadReady && !isConverting && (
                <div className="mt-4 p-3 bg-green-50 text-green-700 rounded-md text-center">
                  Conversion successful! Your download should start automatically.
                </div>
              )}
            </Card>
          )}

          <div className="mt-6">
            <AdBanner slotId="BOTTOM_BANNER" />
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;