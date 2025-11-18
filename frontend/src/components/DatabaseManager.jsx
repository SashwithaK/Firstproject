import { useState } from 'react';

const DatabaseManager = ({ results, onEdit, onDelete, onRefresh }) => {
  const [viewMode, setViewMode] = useState('cards');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);

  const filteredResults = results.filter(item =>
    item.filename.toLowerCase().includes(searchTerm.toLowerCase()) ||
    JSON.stringify(item.json_data).toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Header & Controls */}
      <div className="bg-white rounded-3xl shadow-2xl p-8 border-4 border-purple-100">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-8">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl flex items-center justify-center shadow-xl">
              <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M3 12v3c0 1.657 3.134 3 7 3s7-1.343 7-3v-3c0 1.657-3.134 3-7 3s-7-1.343-7-3z"/>
                <path d="M3 7v3c0 1.657 3.134 3 7 3s7-1.343 7-3V7c0 1.657-3.134 3-7 3S3 8.657 3 7z"/>
                <path d="M17 5c0 1.657-3.134 3-7 3S3 6.657 3 5s3.134-3 7-3 7 1.343 7 3z"/>
              </svg>
            </div>
            <div>
              <h2 className="text-4xl font-black text-gray-900">Database Records</h2>
              <p className="text-xl text-purple-600 font-bold">
                {filteredResults.length} {filteredResults.length === 1 ? 'Record' : 'Records'} Found
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-4">
            <button
              onClick={() => setViewMode('cards')}
              className={`flex items-center gap-2 px-6 py-4 rounded-xl font-bold text-lg transition-all duration-300 ${
                viewMode === 'cards'
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-xl scale-105'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"/>
              </svg>
              Card View
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`flex items-center gap-2 px-6 py-4 rounded-xl font-bold text-lg transition-all duration-300 ${
                viewMode === 'table'
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-xl scale-105'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5 4a3 3 0 00-3 3v6a3 3 0 003 3h10a3 3 0 003-3V7a3 3 0 00-3-3H5zm-1 9v-1h5v2H5a1 1 0 01-1-1zm7 1h4a1 1 0 001-1v-1h-5v2zm0-4h5V8h-5v2zM9 8H4v2h5V8z" clipRule="evenodd"/>
              </svg>
              Table View
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <input
            type="text"
            placeholder="Search by filename or content..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-8 py-6 pl-16 text-xl border-4 border-gray-200 rounded-2xl focus:border-purple-500 focus:ring-4 focus:ring-purple-200 transition-all font-medium"
          />
          <svg className="w-8 h-8 text-gray-400 absolute left-5 top-1/2 transform -translate-y-1/2" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd"/>
          </svg>
        </div>
      </div>

      {/* Results Display */}
      {filteredResults.length === 0 ? (
        <div className="bg-white rounded-3xl shadow-2xl p-20 border-4 border-gray-100 text-center">
          <div className="w-32 h-32 mx-auto mb-8 bg-gray-100 rounded-full flex items-center justify-center">
            <svg className="w-20 h-20 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
            </svg>
          </div>
          <h3 className="text-4xl font-black text-gray-900 mb-4">No Records Found</h3>
          <p className="text-2xl text-gray-600">
            {searchTerm ? 'Try a different search term' : 'Upload some documents to get started!'}
          </p>
        </div>
      ) : viewMode === 'cards' ? (
        <div className="grid md:grid-cols-2 gap-8">
          {filteredResults.map((item) => (
            <div key={item.id} className="bg-white rounded-3xl shadow-2xl border-4 border-gray-100 hover:border-purple-300 transition-all duration-300 transform hover:scale-[1.02] overflow-hidden">
              {/* Card Header */}
              <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-white rounded-xl flex items-center justify-center shadow-xl">
                      <svg className="w-8 h-8 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd"/>
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-2xl font-black text-white truncate max-w-xs">{item.filename}</h3>
                      <p className="text-purple-100 font-bold">Record ID: {item.id}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-6">
                <div className="flex gap-3 mb-6">
                  <span className="bg-blue-100 text-blue-800 px-4 py-2 rounded-xl font-bold text-sm">
                    📅 {new Date(item.created_at).toLocaleDateString()}
                  </span>
                  <span className="bg-green-100 text-green-800 px-4 py-2 rounded-xl font-bold text-sm">
                    🕐 {new Date(item.created_at).toLocaleTimeString()}
                  </span>
                </div>

                <div className="bg-gray-900 rounded-2xl p-5 border-4 border-gray-700 shadow-inner mb-6 max-h-64 overflow-auto">
                  <pre className="text-green-400 text-sm font-mono whitespace-pre-wrap leading-relaxed">
{JSON.stringify(item.json_data, null, 2)}
                  </pre>
                </div>

                {/* CRUD Buttons */}
                <div className="grid grid-cols-3 gap-3">
                  <button
                    onClick={() => setSelectedItem(item)}
                    className="flex flex-col items-center gap-2 bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold py-4 px-4 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-xl"
                  >
                    <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"/>
                      <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd"/>
                    </svg>
                    <span className="text-sm">View</span>
                  </button>

                  <button
                    onClick={() => onEdit(item)}
                    className="flex flex-col items-center gap-2 bg-gradient-to-br from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-bold py-4 px-4 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-xl"
                  >
                    <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"/>
                    </svg>
                    <span className="text-sm">Edit</span>
                  </button>

                  <button
                    onClick={() => onDelete(item)}
                    className="flex flex-col items-center gap-2 bg-gradient-to-br from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white font-bold py-4 px-4 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-xl"
                  >
                    <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd"/>
                    </svg>
                    <span className="text-sm">Delete</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Table View */
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border-4 border-gray-100">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
                <tr>
                  <th className="px-6 py-6 text-left text-xl font-black">ID</th>
                  <th className="px-6 py-6 text-left text-xl font-black">Filename</th>
                  <th className="px-6 py-6 text-left text-xl font-black">Created</th>
                  <th className="px-6 py-6 text-left text-xl font-black">Data Preview</th>
                  <th className="px-6 py-6 text-center text-xl font-black">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y-4 divide-gray-100">
                {filteredResults.map((item) => (
                  <tr key={item.id} className="hover:bg-purple-50 transition-colors">
                    <td className="px-6 py-6">
                      <span className="bg-purple-600 text-white px-4 py-2 rounded-xl font-black text-lg">
                        {item.id}
                      </span>
                    </td>
                    <td className="px-6 py-6">
                      <div className="flex items-center gap-3">
                        <svg className="w-8 h-8 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd"/>
                        </svg>
                        <span className="font-bold text-lg text-gray-900">{item.filename}</span>
                      </div>
                    </td>
                    <td className="px-6 py-6">
                      <div className="text-base font-bold text-gray-700">
                        <div>{new Date(item.created_at).toLocaleDateString()}</div>
                        <div className="text-sm text-gray-500">{new Date(item.created_at).toLocaleTimeString()}</div>
                      </div>
                    </td>
                    <td className="px-6 py-6">
                      <div className="bg-gray-900 rounded-xl p-3 max-w-xs overflow-hidden">
                        <pre className="text-green-400 text-xs font-mono truncate">
{JSON.stringify(item.json_data).substring(0, 50)}...
                        </pre>
                      </div>
                    </td>
                    <td className="px-6 py-6">
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => setSelectedItem(item)}
                          className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white p-3 rounded-xl transition-all duration-300 transform hover:scale-110 shadow-lg"
                          title="View"
                        >
                          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"/>
                            <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd"/>
                          </svg>
                        </button>
                        <button
                          onClick={() => onEdit(item)}
                          className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white p-3 rounded-xl transition-all duration-300 transform hover:scale-110 shadow-lg"
                          title="Edit"
                        >
                          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"/>
                          </svg>
                        </button>
                        <button
                          onClick={() => onDelete(item)}
                          className="bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white p-3 rounded-xl transition-all duration-300 transform hover:scale-110 shadow-lg"
                          title="Delete"
                        >
                          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd"/>
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* View Modal */}
      {selectedItem && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-6 z-50 animate-fadeIn">
          <div className="bg-white rounded-3xl p-10 max-w-5xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border-4 border-purple-300">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl flex items-center justify-center shadow-xl">
                  <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"/>
                    <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd"/>
                  </svg>
                </div>
                <div>
                  <h3 className="text-4xl font-black text-gray-900">View Record</h3>
                  <p className="text-xl text-purple-600 font-bold">{selectedItem.filename}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedItem(null)}
                className="bg-gray-200 hover:bg-gray-300 p-4 rounded-2xl transition-all"
              >
                <svg className="w-8 h-8 text-gray-700" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"/>
                </svg>
              </button>
            </div>

            <div className="bg-gray-900 rounded-2xl p-8 border-4 border-gray-700 shadow-inner">
              <pre className="text-green-400 text-base font-mono whitespace-pre-wrap leading-relaxed">
{JSON.stringify(selectedItem.json_data, null, 2)}
              </pre>
            </div>

            <div className="mt-8 text-center">
              <button
                onClick={() => setSelectedItem(null)}
                className="bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white font-black py-5 px-12 rounded-2xl text-xl shadow-2xl transition-all duration-300 transform hover:scale-105"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DatabaseManager;
