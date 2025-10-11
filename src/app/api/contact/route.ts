import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const { name, email, phone, message } = await request.json();

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'الرجاء ملء جميع الحقول المطلوبة' },
        { status: 400 }
      );
    }

    // ✅ حفظ الرسالة
    const contactMessage = await prisma.contactMessage.create({
      data: {
        name,
        email,
        ...(phone && { phone }),
        message,
        status: 'new',
      },
    });

    // ✅ إنشاء إشعار للأدمن
    await prisma.notification.create({
      data: {
        type: 'contact',
        title: 'رسالة جديدة',
        message: `رسالة جديدة من ${name}`,
        link: '/admin/messages',
        read: false,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'تم إرسال رسالتك بنجاح! سنتواصل معك قريباً ✅',
      data: contactMessage,
    });
  } catch (error) {
    console.error('❌ Error saving contact message:', error);
    return NextResponse.json(
      { error: 'حدث خطأ أثناء إرسال الرسالة' },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const messages = await prisma.contactMessage.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(messages);
  } catch (error) {
    console.error('❌ Error fetching messages:', error);
    return NextResponse.json(
      { error: 'Failed to fetch messages' },
      { status: 500 }
    );
  }
}
