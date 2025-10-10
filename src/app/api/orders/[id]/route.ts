import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET - جلب طلب واحد
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const order = await prisma.order.findUnique({
      where: { id: params.id },
      include: {
        items: true,
      },
    });

    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(order);
  } catch (error) {
    console.error('Error fetching order:', error);
    return NextResponse.json(
      { error: 'Failed to fetch order' },
      { status: 500 }
    );
  }
}

// PUT - تحديث طلب (مع إدارة المخزون)
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { status: newStatus } = body;

    // ✅ جلب الطلب القديم
    const oldOrder = await prisma.order.findUnique({
      where: { id: params.id },
      include: { items: true },
    });

    if (!oldOrder) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    // ✅ إذا تم إلغاء الطلب - إرجاع الكمية للمخزون
    if (newStatus === 'cancelled' && oldOrder.status !== 'cancelled') {
      console.log('🔄 إلغاء الطلب - إرجاع الكمية للمخزون');
      
      for (const item of oldOrder.items) {
        await prisma.product.update({
          where: { id: item.productId },
          data: {
            stock: {
              increment: item.quantity,
            },
          },
        });

        console.log(`✅ تم إرجاع ${item.quantity} من ${item.productName}`);
      }
    }

    // ✅ إذا تم إلغاء الإلغاء (من cancelled إلى أي حالة أخرى)
    if (oldOrder.status === 'cancelled' && newStatus !== 'cancelled') {
      console.log('🔄 إعادة تفعيل الطلب - خصم الكمية من المخزون');
      
      // التحقق من توفر الكمية أولاً
      for (const item of oldOrder.items) {
        const product = await prisma.product.findUnique({
          where: { id: item.productId },
        });

        if (!product || product.stock < item.quantity) {
          return NextResponse.json(
            { 
              error: `الكمية المتوفرة من "${item.productName}" غير كافية (متوفر: ${product?.stock || 0})` 
            },
            { status: 400 }
          );
        }
      }

      // خصم الكمية
      for (const item of oldOrder.items) {
        await prisma.product.update({
          where: { id: item.productId },
          data: {
            stock: {
              decrement: item.quantity,
            },
          },
        });

        console.log(`✅ تم خصم ${item.quantity} من ${item.productName}`);
      }
    }

    // ✅ تحديث حالة الطلب
    const order = await prisma.order.update({
      where: { id: params.id },
      data: {
        status: newStatus,
        priority: body.priority,
        notes: body.notes,
      },
      include: {
        items: true,
      },
    });

    return NextResponse.json(order);
  } catch (error) {
    console.error('Error updating order:', error);
    return NextResponse.json(
      { error: 'Failed to update order' },
      { status: 500 }
    );
  }
}

// DELETE - حذف طلب (مع إرجاع الكمية)
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // ✅ جلب الطلب مع العناصر
    const order = await prisma.order.findUnique({
      where: { id: params.id },
      include: { items: true },
    });

    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    // ✅ إرجاع الكمية للمخزون إذا لم يكن الطلب ملغى
    if (order.status !== 'cancelled') {
      for (const item of order.items) {
        await prisma.product.update({
          where: { id: item.productId },
          data: {
            stock: {
              increment: item.quantity,
            },
          },
        });

        console.log(`✅ تم إرجاع ${item.quantity} من ${item.productName} عند حذف الطلب`);
      }
    }

    // حذف عناصر الطلب أولاً
    await prisma.orderItem.deleteMany({
      where: { orderId: params.id },
    });

    // ثم حذف الطلب
    await prisma.order.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: 'Order deleted successfully' });
  } catch (error) {
    console.error('Error deleting order:', error);
    return NextResponse.json(
      { error: 'Failed to delete order' },
      { status: 500 }
    );
  }
}
