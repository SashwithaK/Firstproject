import { useState } from 'react';

const EditModal = ({ item, onSave, onClose }) => {
  const [editData, setEditData] = useState(JSON.stringify(item.json_data, null, 2));
  const [error, setError] = useState('');

  const handleSave = () => {
    try {
      const parsedData = JSON.parse(editData);
      onSave(item.id, parsedData);
      setError('');
    } catch (err) {
      setError('❌ Invalid JSON format! Please check your syntax.');
    }
  };

  const formatJSON = () => {
    try {
      const parsed = JSON.parse(editData);
      setEditData(JSON.stringify(parsed, null, 2));
      setError('');
    } catch (err) {
      setError('❌ Cannot format invalid JSON');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-6 z-50 animate-fadeIn">
      <div className="bg-white rounded-3xl p-10 max-w-6xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border-4 border-amber-300">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-xl">
              <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"/>
              </svg>
            </div>
            <div>
              <h3 className="text-5xl font-black bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                Edit Record
              </h3>
              <p className="text-2xl text-amber-700 font-bold mt-2">{item.filename}</p>
              <p className="text-lg text-gray-600 font-medium">ID: {item.id}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="bg-gray-200 hover:bg-gray-300 p-5 rounded-2xl transition-all transform hover:scale-110"
          >
            <svg className="w-10 h-10 text-gray-700" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"/>
            </svg>
          </button>
        </div>

        {/* Info Panel */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-4 border-blue-200 rounded-2xl p-6 mb-8">
          <div className="flex items-start gap-4">
            <svg className="w-10 h-10 text-blue-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"/>
            </svg>
            <div>
              <h4 className="text-xl font-black text-blue-900 mb-2">Editing Instructions</h4>
              <ul className="text-lg text-blue-800 space-y-1 font-medium">
                <li>• Modify the JSON data below</li>
                <li>• Ensure valid JSON syntax (use "Format JSON" button)</li>
                <li>• Click "Save Changes" to update the database</li>
                <li>• Changes will be reflected immediately</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-gradient-to-r from-red-500 to-pink-500 text-white p-6 rounded-2xl mb-6 font-bold text-xl flex items-center gap-4 shadow-xl">
            <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"/>
            </svg>
            {error}
          </div>
        )}

        {/* JSON Editor */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <label className="text-2xl font-black text-gray-900">JSON Data Editor</label>
            <button
              onClick={formatJSON}
              className="flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd"/>
              </svg>
              Format JSON
            </button>
          </div>
          <textarea
            value={editData}
            onChange={(e) => setEditData(e.target.value)}
            className="w-full h-96 p-8 border-4 border-gray-300 rounded-2xl font-mono text-lg focus:border-amber-500 focus:ring-4 focus:ring-amber-200 transition-all bg-gray-50 leading-relaxed"
            placeholder="Enter JSON data..."
            spellCheck="false"
          />
          <div className="mt-4 flex items-center gap-3 text-lg font-medium text-gray-600">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"/>
            </svg>
            Characters: {editData.length} | Lines: {editData.split('\n').length}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-6">
          <button
            onClick={handleSave}
            className="flex-1 flex items-center justify-center gap-4 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-black py-6 px-10 rounded-2xl text-2xl shadow-2xl transition-all duration-300 transform hover:scale-105"
          >
            <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 20 20">
              <path d="M7.707 10.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V6h5a2 2 0 012 2v7a2 2 0 01-2 2H4a2 2 0 01-2-2V8a2 2 0 012-2h5v5.586l-1.293-1.293zM9 4a1 1 0 012 0v2H9V4z"/>
            </svg>
            Save Changes
          </button>

          <button
            onClick={onClose}
            className="flex-1 flex items-center justify-center gap-4 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white font-black py-6 px-10 rounded-2xl text-2xl shadow-2xl transition-all duration-300 transform hover:scale-105"
          >
            <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"/>
            </svg>
            Cancel
          </button>
        </div>

        {/* Metadata */}
        <div className="mt-8 grid md:grid-cols-2 gap-6">
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 border-4 border-purple-200 rounded-2xl p-6">
            <p className="text-lg font-bold text-purple-900 mb-2">Created At</p>
            <p className="text-xl text-purple-700 font-medium">
              {new Date(item.created_at).toLocaleString()}
            </p>
          </div>
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-4 border-blue-200 rounded-2xl p-6">
            <p className="text-lg font-bold text-blue-900 mb-2">Last Updated</p>
            <p className="text-xl text-blue-700 font-medium">
              {new Date(item.updated_at).toLocaleString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditModal;
