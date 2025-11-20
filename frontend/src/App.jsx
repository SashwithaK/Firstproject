import { useState, useEffect } from 'react';
import UploadSection from './components/UploadSection';
import DatabaseManager from './components/DatabaseManager';
import EditModal from './components/EditModal';
import DeleteConfirmation from './components/DeleteConfirmation';

function App() {
  const [activeView, setActiveView] = useState('upload');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [deletingItem, setDeletingItem] = useState(null);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    fetchResults();
  }, []);

  const fetchResults = async () => {
    try {
      const response = await fetch('http://localhost:8000/results');
      if (response.ok) {
        const data = await response.json();
        setResults(data);
      }
    } catch (err) {
      console.error('Failed to fetch results:', err);
      showNotification('Failed to load database records', 'error');
    }
  };

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };

  const handleUploadSuccess = (data) => {
    showNotification('✅ Extraction completed successfully!', 'success');
    fetchResults();
  };

  const handleEdit = (item) => {
    setEditingItem(item);
  };

  const handleSaveEdit = async (id, updatedData) => {
    try {
      const response = await fetch(`http://localhost:8000/results/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedData)
      });
      
      if (response.ok) {
        showNotification('✅ Record updated successfully!', 'success');
        setEditingItem(null);
        fetchResults();
      } else {
        showNotification('❌ Failed to update record', 'error');
      }
    } catch (err) {
      console.error('Failed to save edit:', err);
      showNotification('❌ Error updating record', 'error');
    }
  };

  const handleDelete = (item) => {
    setDeletingItem(item);
  };

  const confirmDelete = async () => {
    try {
      const response = await fetch(`http://localhost:8000/results/${deletingItem.id}`, {
        method: 'DELETE'
      });
      
      if (response.ok) {
        showNotification('✅ Record deleted successfully!', 'success');
        setDeletingItem(null);
        fetchResults();
      } else {
        showNotification('❌ Failed to delete record', 'error');
      }
    } catch (err) {
      console.error('Failed to delete:', err);
      showNotification('❌ Error deleting record', 'error');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Notification Toast */}
      {notification && (
        <div className={`fixed top-6 right-6 z-50 px-8 py-4 rounded-2xl shadow-2xl transform transition-all duration-500 ${
          notification.type === 'success' 
            ? 'bg-gradient-to-r from-green-500 to-emerald-500' 
            : 'bg-gradient-to-r from-red-500 to-pink-500'
        } text-white font-bold text-lg animate-slideIn`}>
          {notification.message}
        </div>
      )}

      {/* Header */}
      <header className="bg-gradient-to-r from-blue-900 via-indigo-900 to-purple-900 text-white shadow-2xl">
        <div className="container mx-auto px-6 py-10">
          <div className="flex items-center justify-center mb-6">
            <div className="bg-white/20 backdrop-blur-lg rounded-3xl p-6 shadow-2xl">
              <svg className="w-20 h-20 text-yellow-300" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"/>
                <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd"/>
              </svg>
            </div>
          </div>
          <h1 className="text-6xl md:text-7xl font-black text-center mb-4 tracking-tight">
            Handwritten Form Extraction
          </h1>
          <p className="text-xl md:text-2xl text-center text-blue-100 font-medium max-w-4xl mx-auto">
            Enterprise-Grade AI-Powered OCR System with Complete Database Management
          </p>
        </div>
      </header>

      {/* Navigation */}
      <div className="sticky top-0 z-40 bg-white/90 backdrop-blur-lg shadow-lg border-b-4 border-indigo-200">
        <div className="container mx-auto px-6 py-6">
          <div className="flex flex-wrap justify-center gap-4">
            <button
              onClick={() => setActiveView('upload')}
              className={`flex items-center gap-3 px-10 py-5 rounded-2xl font-bold text-lg transition-all duration-300 transform ${
                activeView === 'upload'
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-2xl scale-110'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:scale-105 shadow-lg'
              }`}
            >
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                <path d="M5.5 13a3.5 3.5 0 01-.369-6.98 4 4 0 117.753-1.977A4.5 4.5 0 1113.5 13H11V9.413l1.293 1.293a1 1 0 001.414-1.414l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13H5.5z"/>
              </svg>
              Upload & Extract
            </button>
            
            <button
              onClick={() => setActiveView('database')}
              className={`flex items-center gap-3 px-10 py-5 rounded-2xl font-bold text-lg transition-all duration-300 transform ${
                activeView === 'database'
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-2xl scale-110'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:scale-105 shadow-lg'
              }`}
            >
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                <path d="M3 12v3c0 1.657 3.134 3 7 3s7-1.343 7-3v-3c0 1.657-3.134 3-7 3s-7-1.343-7-3z"/>
                <path d="M3 7v3c0 1.657 3.134 3 7 3s7-1.343 7-3V7c0 1.657-3.134 3-7 3S3 8.657 3 7z"/>
                <path d="M17 5c0 1.657-3.134 3-7 3S3 6.657 3 5s3.134-3 7-3 7 1.343 7 3z"/>
              </svg>
              Database Manager
              {results.length > 0 && (
                <span className="bg-white text-purple-600 px-3 py-1 rounded-full text-sm font-black">
                  {results.length}
                </span>
              )}
            </button>
            
            
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-12">
        {activeView === 'upload' ? (
          <UploadSection 
            onUploadSuccess={handleUploadSuccess}
            onError={(msg) => showNotification(msg, 'error')}
          />
        ) : (
          <DatabaseManager
            results={results}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onRefresh={fetchResults}
          />
        )}
      </main>

      {/* Edit Modal */}
      {editingItem && (
        <EditModal
          item={editingItem}
          onSave={handleSaveEdit}
          onClose={() => setEditingItem(null)}
        />
      )}

      {/* Delete Confirmation */}
      {deletingItem && (
        <DeleteConfirmation
          item={deletingItem}
          onConfirm={confirmDelete}
          onCancel={() => setDeletingItem(null)}
        />
      )}

      {/* Footer */}
      <footer className="bg-gradient-to-r from-gray-900 to-gray-800 text-white py-8 mt-20">
        <div className="container mx-auto px-6 text-center">
          <p className="text-lg font-medium">
            ⚡ Powered by AI Vision Technology • SQLAlchemy Database • FastAPI Backend
          </p>
          <p className="text-gray-400 mt-2">
           Handwritten Form Extraction System
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
