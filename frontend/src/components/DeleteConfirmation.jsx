const DeleteConfirmation = ({ item, onConfirm, onCancel }) => {
  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-6 z-50 animate-fadeIn">
      <div className="bg-white rounded-3xl p-12 max-w-2xl w-full shadow-2xl border-4 border-red-300 transform animate-bounce-in">
        {/* Warning Icon */}
        <div className="flex justify-center mb-8">
          <div className="w-32 h-32 bg-gradient-to-br from-red-500 to-pink-600 rounded-full flex items-center justify-center shadow-2xl animate-pulse">
            <svg className="w-20 h-20 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
            </svg>
          </div>
        </div>

        {/* Content */}
        <div className="text-center mb-10">
          <h3 className="text-5xl font-black text-gray-900 mb-6">
            Confirm Deletion
          </h3>
          <p className="text-2xl text-gray-700 font-bold mb-4">
            Are you sure you want to delete this record?
          </p>
          <p className="text-xl text-gray-600 font-medium">
            This action cannot be undone!
          </p>
        </div>

        {/* Record Details */}
        <div className="bg-gradient-to-r from-red-50 to-pink-50 border-4 border-red-200 rounded-2xl p-8 mb-10">
          <div className="flex items-center gap-4 mb-4">
            <svg className="w-12 h-12 text-red-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd"/>
            </svg>
            <div className="flex-1">
              <p className="text-2xl font-black text-gray-900">{item.filename}</p>
              <p className="text-lg text-gray-600 font-bold">ID: {item.id}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 text-lg font-medium">
            <div className="bg-white rounded-xl p-4 border-2 border-red-200">
              <p className="text-gray-600 mb-1">Created</p>
              <p className="text-gray-900 font-bold">{new Date(item.created_at).toLocaleDateString()}</p>
            </div>
            <div className="bg-white rounded-xl p-4 border-2 border-red-200">
              <p className="text-gray-600 mb-1">Updated</p>
              <p className="text-gray-900 font-bold">{new Date(item.updated_at).toLocaleDateString()}</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-6">
          <button
            onClick={onConfirm}
            className="flex-1 flex items-center justify-center gap-4 bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white font-black py-6 px-10 rounded-2xl text-2xl shadow-2xl transition-all duration-300 transform hover:scale-105"
          >
            <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd"/>
            </svg>
            Yes, Delete It
          </button>

          <button
            onClick={onCancel}
            className="flex-1 flex items-center justify-center gap-4 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white font-black py-6 px-10 rounded-2xl text-2xl shadow-2xl transition-all duration-300 transform hover:scale-105"
          >
            <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"/>
            </svg>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmation;
