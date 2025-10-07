// تنسيق السعر بالدينار الجزائري
export function formatPrice(price: number): string {
  return new Intl.NumberFormat('ar-DZ', {
    style: 'currency',
    currency: 'DZD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(price);
}

// توليد رقم طلب عشوائي
export function generateOrderNumber(): string {
  const timestamp = Date.now().toString(36);
  const randomStr = Math.random().toString(36).substring(2, 7);
  return `QSR-${timestamp}-${randomStr}`.toUpperCase();
}

// قائمة الولايات الجزائرية (58 ولاية)
export const ALGERIAN_WILAYAS = [
  '01 - أدرار',
  '02 - الشلف',
  '03 - الأغواط',
  '04 - أم البواقي',
  '05 - باتنة',
  '06 - بجاية',
  '07 - بسكرة',
  '08 - بشار',
  '09 - البليدة',
  '10 - البويرة',
  '11 - تمنراست',
  '12 - تبسة',
  '13 - تلمسان',
  '14 - تيارت',
  '15 - تيزي وزو',
  '16 - الجزائر',
  '17 - الجلفة',
  '18 - جيجل',
  '19 - سطيف',
  '20 - سعيدة',
  '21 - سكيكدة',
  '22 - سيدي بلعباس',
  '23 - عنابة',
  '24 - قالمة',
  '25 - قسنطينة',
  '26 - المدية',
  '27 - مستغانم',
  '28 - المسيلة',
  '29 - معسكر',
  '30 - ورقلة',
  '31 - وهران',
  '32 - البيض',
  '33 - إليزي',
  '34 - برج بوعريريج',
  '35 - بومرداس',
  '36 - الطارف',
  '37 - تندوف',
  '38 - تيسمسيلت',
  '39 - الوادي',
  '40 - خنشلة',
  '41 - سوق أهراس',
  '42 - تيبازة',
  '43 - ميلة',
  '44 - عين الدفلى',
  '45 - النعامة',
  '46 - عين تموشنت',
  '47 - غرداية',
  '48 - غليزان',
  '49 - تيميمون',
  '50 - برج باجي مختار',
  '51 - أولاد جلال',
  '52 - بني عباس',
  '53 - عين صالح',
  '54 - عين قزام',
  '55 - تقرت',
  '56 - جانت',
  '57 - المغير',
  '58 - المنيعة',
];

// حفظ في Local Storage
export function saveToLocalStorage<T>(key: string, value: T): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(key, JSON.stringify(value));
  }
}

// قراءة من Local Storage
export function getFromLocalStorage<T>(key: string): T | null {
  if (typeof window !== 'undefined') {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  }
  return null;
}

// حذف من Local Storage
export function removeFromLocalStorage(key: string): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(key);
  }
}
