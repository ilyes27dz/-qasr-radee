import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    
    // دعم صور المنتجات (متعددة) ✅
    const productImages = formData.getAll('images') as File[];
    
    // دعم صور التقييمات (ملف واحد) ✅
    const reviewImage = formData.get('file') as File;
    
    const files = productImages.length > 0 ? productImages : (reviewImage ? [reviewImage] : []);

    if (!files || files.length === 0) {
      return NextResponse.json({ error: 'No files uploaded' }, { status: 400 });
    }

    const uploadedUrls: string[] = [];

    // رفع كل ملف إلى Cloudinary ✅
    for (const file of files) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const base64 = buffer.toString('base64');
      const dataURI = `data:${file.type};base64,${base64}`;

      const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/upload`;

      const response = await fetch(cloudinaryUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          file: dataURI,
          upload_preset: process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET,
        }),
      });

      if (!response.ok) {
        throw new Error('Cloudinary upload failed');
      }

      const data = await response.json();
      uploadedUrls.push(data.secure_url);
    }

    // إذا صورة تقييم واحدة → url ✅
    if (reviewImage && productImages.length === 0) {
      return NextResponse.json({ 
        success: true, 
        url: uploadedUrls[0] 
      });
    }

    // إذا صور منتجات → images ✅
    return NextResponse.json({ 
      success: true, 
      images: uploadedUrls 
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}
