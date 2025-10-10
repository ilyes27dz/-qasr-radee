import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const data = await request.json();
    
    const coupon = await prisma.coupon.update({
      where: { id: params.id },
      data: {
        code: data.code,
        discount: data.discount,
        discountType: data.discountType,
        minAmount: data.minAmount,
        maxUses: data.maxUses,
        isActive: data.isActive ?? true,
        expiresAt: data.expiresAt ? new Date(data.expiresAt) : null,
      }
    });
    
    return NextResponse.json(coupon);
  } catch (error) {
    console.error('Error updating coupon:', error);
    return NextResponse.json({ error: 'Failed to update coupon' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.coupon.delete({
      where: { id: params.id }
    });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting coupon:', error);
    return NextResponse.json({ error: 'Failed to delete coupon' }, { status: 500 });
  }
}
