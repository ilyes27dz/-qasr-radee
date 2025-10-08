const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function fixPasswords() {
  try {
    console.log('🔄 جاري تحديث كلمات المرور...\n');

    // Hash كلمة المرور 123456
    const hashedPassword = await bcrypt.hash('123456', 10);
    
    console.log('🔒 Hash الجديد:', hashedPassword);
    console.log('');

    // تحديث Admin (ilyes)
    const admin = await prisma.user.update({
      where: { email: 'ilyes.negh@gmail.com' },
      data: { password: hashedPassword },
    });
    console.log('✅ تم تحديث Admin:', admin.email);

    // تحديث Employee (mustafa)
    const employee = await prisma.user.update({
      where: { email: 'm@gmail.com' },
      data: { password: hashedPassword },
    });
    console.log('✅ تم تحديث Employee:', employee.email);

    console.log('\n🎉 تم التحديث بنجاح!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📧 معلومات تسجيل الدخول:');
    console.log('');
    console.log('👨‍💼 Admin:');
    console.log('   البريد: ilyes.negh@gmail.com');
    console.log('   كلمة المرور: 123456');
    console.log('');
    console.log('👤 Employee:');
    console.log('   البريد: m@gmail.com');
    console.log('   كلمة المرور: 123456');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  } catch (error) {
    console.error('❌ خطأ:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

fixPasswords();
