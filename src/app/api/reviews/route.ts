import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

// GET - جلب التقييمات
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const approved = searchParams.get('approved');

    const where: any = {};
    
    // إذا كان approved=true، جلب المعتمدة فقط
    if (approved === 'true') {
      where.isApproved = true;
    }

    const reviews = await prisma.customerReview.findMany({
      where,
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(reviews);
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return NextResponse.json(
      { error: 'Failed to fetch reviews' },
      { status: 500 }
    );
  }
}

// POST - إضافة تقييم جديد
export async function POST(request: Request) {
  try {
    const body = await request.json();

    const review = await prisma.customerReview.create({
      data: {
        customerName: body.customerName,
        rating: parseInt(body.rating),
        comment: body.comment,
        productName: body.productName || '',
        image: body.image || '',
        isApproved: false, // يحتاج موافقة
      },
    });

    return NextResponse.json(review, { status: 201 });
  } catch (error) {
    console.error('Error creating review:', error);
    return NextResponse.json(
      { error: 'Failed to create review' },
      { status: 500 }
    );
  }
}
