export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const code = searchParams.get('code');

    if (!code) {
      return NextResponse.json({ error: 'كود الكوبون مطلوب' }, { status: 400 });
    }

    const coupon = await prisma.coupon.findUnique({
      where: { code: code.toUpperCase() }
    });

    if (!coupon) {
      return NextResponse.json({ error: 'كود غير صحيح' }, { status: 404 });
    }

    if (!coupon.isActive) {
      return NextResponse.json({ error: 'الكوبون غير فعال' }, { status: 400 });
    }

    if (coupon.expiresAt && new Date(coupon.expiresAt) < new Date()) {
      return NextResponse.json({ error: 'انتهت صلاحية الكوبون' }, { status: 400 });
    }

    if (coupon.maxUses && coupon.usedCount >= coupon.maxUses) {
      return NextResponse.json({ error: 'تم استخدام الكوبون بالكامل' }, { status: 400 });
    }

    return NextResponse.json(coupon);
  } catch (error) {
    console.error('Error validating coupon:', error);
    return NextResponse.json({ error: 'فشل التحقق' }, { status: 500 });
  }
}
