import type { AppTranslation } from "../types/app-translation";

export const AR: AppTranslation = {
  dashboard: "لوحة التحكم",
  settings: "الإعدادات",
  pressure: "الضغط",
  altitude: "الارتفاع",
  temperature: "درجة الحرارة",
  connect: "اتصال",
  disconnect: "قطع الاتصال",

  save: "حفظ",
  apiKey: "مفتاح API",
  apiKeyDescription:
    "يُستخدم مفتاح API للحصول على QNH من OpenWeatherMap لحساب الارتفاع بشكل صحيح",
  qnhDescription:
    "QNH هو الضغط الجوي المصحح إلى مستوى سطح البحر المتوسط، ويُستخدم في الطيران لضبط مقياس الارتفاع ليشير إلى الارتفاع فوق سطح البحر.",
  or: "أو",
  fetchFromApi: "جلب من API",
  fetchFromApiDescription:
    "لتسهيل الأمور، يمكن أيضًا الحصول على QNH من OpenWeatherMap باستخدام الموقع الحالي",
  altitudeUnit: "وحدة الارتفاع",
  temperatureUnit: "وحدة درجة الحرارة",
  language: "اللغة",

  apiKeySaved: "تم حفظ مفتاح API",
  qnhSet: "تم تعيين QNH",
  errorQnh: "حدث خطأ أثناء الحصول على QNH",
  usbDisconnected: "تم فصل USB",
  connectionError: "خطأ في الاتصال",
  permissionRequired: "مطلوب إذن",
  unknownError: "خطأ غير معروف",

  mustConnectArduinoQnh: "يجب أن تكون متصلاً بـ Arduino لتعيين QNH",
  mustConnectInternetQnh: "يجب أن تكون متصلاً بالإنترنت لجلب QNH",
  mustHaveLocationQnh: "يجب السماح بالوصول إلى الموقع",
  mustHaveApiKeyQnh: "يجب أن يكون لديك مفتاح API لـ OpenWeatherMap",
};
