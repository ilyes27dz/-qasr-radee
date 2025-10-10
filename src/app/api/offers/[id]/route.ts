import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const data = await request.json();
    
    const offer = await prisma.offer.update({
      where: { id: params.id },
      data: {
        title: data.title,
        description: data.description,
        discount: data.discount,
        image: data.image,
        category: data.category,
        link: data.link,
        color: data.color,
        isActive: data.isActive,
        endDate: data.endDate ? new Date(data.endDate) : null,
      }
    });
    
    return NextResponse.json(offer);
  } catch (error) {
    console.error('Error updating offer:', error);
    return NextResponse.json({ error: 'Failed to update offer' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.offer.delete({
      where: { id: params.id }
    });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting offer:', error);
    return NextResponse.json({ error: 'Failed to delete offer' }, { status: 500 });
  }
}
