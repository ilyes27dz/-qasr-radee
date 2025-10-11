import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    let { orderNumber, phone } = body;

    // ✅ تنظيف المدخلات
    orderNumber = orderNumber?.trim();
    phone = phone?.trim();

    console.log('🔍 Tracking order:', { orderNumber, phone });

    if (!orderNumber && !phone) {
      return NextResponse.json(
        { error: 'Order number or phone is required' },
        { status: 400 }
      );
    }

    // ✅ بحث مرن باستخدام OR
    const whereConditions: any[] = [];

    if (orderNumber) {
      whereConditions.push({
        orderNumber: {
          contains: orderNumber,
          mode: 'insensitive'
        }
      });
    }

    if (phone) {
      whereConditions.push({
        customerPhone: phone
      });
    }

    const order = await prisma.order.findFirst({
      where: {
        OR: whereConditions
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!order) {
      console.log('❌ Order not found');
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    console.log('✅ Order found:', order.orderNumber);
    return NextResponse.json(order);
  } catch (error: any) {
    console.error('❌ Error tracking order:', error);
    return NextResponse.json(
      { error: 'Failed to track order', details: error.message },
      { status: 500 }
    );
  }
}
