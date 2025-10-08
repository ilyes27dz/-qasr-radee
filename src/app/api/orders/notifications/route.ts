import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    const newOrdersCount = await prisma.order.count({
      where: {
        status: 'pending',
      },
    });

    return NextResponse.json({ 
      count: newOrdersCount,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('خطأ في جلب عدد الطلبات:', error);
    return NextResponse.json({ count: 0 }, { status: 500 });
  }
}
