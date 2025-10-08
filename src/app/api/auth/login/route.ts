import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    console.log('🔐 محاولة تسجيل دخول:', email);

    // تحقق من البيانات
    if (!email || !password) {
      console.log('❌ بيانات ناقصة');
      return NextResponse.json(
        { error: 'البريد الإلكتروني وكلمة المرور مطلوبان' },
        { status: 400 }
      );
    }

    // تنظيف البريد الإلكتروني
    const cleanEmail = email.toLowerCase().trim();
    console.log('📧 البريد بعد التنظيف:', cleanEmail);

    // البحث عن المستخدم
    const user = await prisma.user.findUnique({
      where: { email: cleanEmail },
    });

    if (!user) {
      console.log('❌ المستخدم غير موجود:', cleanEmail);
      return NextResponse.json(
        { error: 'البريد الإلكتروني أو كلمة المرور غير صحيحة' },
        { status: 401 }
      );
    }

    console.log('👤 المستخدم موجود:', user.email, '- الدور:', user.role);

    // التحقق من كلمة المرور
    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    console.log('🔑 كلمة المرور صحيحة؟', isPasswordValid);

    if (!isPasswordValid) {
      console.log('❌ كلمة المرور خاطئة');
      return NextResponse.json(
        { error: 'البريد الإلكتروني أو كلمة المرور غير صحيحة' },
        { status: 401 }
      );
    }

    console.log('✅ تسجيل دخول ناجح!');

    // إرجاع بيانات المستخدم
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
  } catch (error: any) {
    console.error('❌ خطأ في تسجيل الدخول:', error);
    return NextResponse.json(
      { error: 'حدث خطأ في الخادم' },
      { status: 500 }
    );
  }
}
