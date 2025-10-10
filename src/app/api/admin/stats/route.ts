export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';


import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    // إحصائيات الطلبات
    const totalOrders = await prisma.order.count();
    const pendingOrders = await prisma.order.count({
      where: { status: 'pending' },
    });
    
    const deliveredOrders = await prisma.order.findMany({
      where: { status: 'delivered' },
    });
    
    const totalSales = deliveredOrders.reduce((sum, order) => sum + order.total, 0);

    // إحصائيات المنتجات
    const totalProducts = await prisma.product.count();
    const activeProducts = await prisma.product.count({
      where: { enabled: true },
    });

    // إحصائيات العملاء
    const totalCustomers = await prisma.customer.count();

    // آخر الطلبات
    const recentOrders = await prisma.order.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: { items: true },
    });

    console.log('✅ Stats calculated');

    return NextResponse.json({
      totalSales,
      totalOrders,
      pendingOrders,
      totalProducts,
      activeProducts,
      totalCustomers,
      recentOrders,
    });
  } catch (error) {
    console.error('❌ Error fetching stats:', error);
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 });
  }
}
