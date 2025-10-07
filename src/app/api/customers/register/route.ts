import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(request: NextRequest) {
  try {
    const { name, email, phone, password } = await request.json();

    // التحقق من البيانات
    if (!name || !email || !phone || !password) {
      return NextResponse.json(
        { error: 'جميع الحقول مطلوبة' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'كلمة المرور يجب أن تكون 6 أحرف على الأقل' },
        { status: 400 }
      );
    }

    // التحقق من وجود البريد الإلكتروني
    const existingCustomer = await prisma.customer.findUnique({
      where: { email },
    });

    if (existingCustomer) {
      return NextResponse.json(
        { error: 'البريد الإلكتروني مسجل مسبقاً' },
        { status: 400 }
      );
    }

    // تشفير كلمة المرور
    const hashedPassword = await bcrypt.hash(password, 10);

    // إنشاء عميل جديد
    const newCustomer = await prisma.customer.create({
      data: {
        name,
        email,
        phone,
        password: hashedPassword,
        role: 'customer',
      },
    });

    // إرجاع بيانات العميل بدون كلمة المرور
    const { password: _, ...customerWithoutPassword } = newCustomer;

    return NextResponse.json({
      customer: customerWithoutPassword,
      message: 'تم التسجيل بنجاح',
    });
  } catch (error) {
    console.error('Register error:', error);
    return NextResponse.json(
      { error: 'حدث خطأ في التسجيل' },
      { status: 500 }
    );
  }
}
