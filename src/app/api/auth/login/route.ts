import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    console.log('🔐 محاولة تسجيل دخول:', email);

    if (!email || !password) {
      return NextResponse.json(
        { error: 'البريد وكلمة المرور مطلوبان' },
        { status: 400 }
      );
    }

    // البحث عن المستخدم
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() }, // ✅ تنظيف البريد
    });

    if (!user) {
      console.log('❌ المستخدم غير موجود');
      return NextResponse.json(
        { error: 'البريد الإلكتروني أو كلمة المرور غير صحيحة' },
        { status: 401 }
      );
    }

    // التحقق من كلمة المرور
    const isValid = await bcrypt.compare(password, user.password);

    if (!isValid) {
      console.log('❌ كلمة المرور خاطئة');
      return NextResponse.json(
        { error: 'البريد الإلكتروني أو كلمة المرور غير صحيحة' },
        { status: 401 }
      );
    }

    console.log('✅ تسجيل دخول ناجح');

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        permissions: user.permissions || [],
      },
    });
  } catch (error) {
    console.error('❌ خطأ في تسجيل الدخول:', error);
    return NextResponse.json(
      { error: 'حدث خطأ في الخادم' },
      { status: 500 }
    );
  }
}
