import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const category = searchParams.get('category');
    const search = searchParams.get('search');

    const where: any = { enabled: true }; // فقط المنتجات المفعلة

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

    console.log('📦 Creating product with data:', {
      nameAr: body.nameAr,
      attributes: body.attributes,
      specifications: body.specifications,
      imagesCount: body.images?.length
    });

    // إنشاء هيكل المخزون حسب الألوان
    const colorStock: Record<string, number> = {};
    if (body.attributes?.colors && Array.isArray(body.attributes.colors)) {
      body.attributes.colors.forEach((color: string) => {
        // توزيع المخزون الإجمالي على الألوان (يمكن تعديل هذا المنطق)
        colorStock[color] = Math.floor(body.stock / body.attributes.colors.length) || body.stock;
      });
    }

    const productData = {
      name: body.name,
      nameAr: body.nameAr,
      descriptionAr: body.descriptionAr,
      specifications: body.specifications || null,
      price: body.price,
      salePrice: body.salePrice || null,
      stock: body.stock,
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
        colorStock: colorStock,
        // الحفاظ على البيانات الأخرى
        ...(body.attributes || {})
      },
    };

    const product = await prisma.product.create({
      data: productData,
    });

    console.log('✅ Product created successfully:', {
      id: product.id,
      nameAr: product.nameAr,
      attributes: product.attributes
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error('❌ Error creating product:', error);
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
  }
}
