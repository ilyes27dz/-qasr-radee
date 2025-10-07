import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

// جلب جميع الموظفين
export async function GET() {
  try {
    const employees = await prisma.user.findMany({
      where: {
        OR: [
          { role: 'admin' },
          { role: 'employee' }
        ]
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        permissions: true,
        department: true,
        employeeId: true,
        isActive: true,
        lastLogin: true,
        hiredDate: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json(employees);
  } catch (error) {
    console.error('Error fetching employees:', error);
    return NextResponse.json({ error: 'Failed to fetch employees' }, { status: 500 });
  }
}

// إضافة موظف جديد
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // التحقق من عدم وجود الإيميل
    const existingUser = await prisma.user.findUnique({
      where: { email: body.email }
    });

    if (existingUser) {
      return NextResponse.json({ error: 'الإيميل مستخدم بالفعل' }, { status: 400 });
    }

    // تشفير كلمة المرور
    const hashedPassword = await bcrypt.hash(body.password, 10);

    // إنشاء الموظف
    const employee = await prisma.user.create({
      data: {
        name: body.name,
        email: body.email,
        phone: body.phone || null,
        password: hashedPassword,
        role: body.role || 'employee',
        permissions: body.permissions || [],
        department: body.department || null,
        employeeId: body.employeeId || null,
        hiredDate: new Date(),
        isActive: true,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        permissions: true,
        department: true,
      }
    });

    return NextResponse.json(employee, { status: 201 });
  } catch (error) {
    console.error('Error creating employee:', error);
    return NextResponse.json({ error: 'Failed to create employee' }, { status: 500 });
  }
}
