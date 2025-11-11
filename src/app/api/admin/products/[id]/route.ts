import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();

    console.log('📦 Updating product with separate color stock:', body.attributes);

    // تحديث المخزون حسب الألوان (منفصل)
    const colorStock: Record<string, number> = {};
    let totalStock = 0;

    if (body.attributes?.colors && Array.isArray(body.attributes.colors)) {
      body.attributes.colors.forEach((color: string) => {
        // الحفاظ على المخزون القديم أو استخدام الجديد
        const stockForColor = body.attributes?.colorStock?.[color] || 
                             Math.floor(body.stock / body.attributes.colors.length) || 
                             body.stock;
        colorStock[color] = stockForColor;
        totalStock += stockForColor;
      });
    } else {
      totalStock = body.stock;
    }

    const product = await prisma.product.update({
      where: { id: params.id },
      data: {
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
        featured: body.featured,
        enabled: body.enabled,
        attributes: {
          colors: body.attributes?.colors || [],
          colorStock: colorStock,
          ...(body.attributes || {})
        },
      },
    });

    console.log('✅ Product updated with separate color stock:', product.attributes);

    return NextResponse.json(product);
  } catch (error) {
    console.error('❌ Error updating product:', error);
    return NextResponse.json({ error: 'Failed to update product' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const orderItems = await prisma.orderItem.findMany({
      where: { productId: params.id }
    });

    if (orderItems.length > 0) {
      await prisma.product.update({
        where: { id: params.id },
        data: { enabled: false }
      });

      return NextResponse.json({ 
        message: 'المنتج مرتبط بطلبات، تم تعطيله',
        disabled: true 
      });
    }

    await prisma.review.deleteMany({
      where: { productId: params.id }
    });

    await prisma.product.delete({
      where: { id: params.id }
    });

    return NextResponse.json({ 
      message: 'تم الحذف بنجاح',
      deleted: true 
    });
  } catch (error: any) {
    console.error('❌ Error deleting product:', error);
    return NextResponse.json({ 
      error: error?.message || 'فشل الحذف' 
    }, { status: 500 });
  }
}
