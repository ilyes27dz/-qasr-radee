import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const product = await prisma.product.findUnique({
      where: { id: params.id },
      include: {
        orderItems: {
          select: {
            quantity: true,
          },
        },
      },
    });

    if (!product) {
      return NextResponse.json(
        { error: 'المنتج غير موجود' },
        { status: 404 }
      );
    }

    // جلب تقييمات هذا المنتج من CustomerReview بناءً على الاسم
    const productReviews = await prisma.customerReview.findMany({
      where: {
        productName: product.nameAr,
        isApproved: true,
      },
    });

    // حساب المبيعات الحقيقية
    const realSales = product.orderItems.reduce((sum, item) => sum + item.quantity, 0);
    
    // حساب التقييم الحقيقي
    const realRating = productReviews.length > 0
      ? productReviews.reduce((sum, review) => sum + review.rating, 0) / productReviews.length
      : 0;

    // إرجاع المنتج مع البيانات الحقيقية
    const { orderItems, ...productData } = product;

    return NextResponse.json({
      ...productData,
      sales: realSales,
      rating: parseFloat(realRating.toFixed(1)),
      reviewCount: productReviews.length,
    });
  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json(
      { error: 'Failed to fetch product' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();

    // دعم تحديث نظام الألوان
    const updateData = {
      ...body,
      attributes: body.attributes ? {
        ...body.attributes,
        // تحديث colorStock إذا كانت هناك ألوان جديدة
        colorStock: body.attributes.colors ? 
          body.attributes.colors.reduce((acc: any, color: string) => {
            // الحفاظ على المخزون القديم أو استخدام الجديد
            acc[color] = body.attributes?.colorStock?.[color] || body.stock;
            return acc;
          }, {}) : body.attributes.colorStock
      } : body.attributes
    };

    const product = await prisma.product.update({
      where: { id: params.id },
      data: updateData,
    });

    console.log('✅ Product updated:', product.nameAr);

    return NextResponse.json(product);
  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json(
      { error: 'Failed to update product' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.product.delete({
      where: { id: params.id },
    });

    console.log('✅ Product deleted');

    return NextResponse.json({ deleted: true });
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json(
      { error: 'Failed to delete product' },
      { status: 500 }
    );
  }
}
