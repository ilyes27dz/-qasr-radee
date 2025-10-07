import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();

    const user = await prisma.user.update({
      where: { id: params.id },
      data: body,
    });

    const { password, ...userWithoutPassword } = user;

    console.log('✅ User updated:', user.email);

    return NextResponse.json(userWithoutPassword);
  } catch (error) {
    console.error('❌ Error updating user:', error);
    return NextResponse.json({ error: 'Failed to update user' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.user.delete({
      where: { id: params.id },
    });

    console.log('✅ User deleted');

    return NextResponse.json({ deleted: true });
  } catch (error) {
    console.error('❌ Error deleting user:', error);
    return NextResponse.json({ error: 'Failed to delete user' }, { status: 500 });
  }
}
