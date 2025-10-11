import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET - جلب الأسعار
export async function GET() {
  try {
    const prices = await prisma.shippingPrice.findMany({
      orderBy: { wilayaCode: 'asc' }
    });

    return NextResponse.json(prices);
  } catch (error) {
    console.error('❌ Error fetching prices:', error);
    return NextResponse.json({ error: 'فشل جلب الأسعار' }, { status: 500 });
  }
}

// POST - حفظ/تحديث الأسعار
export async function POST(request: NextRequest) {
  try {
    const { wilayaCode, wilayaName, homePrice, officePrice } = await request.json();

    const price = await prisma.shippingPrice.upsert({
      where: { wilayaCode },
      update: { homePrice, officePrice, wilayaName },
      create: { wilayaCode, wilayaName, homePrice, officePrice }
    });

    return NextResponse.json(price);
  } catch (error) {
    console.error('❌ Error saving price:', error);
    return NextResponse.json({ error: 'فشل حفظ السعر' }, { status: 500 });
  }
}
