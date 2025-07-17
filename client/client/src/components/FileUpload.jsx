import React, { useRef } from 'react';
import { Upload, Image, File, X } from 'lucide-react';
import toast from 'react-hot-toast';

const FileUpload = ({ onUpload }) => {
  const fileInputRef = useRef(null);

  const handleFileSelect = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Check file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast.error('File size must be less than 10MB');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('http://localhost:3001/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        onUpload({
          ...result,
          type: file.type
        });
        toast.success('File uploaded successfully');
      } else {
        toast.error('Failed to upload file');
      }
    } catch (error) {
      toast.error('Upload error: ' + error.message);
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-4 w-64">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium text-gray-900">Upload File</h3>
      </div>
      
      <div className="space-y-2">
        <button
          onClick={() => {
            fileInputRef.current.accept = 'image/*';
            fileInputRef.current.click();
          }}
          className="w-full flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <Image className="w-4 h-4 mr-2" />
          Upload Image
        </button>
        
        <button
          onClick={() => {
            fileInputRef.current.accept = '*';
            fileInputRef.current.click();
          }}
          className="w-full flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <File className="w-4 h-4 mr-2" />
          Upload File
        </button>
      </div>
      
      <input
        ref={fileInputRef}
        type="file"
        onChange={handleFileSelect}
        className="hidden"
      />
      
      <div className="mt-3 text-xs text-gray-500">
        Max file size: 10MB
      </div>
    </div>
  );
};

export default FileUpload;