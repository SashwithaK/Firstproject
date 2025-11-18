import { useState, useRef } from 'react';
import axios from 'axios';

const UploadSection = ({ onUploadSuccess, onError }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [extractedData, setExtractedData] = useState(null);
  const fileInputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file) => {
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];

    if (!validTypes.includes(file.type)) {
      onError('❌ Please upload a JPG, PNG, or PDF file');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      onError('❌ File size must be less than 10MB');
      return;
    }

    setSelectedFile(file);
    setExtractedData(null);

    if (file.type !== 'application/pdf') {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setPreview(null);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      onError('❌ Please select a file first');
      return;
    }

    setLoading(true);
    setUploadProgress(0);
    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const response = await axios.post('http://localhost:8000/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(percentCompleted);
        },
      });

      setExtractedData(response.data);
      onUploadSuccess(response.data);
    } catch (err) {
      const errorMessage = err.response?.data?.detail || err.message || 'Failed to process image';
      onError(`❌ ${errorMessage}`);
    } finally {
      setLoading(false);
      setUploadProgress(0);
    }
  };

  const resetUpload = () => {
    setSelectedFile(null);
    setPreview(null);
    setExtractedData(null);
    setUploadProgress(0);
  };

  return (
    <div className="grid lg:grid-cols-2 gap-10">
      {/* Upload Area */}
      <div className="space-y-6">
        <div className="bg-white rounded-3xl shadow-2xl p-8 border-4 border-blue-100">
          <h2 className="text-4xl font-black text-gray-900 mb-6 flex items-center gap-4">
            <svg className="w-12 h-12 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
              <path d="M5.5 13a3.5 3.5 0 01-.369-6.98 4 4 0 117.753-1.977A4.5 4.5 0 1113.5 13H11V9.413l1.293 1.293a1 1 0 001.414-1.414l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13H5.5z"/>
            </svg>
            Upload Document
          </h2>

          {!selectedFile ? (
            <div
              className={`relative border-4 border-dashed rounded-3xl p-16 text-center cursor-pointer transition-all duration-300 ${
                dragActive
                  ? 'border-blue-500 bg-blue-50 scale-105 shadow-2xl'
                  : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50/50 hover:scale-102'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".jpg,.jpeg,.png,.pdf"
                onChange={handleChange}
                className="hidden"
              />

              <div className="flex flex-col items-center space-y-6">
                <div className="w-32 h-32 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center shadow-2xl">
                  <svg className="w-20 h-20 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                </div>

                <div>
                  <h3 className="text-3xl font-bold text-gray-900 mb-3">Drag & Drop File Here</h3>
                  <p className="text-xl text-gray-600 mb-6">or click to browse your computer</p>
                  <div className="inline-block bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold py-4 px-12 rounded-2xl text-xl shadow-2xl">
                    Choose File
                  </div>
                </div>

                <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-6 max-w-md">
                  <p className="text-lg font-bold text-blue-900 mb-2">
                    📎 Supported Formats
                  </p>
                  <p className="text-blue-700 font-medium">
                    JPG, PNG, PDF • Maximum size: 10MB
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {preview && (
                <div className="relative group">
                  <img
                    src={preview}
                    alt="Preview"
                    className="w-full max-h-96 object-contain rounded-3xl border-4 border-blue-200 shadow-2xl"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all rounded-3xl"></div>
                </div>
              )}

              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-4 border-blue-200 rounded-3xl p-8">
                <div className="flex items-center gap-4 mb-4">
                  <svg className="w-16 h-16 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd"/>
                  </svg>
                  <div className="flex-1">
                    <p className="text-2xl font-black text-gray-900">{selectedFile.name}</p>
                    <p className="text-xl text-blue-600 font-bold">
                      {(selectedFile.size / 1024).toFixed(2)} KB
                    </p>
                  </div>
                </div>

                {loading && (
                  <div className="mb-6">
                    <div className="text-center mb-4">
                      <p className="text-2xl font-black text-gray-900">
                        {uploadProgress < 100 ? '⬆️ Uploading...' : '⚡ Processing with AI...'} {uploadProgress}%
                      </p>
                    </div>
                    <div className="w-full bg-gray-300 rounded-full h-6 overflow-hidden shadow-inner">
                      <div
                        className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 h-6 rounded-full transition-all duration-300 shadow-lg animate-pulse"
                        style={{ width: `${uploadProgress}%` }}
                      ></div>
                    </div>
                  </div>
                )}

                <div className="flex gap-4">
                  <button
                    onClick={handleUpload}
                    disabled={loading}
                    className="flex-1 flex items-center justify-center gap-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-black py-5 px-8 rounded-2xl text-xl transition-all duration-300 transform hover:scale-105 disabled:transform-none shadow-2xl disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-8 w-8 border-4 border-white border-t-transparent"></div>
                        Processing...
                      </>
                    ) : (
                      <>
                        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                        </svg>
                        Extract Text
                      </>
                    )}
                  </button>

                  <button
                    onClick={resetUpload}
                    disabled={loading}
                    className="flex-1 flex items-center justify-center gap-3 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 disabled:from-gray-400 disabled:to-gray-500 text-white font-black py-5 px-8 rounded-2xl text-xl transition-all duration-300 transform hover:scale-105 disabled:transform-none shadow-2xl disabled:cursor-not-allowed"
                  >
                    <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd"/>
                    </svg>
                    Reset
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Results Area */}
      <div className="space-y-6">
        <div className="bg-white rounded-3xl shadow-2xl p-8 border-4 border-green-100">
          <h2 className="text-4xl font-black text-gray-900 mb-6 flex items-center gap-4">
            <svg className="w-12 h-12 text-green-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
            </svg>
            Extraction Results
          </h2>

          {extractedData ? (
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-4 border-green-200 rounded-3xl p-8">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center shadow-xl">
                      <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                      </svg>
                    </div>
                    <div>
                      <p className="text-3xl font-black text-gray-900">Success!</p>
                      <p className="text-xl text-green-700 font-bold">{extractedData.filename}</p>
                    </div>
                  </div>
                  <span className="bg-green-600 text-white px-6 py-3 rounded-2xl font-bold text-lg shadow-xl">
                    ID: {extractedData.id}
                  </span>
                </div>

                <div className="bg-gray-900 rounded-2xl p-6 border-4 border-gray-700 shadow-inner">
                  <pre className="text-green-400 text-base font-mono overflow-x-auto whitespace-pre-wrap leading-relaxed">
{JSON.stringify(extractedData.extracted_data, null, 2)}
                  </pre>
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(JSON.stringify(extractedData.extracted_data, null, 2));
                  }}
                  className="flex-1 flex items-center justify-center gap-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-black py-5 px-8 rounded-2xl text-xl shadow-2xl transition-all duration-300 transform hover:scale-105"
                >
                  <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z"/>
                    <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z"/>
                  </svg>
                  Copy JSON
                </button>
                <button
                  onClick={resetUpload}
                  className="flex-1 flex items-center justify-center gap-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-black py-5 px-8 rounded-2xl text-xl shadow-2xl transition-all duration-300 transform hover:scale-105"
                >
                  <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M5.5 13a3.5 3.5 0 01-.369-6.98 4 4 0 117.753-1.977A4.5 4.5 0 1113.5 13H11V9.413l1.293 1.293a1 1 0 001.414-1.414l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13H5.5z"/>
                  </svg>
                  Upload Another
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center py-20">
              <div className="w-32 h-32 mx-auto mb-8 bg-gray-100 rounded-full flex items-center justify-center">
                <svg className="w-20 h-20 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd"/>
                </svg>
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-4">Waiting for Extraction</h3>
              <p className="text-xl text-gray-600 max-w-md mx-auto">
                Upload a handwritten document to see the AI-powered extraction results here
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UploadSection;
