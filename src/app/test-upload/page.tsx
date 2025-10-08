'use client';

import { useState } from 'react';
import { uploadToCloudinary } from '@/lib/cloudinary';
import toast from 'react-hot-toast';

export default function TestUploadPage() {
  const [uploading, setUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState('');

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      toast.loading('جاري رفع الصورة...', { id: 'upload' });
      
      const url = await uploadToCloudinary(file);
      setImageUrl(url);
      
      toast.success('تم رفع الصورة بنجاح!', { id: 'upload' });
    } catch (error) {
      console.error('خطأ:', error);
      toast.error('فشل رفع الصورة', { id: 'upload' });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full">
        <h1 className="text-3xl font-black text-gray-900 mb-6 text-center">
          📸 اختبار رفع صورة
        </h1>
        
        <input
          type="file"
          accept="image/*"
          onChange={handleUpload}
          disabled={uploading}
          className="w-full p-4 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 transition"
        />
        
        {uploading && (
          <div className="mt-4 text-center">
            <div className="animate-spin text-4xl">⏳</div>
            <p className="text-gray-600 mt-2">جاري الرفع...</p>
          </div>
        )}
        
        {imageUrl && (
          <div className="mt-6">
            <p className="text-sm font-bold text-gray-700 mb-2">✅ تم الرفع بنجاح!</p>
            <img src={imageUrl} alt="Uploaded" className="w-full rounded-lg shadow-lg mb-4" />
            <div className="bg-green-50 p-3 rounded-lg">
              <p className="text-xs font-mono text-green-700 break-all">{imageUrl}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
