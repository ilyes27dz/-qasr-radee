import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createNotification } from '@/lib/notifications';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    console.log('📦 طلب جديد وصل:', body);

    // التحقق من البيانات الأساسية
    if (!body.customerName || !body.customerPhone) {
      console.error('❌ بيانات ناقصة');
      return NextResponse.json(
        { error: 'اسم العميل ورقم الهاتف مطلوبان' },
        { status: 400 }
      );
    }

    if (!body.items || body.items.length === 0) {
      console.error('❌ السلة فارغة');
      return NextResponse.json(
        { error: 'السلة فارغة' },
        { status: 400 }
      );
    }

    // ✅ التحقق من توفر الكمية لكل منتج
    for (const item of body.items) {
      const product = await prisma.product.findUnique({
        where: { id: item.productId || item.id },
      });

      if (!product) {
        return NextResponse.json(
          { error: `المنتج ${item.productName || item.nameAr} غير موجود` },
          { status: 400 }
        );
      }

      if (product.stock < item.quantity) {
        return NextResponse.json(
          { 
            error: `الكمية المتوفرة من "${product.nameAr}" هي ${product.stock} فقط`,
            availableStock: product.stock,
            productId: product.id
          },
          { status: 400 }
        );
      }
    }

    // إنشاء رقم طلب فريد
    const orderNumber = `QSR-${Date.now().toString().slice(-8)}`;

    // ✅ حفظ الطلب في قاعدة البيانات
    const order = await prisma.order.create({
      data: {
        orderNumber,
        customerName: body.customerName,
        customerPhone: body.customerPhone,
        customerEmail: body.customerEmail || '',
        wilaya: body.wilaya || '',
        commune: body.commune || '',
        address: body.address || '',
        notes: body.notes || '',
        status: 'pending',
        paymentMethod: body.paymentMethod || 'cash_on_delivery',
        priority: 'medium',
        subtotal: parseFloat(body.subtotal) || 0,
        shippingCost: parseFloat(body.shippingCost) || 0,
        total: parseFloat(body.total) || 0,
        items: {
          create: body.items.map((item: any) => ({
            productId: item.productId || item.id,
            productName: item.productName || item.nameAr || item.name,
            quantity: parseInt(item.quantity) || 1,
            price: parseFloat(item.price) || 0,
          })),
        },
      },
      include: {
        items: true,
      },
    });

    // ✅ خصم الكمية من المخزون
    for (const item of body.items) {
      await prisma.product.update({
        where: { id: item.productId || item.id },
        data: {
          stock: {
            decrement: item.quantity,
          },
        },
      });

      console.log(`✅ تم خصم ${item.quantity} من المنتج ${item.productName || item.nameAr}`);
    }

    // 🔔 إنشاء إشعار للـ Admin
    await createNotification(
      'order',
      '📦 طلبية جديدة!',
      `طلبية جديدة من ${order.customerName} - ${order.total.toLocaleString()} دج`,
      `/admin/orders/${order.id}`
    );

    console.log('✅ تم حفظ الطلب بنجاح:', order.orderNumber);

    return NextResponse.json({ 
      success: true, 
      order,
      orderNumber: order.orderNumber,
      message: 'تم إنشاء الطلب بنجاح' 
    }, { status: 201 });

  } catch (error: any) {
    console.error('❌ خطأ في حفظ الطلب:', error);
    return NextResponse.json(
      { 
        error: 'فشل في إنشاء الطلب',
        details: error.message 
      },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');

    const where: any = {};
    if (status && status !== 'all') {
      where.status = status;
    }

    const orders = await prisma.order.findMany({
      where,
      include: {
        items: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    console.log(`✅ تم جلب ${orders.length} طلب`);

    return NextResponse.json(orders);
  } catch (error) {
    console.error('❌ خطأ في جلب الطلبات:', error);
    return NextResponse.json(
      { error: 'فشل في جلب الطلبات' },
      { status: 500 }
    );
  }
}
