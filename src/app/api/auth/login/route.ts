import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'البريد الإلكتروني وكلمة السر مطلوبان' },
        { status: 400 }
      );
    }

    // البحث عن المستخدم في MongoDB
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'البريد الإلكتروني أو كلمة السر غير صحيحة' },
        { status: 401 }
      );
    }

    // التحقق من كلمة السر (بدون تشفير - للبساطة)
    if (user.password !== password) {
      return NextResponse.json(
        { error: 'البريد الإلكتروني أو كلمة السر غير صحيحة' },
        { status: 401 }
      );
    }

    // التحقق من الحساب نشط
    if (!user.isActive) {
      return NextResponse.json(
        { error: 'الحساب معطل' },
        { status: 403 }
      );
    }

    // تحديث آخر تسجيل دخول
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLogin: new Date() },
    });

    // إرجاع بيانات المستخدم بدون كلمة السر
    const { password: _, ...userData } = user;

    return NextResponse.json({
      success: true,
      user: userData,
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'حدث خطأ أثناء تسجيل الدخول' },
      { status: 500 }
    );
  }
}
