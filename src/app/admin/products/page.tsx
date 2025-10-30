'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  Package, Plus, Edit, Trash2, Search,
  LogOut, Home, RefreshCw, Star,
  AlertCircle, CheckCircle, X, Save, DollarSign,
  Upload, Image as ImageIcon
} from 'lucide-react';
import toast from 'react-hot-toast';
import { uploadMultipleToCloudinary } from '@/lib/cloudinary';

const categories = [
  { id: 'all', name: 'الكل', icon: '🛍️' },
  { id: 'للتغذية', name: 'للتغذية', icon: '🍼' },
  { id: 'للرضاعة', name: 'للرضاعة', icon: '👶' },
  { id: 'ملابس', name: 'ملابس', icon: '👕' },
  { id: 'للخرجات', name: 'للخرجات', icon: '🎒' },
  { id: 'للنظافة', name: 'للنظافة', icon: '🛁' },
  { id: 'للنوم', name: 'للنوم', icon: '🌙' },
];

const ageGroups = [
  { value: 'newborn', label: 'حديث الولادة (0-3 شهور)' },
  { value: '3-6months', label: '3-6 شهور' },
  { value: '6-12months', label: '6-12 شهر' },
  { value: '1-2years', label: '1-2 سنة' },
  { value: '2-4years', label: '2-4 سنوات' },
];

// ✅ الحقول الديناميكية حسب الفئة
const categorySpecifications: Record<string, Array<{name: string; label: string; type: string; options?: string[]}>> = {
  'ملابس': [
    { name: 'size', label: 'المقاس', type: 'select', options: ['حديث الولادة', '0-3 شهور', '3-6 شهور', '6-12 شهر', '12-18 شهر', '18-24 شهر'] },
    { name: 'age', label: 'السن المناسب', type: 'select', options: ['0-3 شهور', '3-6 شهور', '6-12 شهر', '1-2 سنة', '2-3 سنوات'] },
    { name: 'color', label: 'اللون', type: 'text' },
    { name: 'material', label: 'المادة', type: 'select', options: ['قطن 100%', 'قطن ممزوج', 'صوف', 'حرير'] },
  ],
  'للتغذية': [
    { name: 'color', label: 'اللون', type: 'text' },
    { name: 'capacity', label: 'السعة/الحجم', type: 'select', options: ['150ml', '250ml', '330ml', '500ml', 'حسب الطلب'] },
    { name: 'material', label: 'المادة', type: 'select', options: ['بلاستيك طبي', 'زجاج', 'سيليكون', 'ستانلس ستيل'] },
    { name: 'brand', label: 'الماركة', type: 'text' },
  ],
  'للرضاعة': [
    { name: 'color', label: 'اللون', type: 'text' },
    { name: 'capacity', label: 'السعة', type: 'select', options: ['120ml', '150ml', '240ml', '300ml'] },
    { name: 'material', label: 'النوع', type: 'select', options: ['زجاج', 'بلاستيك آمن', 'سيليكون'] },
    { name: 'anti_colic', label: 'مضادة للقولونج', type: 'select', options: ['نعم', 'لا'] },
  ],
  'ألعاب': [
    { name: 'age', label: 'السن المناسب', type: 'select', options: ['0-6 شهور', '6-12 شهر', '1-2 سنة', '2-3 سنوات', '3+ سنوات'] },
    { name: 'color', label: 'اللون', type: 'text' },
    { name: 'material', label: 'المادة', type: 'select', options: ['بلاستيك آمن', 'خشب طبيعي', 'قماش', 'مطاط', 'معدن'] },
    { name: 'safety', label: 'شهادة الأمان', type: 'select', options: ['CE', 'FDA', 'لا توجد'] },
  ],
  'للخرجات': [
    { name: 'color', label: 'اللون', type: 'text' },
    { name: 'capacity', label: 'السعة', type: 'select', options: ['صغير', 'متوسط', 'كبير'] },
    { name: 'material', label: 'المادة', type: 'select', options: ['قماش مقاوم', 'جلد صناعي', 'نايلون'] },
    { name: 'features', label: 'المميزات', type: 'text' },
  ],
  'للنظافة': [
    { name: 'type', label: 'نوع المنتج', type: 'select', options: ['صابون', 'شامبو', 'مرطب', 'مناديل', 'كريم'] },
    { name: 'volume', label: 'الحجم', type: 'select', options: ['100ml', '200ml', '500ml', 'علبة 50 قطعة'] },
    { name: 'material', label: 'المكونات', type: 'text' },
    { name: 'hypoallergenic', label: 'طبيعي وآمن', type: 'select', options: ['نعم', 'لا'] },
  ],
  'للنوم': [
    { name: 'size', label: 'المقاس', type: 'select', options: ['حديث الولادة', '0-6 شهور', '6-12 شهر', '1-2 سنة'] },
    { name: 'material', label: 'المادة', type: 'select', options: ['قطن 100%', 'موسلين', 'حرير'] },
    { name: 'color', label: 'اللون', type: 'text' },
    { name: 'tog_rating', label: 'درجة الدفء', type: 'select', options: ['0.5 TOG', '1 TOG', '2.5 TOG'] },
  ],
};

export default function ProductsManagementPage() {
  const router = useRouter();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [user, setUser] = useState<any>(null);
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    nameAr: '',
    descriptionAr: '',
    specifications: '',
    price: 0,
    salePrice: 0,
    stock: 0,
    category: '',
    categoryId: '',
    ageGroup: 'newborn',
    gender: 'unisex',
    badge: '',
    featured: false,
    enabled: true,
    attributes: {} as Record<string, string>, // ✅ الحقول الديناميكية
  });

  useEffect(() => {
    const adminUser = localStorage.getItem('admin_user');
    if (!adminUser) {
      router.push('/staff/login');
      return;
    }
    
    const userData = JSON.parse(adminUser);
    setUser(userData);

    if (userData.role !== 'admin' && !userData.permissions?.includes('products')) {
      toast.error('ليس لديك صلاحية الوصول');
      router.push('/admin/dashboard');
      return;
    }

    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (selectedCategory !== 'all') params.append('category', selectedCategory);
      if (searchQuery) params.append('search', searchQuery);

      const response = await fetch(`/api/admin/products?${params}`);
      const data = await response.json();
      
      if (Array.isArray(data)) {
        setProducts(data);
        console.log('✅ Loaded products from MongoDB:', data.length);
      } else {
        setProducts([]);
        toast.error('خطأ في تحميل المنتجات');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('فشل تحميل المنتجات');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [selectedCategory, searchQuery]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);

    try {
      const filesArray = Array.from(files);
      const cloudinaryUrls = await uploadMultipleToCloudinary(filesArray);
      
      console.log('✅ تم رفع الصور على Cloudinary:', cloudinaryUrls);
      
      setUploadedImages([...uploadedImages, ...cloudinaryUrls]);
      toast.success(`تم رفع ${cloudinaryUrls.length} صورة على Cloudinary ✅`);
    } catch (error) {
      console.error('❌ خطأ في رفع الصور:', error);
      toast.error('فشل رفع الصور على Cloudinary');
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (index: number) => {
    setUploadedImages(uploadedImages.filter((_, i) => i !== index));
  };

  const handleAttributeChange = (key: string, value: string) => {
    setFormData({
      ...formData,
      attributes: {
        ...formData.attributes,
        [key]: value
      }
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (uploadedImages.length === 0) {
      toast.error('يجب رفع صورة واحدة على الأقل');
      return;
    }

    setLoading(true);

    try {
      const url = editingProduct 
        ? `/api/admin/products/${editingProduct.id}`
        : '/api/admin/products';
      
      const method = editingProduct ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          images: uploadedImages
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.error || 'فشل الحفظ');
        setLoading(false);
        return;
      }

      toast.success(editingProduct ? 'تم التحديث بنجاح ✅' : 'تم الإضافة بنجاح ✅');
      console.log('✅ Product saved:', data.nameAr);
      
      setShowModal(false);
      resetForm();
      fetchProducts();
    } catch (error) {
      console.error('Error:', error);
      toast.error('حدث خطأ');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, productName: string) => {
    if (!confirm(`هل أنت متأكد من حذف "${productName}"؟`)) return;

    try {
      const response = await fetch(`/api/admin/products/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast.success('✅ تم حذف المنتج بنجاح');
        fetchProducts();
      } else {
        const data = await response.json();
        toast.error(data.error || 'فشل الحذف');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('حدث خطأ أثناء الحذف');
    }
  };

  const handleToggleStatus = async (product: any) => {
    try {
      const response = await fetch(`/api/admin/products/${product.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          ...product, 
          enabled: !product.enabled 
        }),
      });

      if (response.ok) {
        toast.success(product.enabled ? 'تم إخفاء المنتج' : 'تم تفعيل المنتج');
        fetchProducts();
      } else {
        toast.error('فشل تحديث الحالة');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('حدث خطأ');
    }
  };

  const openEditModal = (product: any) => {
    setEditingProduct(product);
    const validImages = product.images?.filter((img: string) => 
      img && img !== 'placeholder.jpg' && img.startsWith('/uploads/')
    ) || [];
    setUploadedImages(validImages);
    
    setFormData({
      name: product.name,
      nameAr: product.nameAr,
      descriptionAr: product.descriptionAr,
      specifications: product.specifications || '',
      price: product.price,
      salePrice: product.salePrice || 0,
      stock: product.stock,
      category: product.category,
      categoryId: product.categoryId,
      ageGroup: product.ageGroup || 'newborn',
      gender: product.gender || 'unisex',
      badge: product.badge || '',
      featured: product.featured,
      enabled: product.enabled,
      attributes: product.attributes || {},
    });
    setShowModal(true);
  };

  const resetForm = () => {
    setEditingProduct(null);
    setUploadedImages([]);
    setFormData({
      name: '',
      nameAr: '',
      descriptionAr: '',
      specifications: '',
      price: 0,
      salePrice: 0,
      stock: 0,
      category: '',
      categoryId: '',
      ageGroup: 'newborn',
      gender: 'unisex',
      badge: '',
      featured: false,
      enabled: true,
      attributes: {},
    });
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_user');
    toast.success('تم تسجيل الخروج');
    router.push('/staff/login');
  };

  const getStockStatus = (stock: number) => {
    if (stock === 0) return { label: 'نفذ', color: 'bg-red-100 text-red-700' };
    if (stock < 10) return { label: 'قليل', color: 'bg-orange-100 text-orange-700' };
    return { label: 'متوفر', color: 'bg-green-100 text-green-700' };
  };

  const getProductImage = (images: string[]) => {
    if (!images || images.length === 0) return null;
    
    const validImage = images.find(img => {
      if (!img || img === 'placeholder.jpg') return false;
      return img.startsWith('/uploads/') || 
             img.startsWith('https://res.cloudinary.com/') ||
             img.startsWith('http');
    });
    
    return validImage || null;
  };

  const getCategoryAttributes = () => {
    return categorySpecifications[formData.category] || [];
  };

  return (
    <div className="min-h-screen bg-gray-50 font-arabic">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <Link href="/admin/dashboard" className="flex items-center gap-2">
              <Package className="w-8 h-8 text-blue-600" />
              <div>
                <span className="text-lg font-bold text-gray-900">إدارة المنتجات</span>
                <p className="text-xs text-gray-500">{products.length} منتج</p>
              </div>
            </Link>

            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  resetForm();
                  setShowModal(true);
                }}
                className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-blue-700"
              >
                <Plus className="w-5 h-5" />
                <span className="hidden md:inline">إضافة منتج</span>
              </button>

              <button onClick={fetchProducts} className="p-2 hover:bg-gray-50 rounded-lg">
                <RefreshCw className="w-5 h-5 text-gray-600" />
              </button>

              <Link href="/admin/dashboard" className="p-2 hover:bg-gray-50 rounded-lg">
                <Home className="w-5 h-5 text-gray-600" />
              </Link>

              <button onClick={handleLogout} className="p-2 hover:bg-red-50 rounded-lg">
                <LogOut className="w-5 h-5 text-red-600" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl p-4 shadow-sm border">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Package className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">إجمالي المنتجات</p>
                <p className="text-2xl font-bold text-gray-900">{products.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm border">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">منتجات نشطة</p>
                <p className="text-2xl font-bold text-gray-900">
                  {products.filter(p => p.enabled).length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm border">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">مخزون منخفض</p>
                <p className="text-2xl font-bold text-gray-900">
                  {products.filter(p => p.stock < 10 && p.stock > 0).length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm border">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <X className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">نفذ من المخزون</p>
                <p className="text-2xl font-bold text-gray-900">
                  {products.filter(p => p.stock === 0).length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl p-4 shadow-sm border mb-6">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="relative">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="ابحث عن منتج..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pr-12 px-4 py-3 bg-gray-50 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex gap-2 overflow-x-auto">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap font-semibold transition ${
                    selectedCategory === cat.id
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <span>{cat.icon}</span>
                  <span className="text-sm">{cat.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Products Table */}
        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-right p-4 text-sm font-semibold text-gray-600">المنتج</th>
                  <th className="text-right p-4 text-sm font-semibold text-gray-600">الفئة</th>
                  <th className="text-right p-4 text-sm font-semibold text-gray-600">السعر</th>
                  <th className="text-right p-4 text-sm font-semibold text-gray-600">المخزون</th>
                  <th className="text-right p-4 text-sm font-semibold text-gray-600">التقييم</th>
                  <th className="text-right p-4 text-sm font-semibold text-gray-600">الحالة</th>
                  <th className="text-right p-4 text-sm font-semibold text-gray-600">الإجراءات</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={7} className="text-center py-20">
                      <RefreshCw className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
                      <p className="text-gray-600">جاري التحميل...</p>
                    </td>
                  </tr>
                ) : products.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-20">
                      <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                      <p className="text-xl text-gray-500 font-bold">لا توجد منتجات</p>
                    </td>
                  </tr>
                ) : (
                  products.map((product) => {
                    const stockStatus = getStockStatus(product.stock);
                    const productImage = getProductImage(product.images);
                    
                    return (
                      <tr key={product.id} className="border-b hover:bg-gray-50 transition">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-lg overflow-hidden border-2 border-gray-200">
                              {productImage ? (
                                <img 
                                  src={productImage} 
                                  alt={product.nameAr}
                                  className="w-full h-full object-cover"
                                  onError={(e) => {
                                    e.currentTarget.style.display = 'none';
                                  }}
                                />
                              ) : (
                                <div className="w-full h-full bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center text-2xl">
                                  {categories.find(c => c.id === product.category)?.icon || '📦'}
                                </div>
                              )}
                            </div>
                            <div>
                              <p className="font-semibold text-gray-900">{product.nameAr}</p>
                              <p className="text-sm text-gray-500">{product.name}</p>
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-semibold">
                            {product.category}
                          </span>
                        </td>
                        <td className="p-4">
                          <div>
                            <p className="font-bold text-gray-900">{product.price.toLocaleString()} دج</p>
                            {product.salePrice && (
                              <p className="text-sm text-green-600 font-semibold">
                                {product.salePrice.toLocaleString()} دج
                              </p>
                            )}
                          </div>
                        </td>
                        <td className="p-4">
                          <span className={`px-3 py-1 rounded-full text-sm font-semibold ${stockStatus.color}`}>
                            {product.stock} {stockStatus.label}
                          </span>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                            <span className="font-semibold">{product.rating || 5}</span>
                            <span className="text-sm text-gray-500">({product.sales || 0})</span>
                          </div>
                        </td>
                        <td className="p-4">
                          <button
                            onClick={() => handleToggleStatus(product)}
                            className={`px-3 py-1 rounded-full text-sm font-semibold ${
                              product.enabled
                                ? 'bg-green-100 text-green-700'
                                : 'bg-gray-100 text-gray-700'
                            }`}
                          >
                            {product.enabled ? 'نشط' : 'معطل'}
                          </button>
                        </td>
                        <td className="p-4">
                          <div className="flex gap-2">
                            <button
                              onClick={() => openEditModal(product)}
                              className="p-2 hover:bg-blue-50 rounded-lg transition"
                              title="تعديل"
                            >
                              <Edit className="w-5 h-5 text-blue-600" />
                            </button>
                            <button
                              onClick={() => handleDelete(product.id, product.nameAr)}
                              className="p-2 hover:bg-red-50 rounded-lg transition"
                              title="حذف"
                            >
                              <Trash2 className="w-5 h-5 text-red-600" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl w-full max-w-4xl my-8">
            <div className="p-6 border-b flex items-center justify-between sticky top-0 bg-white z-10 rounded-t-2xl">
              <h2 className="text-2xl font-bold">
                {editingProduct ? 'تعديل منتج' : 'إضافة منتج جديد'}
              </h2>
              <button
                onClick={() => {
                  setShowModal(false);
                  resetForm();
                }}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
              {/* Images Upload */}
              <div>
                <label className="block font-bold mb-2 flex items-center gap-2">
                  <ImageIcon className="w-5 h-5" />
                  صور المنتج * (يمكن رفع عدة صور)
                </label>
                
                <div className="mb-4">
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <Upload className="w-10 h-10 mb-3 text-gray-400" />
                      <p className="mb-2 text-sm text-gray-500">
                        <span className="font-semibold">اضغط للرفع</span> أو اسحب الصور هنا
                      </p>
                      <p className="text-xs text-gray-500">PNG, JPG, WEBP (حتى 5MB لكل صورة)</p>
                    </div>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      disabled={uploading}
                    />
                  </label>
                </div>

                {uploading && (
                  <div className="flex items-center gap-2 text-blue-600 mb-4">
                    <RefreshCw className="w-5 h-5 animate-spin" />
                    <span>جاري رفع الصور...</span>
                  </div>
                )}

                {uploadedImages.length > 0 && (
                  <div className="grid grid-cols-4 gap-3">
                    {uploadedImages.map((img, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={img}
                          alt={`صورة ${index + 1}`}
                          className="w-full h-24 object-cover rounded-lg border-2 border-gray-200"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition"
                        >
                          <X className="w-4 h-4" />
                        </button>
                        {index === 0 && (
                          <div className="absolute bottom-1 left-1 bg-blue-600 text-white text-xs px-2 py-1 rounded">
                            الرئيسية
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {uploadedImages.length === 0 && !uploading && (
                  <p className="text-sm text-gray-500 text-center py-4 bg-gray-50 rounded-lg">
                    لم يتم رفع أي صور بعد
                  </p>
                )}
              </div>

              {/* Product Name */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold mb-2">الاسم بالإنجليزية</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="Baby Bottle"
                    className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block font-bold mb-2">الاسم بالعربية *</label>
                  <input
                    type="text"
                    required
                    value={formData.nameAr}
                    onChange={(e) => setFormData({...formData, nameAr: e.target.value})}
                    placeholder="زجاجة رضاعة"
                    className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block font-bold mb-2">الوصف *</label>
                <textarea
                  required
                  value={formData.descriptionAr}
                  onChange={(e) => setFormData({...formData, descriptionAr: e.target.value})}
                  placeholder="وصف تفصيلي للمنتج..."
                  rows={4}
                  className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Specifications */}
              <div>
                <label className="block font-bold mb-2">تفاصيل إضافية (اختياري)</label>
                <textarea
                  value={formData.specifications || ''}
                  onChange={(e) => setFormData({...formData, specifications: e.target.value})}
                  placeholder="مثال:
الوزن: 200 جرام
الأبعاد: 30×20 سم
الخامة: قطن 100%
المميزات: مقاوم للماء"
                  className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  rows={4}
                />
                <p className="text-xs text-gray-500 mt-1">
                  اكتب كل تفصيلة في سطر منفصل (اضغط Enter بعد كل معلومة)
                </p>
              </div>

              {/* Price & Sale Price */}
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="block font-bold mb-2">السعر الأصلي *</label>
                  <div className="relative">
                    <DollarSign className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="number"
                      required
                      value={formData.price}
                      onChange={(e) => setFormData({...formData, price: Number(e.target.value)})}
                      placeholder="1500"
                      className="w-full pr-12 px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block font-bold mb-2">سعر الخصم</label>
                  <input
                    type="number"
                    value={formData.salePrice}
                    onChange={(e) => setFormData({...formData, salePrice: Number(e.target.value)})}
                    placeholder="1200"
                    className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block font-bold mb-2">المخزون *</label>
                  <input
                    type="number"
                    required
                    value={formData.stock}
                    onChange={(e) => setFormData({...formData, stock: Number(e.target.value)})}
                    placeholder="50"
                    className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Category & Age Group */}
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="block font-bold mb-2">الفئة *</label>
                  <select
                    required
                    value={formData.category}
                    onChange={(e) => {
                      setFormData({
                        ...formData, 
                        category: e.target.value,
                        attributes: {},
                        categoryId: categories.findIndex(c => c.id === e.target.value).toString()
                      });
                    }}
                    className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">اختر الفئة</option>
                    {categories.filter(c => c.id !== 'all').map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-bold mb-2">الفئة العمرية</label>
                  <select
                    value={formData.ageGroup}
                    onChange={(e) => setFormData({...formData, ageGroup: e.target.value})}
                    className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    {ageGroups.map(age => (
                      <option key={age.value} value={age.value}>{age.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-bold mb-2">الجنس</label>
                  <select
                    value={formData.gender}
                    onChange={(e) => setFormData({...formData, gender: e.target.value})}
                    className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="unisex">للجميع</option>
                    <option value="boys">للأولاد</option>
                    <option value="girls">للبنات</option>
                  </select>
                </div>
              </div>

              {/* ✅ DYNAMIC ATTRIBUTES - حسب الفئة */}
              {formData.category && getCategoryAttributes().length > 0 && (
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <h3 className="text-lg font-bold mb-4 text-blue-900">
                    مواصفات {formData.category}
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    {getCategoryAttributes().map((attr) => (
                      <div key={attr.name}>
                        <label className="block font-bold mb-2 text-blue-900">
                          {attr.label}
                        </label>
                        {attr.type === 'select' ? (
                          <select
                            value={formData.attributes[attr.name] || ''}
                            onChange={(e) => handleAttributeChange(attr.name, e.target.value)}
                            className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                          >
                            <option value="">اختر {attr.label}</option>
                            {attr.options?.map(opt => (
                              <option key={opt} value={opt}>{opt}</option>
                            ))}
                          </select>
                        ) : (
                          <input
                            type="text"
                            value={formData.attributes[attr.name] || ''}
                            onChange={(e) => handleAttributeChange(attr.name, e.target.value)}
                            placeholder={`أدخل ${attr.label}`}
                            className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                          />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Badge */}
              <div>
                <label className="block font-bold mb-2">الشارة (اختياري)</label>
                <select
                  value={formData.badge}
                  onChange={(e) => setFormData({...formData, badge: e.target.value})}
                  className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">بدون شارة</option>
                  <option value="جديد">جديد</option>
                  <option value="أكثر مبيعاً">أكثر مبيعاً</option>
                  <option value="عرض">عرض ساخن</option>
                  <option value="محدود">محدود</option>
                </select>
              </div>

              {/* Featured & Enabled */}
              <div className="flex gap-4">
                <label className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg flex-1 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.featured}
                    onChange={(e) => setFormData({...formData, featured: e.target.checked})}
                    className="w-5 h-5"
                  />
                  <div>
                    <p className="font-semibold">منتج مميز</p>
                    <p className="text-sm text-gray-600">سيظهر في الصفحة الرئيسية</p>
                  </div>
                </label>

                <label className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg flex-1 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.enabled}
                    onChange={(e) => setFormData({...formData, enabled: e.target.checked})}
                    className="w-5 h-5"
                  />
                  <div>
                    <p className="font-semibold">نشط</p>
                    <p className="text-sm text-gray-600">المنتج مفعّل وظاهر</p>
                  </div>
                </label>
              </div>
            </form>

            {/* Buttons */}
            <div className="p-6 border-t bg-gray-50 flex gap-3 sticky bottom-0 rounded-b-2xl">
              <button
                onClick={handleSubmit}
                disabled={loading || uploading || uploadedImages.length === 0}
                className="flex-1 bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <Save className="w-5 h-5" />
                {loading ? 'جاري الحفظ...' : editingProduct ? 'تحديث المنتج' : 'إضافة المنتج'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowModal(false);
                  resetForm();
                }}
                className="px-6 py-3 bg-gray-200 text-gray-700 rounded-xl font-bold hover:bg-gray-300"
              >
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;600;700;900&display=swap');
        
        .font-arabic {
          font-family: 'Cairo', sans-serif !important;
        }
      `}</style>
    </div>
  );
}
