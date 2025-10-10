import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const offers = await prisma.offer.findMany({
      where: { isActive: true },
      orderBy: { createdAt: 'desc' }
    });
    
    return NextResponse.json(offers);
  } catch (error) {
    console.error('Error fetching offers:', error);
    return NextResponse.json({ error: 'Failed to fetch offers' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    
    const offer = await prisma.offer.create({
      data: {
        title: data.title,
        description: data.description,
        discount: data.discount,
        image: data.image,
        category: data.category,
        link: data.link,
        color: data.color || 'blue',
        endDate: data.endDate ? new Date(data.endDate) : null,
      }
    });
    
    return NextResponse.json(offer);
  } catch (error) {
    console.error('Error creating offer:', error);
    return NextResponse.json({ error: 'Failed to create offer' }, { status: 500 });
  }
}
