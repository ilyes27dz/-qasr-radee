import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// تعريف نوع للـ attributes
interface ProductAttributes {
  colors?: string[];
  colorStock?: Record<string, number>;
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const order = await prisma.order.findUnique({
      where: { id: params.id },
      include: { items: true },
    });

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    return NextResponse.json(order);
  } catch (error) {
    console.error('Error fetching order:', error);
    return NextResponse.json({ error: 'Failed to fetch order' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { status } = body;

    // 🔄 جلب الطلب الحالي لمعرفة الحالة السابقة
    const currentOrder = await prisma.order.findUnique({
      where: { id: params.id },
      include: { items: true },
    });

    if (!currentOrder) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    // ✅ إذا تم تغيير الحالة إلى "ملغي" - استرجاع المخزون
    if (status === 'cancelled' && currentOrder.status !== 'cancelled') {
      await restoreOrderStock(currentOrder);
    }

    // ✅ إذا تم تغيير الحالة من "ملغي" إلى حالة أخرى - خصم المخزون مرة أخرى
    if (currentOrder.status === 'cancelled' && status !== 'cancelled') {
      await deductOrderStock(currentOrder);
    }

    // تحديث حالة الطلب
    const order = await prisma.order.update({
      where: { id: params.id },
      data: body,
    });

    console.log('✅ Order updated:', order.orderNumber);

    return NextResponse.json(order);
  } catch (error) {
    console.error('Error updating order:', error);
    return NextResponse.json({ error: 'Failed to update order' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // 🔄 جلب الطلب أولاً لاسترجاع المخزون
    const order = await prisma.order.findUnique({
      where: { id: params.id },
      include: { items: true },
    });

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    // ✅ استرجاع المخزون قبل الحذف (فقط إذا لم يكن الطلب ملغياً)
    if (order.status !== 'cancelled') {
      await restoreOrderStock(order);
    }

    // حذف الطلب
    await prisma.order.delete({
      where: { id: params.id },
    });

    console.log(`✅ تم حذف الطلب ${order.orderNumber} واسترجاع المخزون`);

    return NextResponse.json({ deleted: true });
  } catch (error) {
    console.error('Error deleting order:', error);
    return NextResponse.json({ error: 'Failed to delete order' }, { status: 500 });
  }
}

// 🔧 دالة مساعدة: استرجاع مخزون الطلب (للالوان والعام)
async function restoreOrderStock(order: any) {
  for (const item of order.items) {
    const product = await prisma.product.findUnique({
      where: { id: item.productId },
    });

    if (product) {
      const attributes = product.attributes as ProductAttributes | null;
      let updateData: any = {
        stock: {
          increment: item.quantity,
        },
        sales: {
          decrement: item.quantity,
        },
      };

      // 🔄 استرجاع مخزون الألوان إذا كان هناك لون محدد
      const itemAttributes = item.attributes as { color?: string } | null;
      if (itemAttributes?.color && attributes?.colorStock) {
        const currentColorStock = attributes.colorStock[itemAttributes.color] || 0;
        const newColorStock = currentColorStock + item.quantity;
        
        updateData.attributes = {
          ...attributes,
          colorStock: {
            ...attributes.colorStock,
            [itemAttributes.color]: newColorStock,
          },
        };

        console.log(`✅ تم استرجاع ${item.quantity} للمنتج ${product.nameAr} (لون: ${itemAttributes.color}) - أصبح: ${newColorStock}`);
      } else {
        console.log(`✅ تم استرجاع ${item.quantity} للمنتج ${product.nameAr} - أصبح: ${product.stock + item.quantity}`);
      }

      await prisma.product.update({
        where: { id: item.productId },
        data: updateData,
      });
    }
  }
  console.log(`✅ تم استرجاع المخزون للطلب ${order.orderNumber}`);
}

// 🔧 دالة مساعدة: خصم مخزون الطلب (للالوان والعام)
async function deductOrderStock(order: any) {
  for (const item of order.items) {
    const product = await prisma.product.findUnique({
      where: { id: item.productId },
    });

    if (product) {
      const attributes = product.attributes as ProductAttributes | null;
      let updateData: any = {
        stock: {
          decrement: item.quantity,
        },
        sales: {
          increment: item.quantity,
        },
      };

      // 🔄 خصم مخزون الألوان إذا كان هناك لون محدد
      const itemAttributes = item.attributes as { color?: string } | null;
      if (itemAttributes?.color && attributes?.colorStock) {
        const currentColorStock = attributes.colorStock[itemAttributes.color] || 0;
        const newColorStock = Math.max(0, currentColorStock - item.quantity);
        
        updateData.attributes = {
          ...attributes,
          colorStock: {
            ...attributes.colorStock,
            [itemAttributes.color]: newColorStock,
          },
        };

        console.log(`✅ تم خصم ${item.quantity} من المنتج ${product.nameAr} (لون: ${itemAttributes.color}) - المتبقي: ${newColorStock}`);
      }

      await prisma.product.update({
        where: { id: item.productId },
        data: updateData,
      });
    }
  }
  console.log(`✅ تم خصم المخزون للطلب ${order.orderNumber}`);
}
