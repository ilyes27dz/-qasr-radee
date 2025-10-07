 import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 جاري إضافة البيانات التجريبية...');

  // حذف البيانات القديمة
  await prisma.review.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.product.deleteMany();
  await prisma.customer.deleteMany(); // ✅ تصحيح
  await prisma.user.deleteMany();
  await prisma.banner.deleteMany();

  // 1. إنشاء مستخدم Admin
  const hashedPassword = await bcrypt.hash('admin123', 10);
  
  const admin = await prisma.user.create({
    data: {
      name: 'Admin',
      email: 'admin@qsrradi3.com',
      password: hashedPassword,
      role: 'admin',
      phone: '0555123456',
    },
  });

  console.log('✅ تم إنشاء حساب Admin:', admin.email);
  console.log('📧 Email: admin@qsrradi3.com');
  console.log('🔑 Password: admin123');

  // 2. إنشاء عملاء تجريبيين
  const customer1 = await prisma.customer.create({ // ✅ تصحيح
    data: {
      name: 'أحمد بن علي',
      email: 'ahmed@example.com',
      password: await bcrypt.hash('customer123', 10),
      role: 'customer',
      phone: '0555111222',
    },
  });

  const customer2 = await prisma.customer.create({ // ✅ تصحيح
    data: {
      name: 'فاطمة محمد',
      email: 'fatima@example.com',
      password: await bcrypt.hash('customer123', 10),
      role: 'customer',
      phone: '0555333444',
    },
  });

  console.log('✅ تم إنشاء عملاء تجريبيين');

  // 3. إضافة منتجات
  const product1 = await prisma.product.create({
    data: {
      name: 'Baby Bottle',
      nameAr: 'زجاجة رضاعة للحليب',
      descriptionAr: 'زجاجة رضاعة عالية الجودة آمنة للأطفال، خالية من BPA، مصنوعة من مواد طبية آمنة 100%',
      price: 1500,
      salePrice: 1200,
      stock: 50,
      images: ['https://i.pinimg.com/736x/99/73/75/997375d6ac84565a9b189218e6ae101e.jpg'],
      category: 'للتغذية',
      categoryId: '1',
      rating: 4.8,
      sales: 150,
      featured: true,
      badge: 'أكثر مبيعاً',
      ageGroup: 'newborn',
      gender: 'unisex',
    },
  });

  const product2 = await prisma.product.create({
    data: {
      name: 'Baby Clothes Set',
      nameAr: 'طقم ملابس قطني',
      descriptionAr: 'طقم ملابس قطني مريح للأطفال، ناعم على البشرة',
      price: 2500,
      stock: 30,
      images: ['https://i.pinimg.com/1200x/40/e7/52/40e7522d6abff9f437dff85736e4dec7.jpg'],
      category: 'ملابس',
      categoryId: '2',
      rating: 4.5,
      sales: 95,
      featured: true,
      badge: 'جديد',
      ageGroup: '0-3months',
      gender: 'unisex',
    },
  });

  const product3 = await prisma.product.create({
    data: {
      name: 'Baby Stroller',
      nameAr: 'عربة أطفال فاخرة',
      descriptionAr: 'عربة أطفال قوية وآمنة بعجلات ممتازة، مريحة للطفل والوالدين',
      price: 25000,
      salePrice: 22000,
      stock: 15,
      images: ['https://i.pinimg.com/736x/1d/03/e5/1d03e5daf4591eb4188b7ee22fc7b7b9.jpg'],
      category: 'للخرجات',
      categoryId: '3',
      rating: 4.9,
      sales: 75,
      featured: true,
      badge: 'عرض',
      ageGroup: 'newborn',
      gender: 'unisex',
    },
  });

  const product4 = await prisma.product.create({
    data: {
      name: 'Baby Diapers',
      nameAr: 'حفاضات للأطفال',
      descriptionAr: 'حفاضات عالية الامتصاص، مريحة وآمنة للطفل',
      price: 1800,
      stock: 100,
      images: ['https://i.pinimg.com/736x/99/73/75/997375d6ac84565a9b189218e6ae101e.jpg'],
      category: 'للنظافة',
      categoryId: '4',
      rating: 4.7,
      sales: 200,
      featured: false,
      ageGroup: 'newborn',
      gender: 'unisex',
    },
  });

  const product5 = await prisma.product.create({
    data: {
      name: 'Baby Crib',
      nameAr: 'سرير أطفال خشبي',
      descriptionAr: 'سرير أطفال آمن ومريح، مصنوع من خشب طبيعي',
      price: 15000,
      salePrice: 13500,
      stock: 20,
      images: ['https://i.pinimg.com/1200x/40/e7/52/40e7522d6abff9f437dff85736e4dec7.jpg'],
      category: 'للنوم',
      categoryId: '5',
      rating: 4.6,
      sales: 45,
      featured: false,
      ageGroup: 'newborn',
      gender: 'unisex',
    },
  });

  console.log('✅ تم إضافة 5 منتجات');

  // 4. إضافة تقييمات
  await prisma.review.createMany({
    data: [
      {
        productId: product1.id,
        customerId: customer1.id, // ✅ تصحيح
        rating: 5,
        comment: 'منتج ممتاز وجودة عالية، طفلي يحبها كثيراً!',
      },
      {
        productId: product1.id,
        customerId: customer2.id, // ✅ تصحيح
        rating: 5,
        comment: 'أفضل زجاجة استخدمتها، سهلة التنظيف',
      },
      {
        productId: product2.id,
        customerId: customer1.id, // ✅ تصحيح
        rating: 4,
        comment: 'جيدة جداً، السعر مناسب',
      },
    ],
  });

  console.log('✅ تم إضافة التقييمات');

  // 5. إضافة طلبات تجريبية
  const order1 = await prisma.order.create({
    data: {
      orderNumber: 'QSR-001',
      customerId: customer1.id, // ✅ إضافة
      customerName: 'أحمد بن علي',
      customerPhone: '0555111222',
      customerEmail: 'ahmed@example.com',
      wilaya: 'الجزائر',
      commune: 'باب الوادي',
      address: 'حي السلام، شارع 14، رقم 25',
      status: 'pending',
      paymentMethod: 'cash_on_delivery',
      priority: 'high',
      subtotal: 3700,
      shippingCost: 500,
      total: 4200,
      items: {
        create: [
          {
            productId: product1.id,
            productName: product1.nameAr,
            quantity: 2,
            price: product1.salePrice || product1.price,
          },
          {
            productId: product2.id,
            productName: product2.nameAr,
            quantity: 1,
            price: product2.price,
          },
        ],
      },
    },
  });

  const order2 = await prisma.order.create({
    data: {
      orderNumber: 'QSR-002',
      customerId: customer2.id, // ✅ إضافة
      customerName: 'فاطمة محمد',
      customerPhone: '0555333444',
      customerEmail: 'fatima@example.com',
      wilaya: 'وهران',
      commune: 'السانيا',
      address: 'حي المنظر الجميل، عمارة 5',
      status: 'confirmed',
      paymentMethod: 'cash_on_delivery',
      priority: 'medium',
      subtotal: 22000,
      shippingCost: 800,
      total: 22800,
      items: {
        create: [
          {
            productId: product3.id,
            productName: product3.nameAr,
            quantity: 1,
            price: product3.salePrice || product3.price,
          },
        ],
      },
    },
  });

  console.log('✅ تم إضافة طلبات تجريبية');

  // 6. إضافة الشعارات
  await prisma.banner.createMany({
    data: [
      { 
        text: 'توصيل مجاني للطلبات +5000 دج 🚚', 
        color: 'from-blue-600 to-indigo-600', 
        enabled: true, 
        order: 1 
      },
      { 
        text: '🎁 خصم 30% على جميع المنتجات', 
        color: 'from-purple-600 to-pink-600', 
        enabled: true, 
        order: 2 
      },
      { 
        text: '⚡ توصيل سريع 24-48 ساعة', 
        color: 'from-orange-600 to-red-600', 
        enabled: true, 
        order: 3 
      },
      { 
        text: '✅ منتجات مضمونة 100%', 
        color: 'from-green-600 to-emerald-600', 
        enabled: true, 
        order: 4 
      },
      { 
        text: '📦 تغليف آمن ومميز', 
        color: 'from-teal-600 to-cyan-600', 
        enabled: true, 
        order: 5 
      },
    ],
  });

  console.log('✅ تم إضافة الشعارات');
  
  console.log('\n🎉 تم الانتهاء من إضافة جميع البيانات التجريبية!');
  console.log('\n📊 الإحصائيات:');
  console.log('- المستخدمين: 3 (1 أدمن + 2 عملاء)');
  console.log('- المنتجات: 5');
  console.log('- الطلبات: 2');
  console.log('- التقييمات: 3');
  console.log('- الشعارات: 5');
}

main()
  .catch((e) => {
    console.error('❌ خطأ:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
