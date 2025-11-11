import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const category = searchParams.get('category');
    const search = searchParams.get('search');

    const where: any = {};

    if (category && category !== 'all') {
      where.category = category;
    }

    if (search) {
      where.OR = [
        { nameAr: { contains: search, mode: 'insensitive' } },
        { name: { contains: search, mode: 'insensitive' } },
      ];
    }

    const products = await prisma.product.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    console.log('📦 Creating product with separate color stock:', body.attributes);

    // إنشاء هيكل المخزون حسب الألوان (منفصل)
    const colorStock: Record<string, number> = {};
    let totalStock = 0;

    if (body.attributes?.colors && Array.isArray(body.attributes.colors)) {
      // استخدام المخزون المحدد لكل لون إذا وجد، وإلا استخدام التوزيع
      body.attributes.colors.forEach((color: string) => {
        const stockForColor = body.attributes?.colorStock?.[color] || 
                             Math.floor(body.stock / body.attributes.colors.length) || 
                             body.stock;
        colorStock[color] = stockForColor;
        totalStock += stockForColor;
      });
    } else {
      totalStock = body.stock;
    }

    const productData = {
      name: body.name,
      nameAr: body.nameAr,
      descriptionAr: body.descriptionAr,
      specifications: body.specifications || null,
      price: body.price,
      salePrice: body.salePrice || null,
      stock: totalStock, // استخدام المجموع الحقيقي
      images: body.images || [],
      category: body.category,
      categoryId: body.categoryId,
      ageGroup: body.ageGroup,
      gender: body.gender,
      badge: body.badge || null,
      featured: body.featured || false,
      enabled: body.enabled !== undefined ? body.enabled : true,
      rating: body.rating || 5,
      sales: body.sales || 0,
      attributes: {
        colors: body.attributes?.colors || [],
        colorStock: colorStock, // إضافة المخزون حسب الألوان
        ...(body.attributes || {})
      },
    };

    const product = await prisma.product.create({
      data: productData,
    });

    console.log('✅ Product created with separate color stock:', product.attributes);

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error('❌ Error creating product:', error);
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
  }
}
