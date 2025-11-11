import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const featured = searchParams.get('featured');

    const where: any = {};

    where.enabled = true;

    if (category && category !== 'all') {
      where.category = category;
    }

    if (search) {
      where.OR = [
        { nameAr: { contains: search, mode: 'insensitive' } },
        { name: { contains: search, mode: 'insensitive' } },
        { descriptionAr: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (featured === 'true') {
      where.featured = true;
    }

    const products = await prisma.product.findMany({
      where,
      include: {
        orderItems: {
          select: {
            quantity: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    // جلب جميع التقييمات
    const allReviews = await prisma.customerReview.findMany({
      where: { isApproved: true },
    });

    // حساب المبيعات والتقييمات الحقيقية
    const productsWithStats = products.map(product => {
      // حساب المبيعات الحقيقية من الطلبات
      const realSales = product.orderItems.reduce((sum, item) => sum + item.quantity, 0);

      // جلب تقييمات هذا المنتج بالاسم
      const productReviews = allReviews.filter(r => r.productName === product.nameAr);

      // حساب التقييم الحقيقي
      const realRating = productReviews.length > 0
        ? productReviews.reduce((sum, review) => sum + review.rating, 0) / productReviews.length
        : 0;

      const { orderItems, ...productData } = product;

      return {
        ...productData,
        sales: realSales,
        rating: parseFloat(realRating.toFixed(1)),
        reviewCount: productReviews.length,
      };
    });

    console.log('✅ Found products:', productsWithStats.length);

    return NextResponse.json(productsWithStats);
  } catch (error) {
    console.error('❌ Error fetching products:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch products', 
      details: error instanceof Error ? error.message : String(error) 
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // دعم نظام الألوان الجديد
    const productData = {
      ...body,
      // إذا كان هناك ألوان، نقوم بإنشاء colorStock
      attributes: body.attributes ? {
        ...body.attributes,
        colorStock: body.attributes.colors ? 
          body.attributes.colors.reduce((acc: any, color: string) => {
            acc[color] = body.stock; // توزيع المخزون على الألوان
            return acc;
          }, {}) : {}
      } : {}
    };

    const product = await prisma.product.create({
      data: productData,
    });

    console.log('✅ Product created:', product.id);

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error('❌ Error creating product:', error);
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
  }
}
