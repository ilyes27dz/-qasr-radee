import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    
    // دعم صور المنتجات (متعددة) ✅
    const productImages = formData.getAll('images') as File[];
    
    // دعم صور التقييمات (ملف واحد) ✅
    const reviewImage = formData.get('file') as File;
    
    // تحديد المصدر
    const files = productImages.length > 0 ? productImages : (reviewImage ? [reviewImage] : []);

    if (!files || files.length === 0) {
      return NextResponse.json({ error: 'No files uploaded' }, { status: 400 });
    }

    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true });
    }

    const uploadedFiles: string[] = [];

    for (const file of files) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const timestamp = Date.now();
      const filename = `${timestamp}-${file.name.replace(/\s/g, '-')}`;
      const filepath = path.join(uploadDir, filename);

      await writeFile(filepath, buffer);
      uploadedFiles.push(`/uploads/${filename}`);
    }

    // إذا صورة تقييم واحدة → url ✅
    if (reviewImage && productImages.length === 0) {
      return NextResponse.json({ 
        success: true, 
        url: uploadedFiles[0] 
      });
    }

    // إذا صور منتجات → images ✅
    return NextResponse.json({ 
      success: true, 
      images: uploadedFiles 
    });
  } catch (error) {
    console.error('Error uploading files:', error);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}
