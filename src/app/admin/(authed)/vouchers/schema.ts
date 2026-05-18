import { z } from "zod";
import { LOCALES, type Locale } from "@/i18n/locales";

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;
const HHMM = /^\d{2}:\d{2}$/;

export const VOUCHER_TYPES = ["group", "daily", "custom", "hotel", "transfer"] as const;
export type VoucherType = (typeof VOUCHER_TYPES)[number];

export const guestSchema = z.object({
  role: z.string().min(1, "Role is required"),
  name: z.string().min(1, "Name is required"),
  dateOfBirth: z.string().regex(ISO_DATE, "Pick a date of birth"),
  passport: z.string().min(1, "Passport is required"),
});

const dateOrEmpty = z.string().regex(ISO_DATE).or(z.literal(""));
const timeOrEmpty = z.string().regex(HHMM).or(z.literal(""));

export const voucherSchema = z
  .object({
    voucherType: z.enum(VOUCHER_TYPES),

    voucherNumber: z.string().min(1, "Voucher number is required"),
    invoiceDate: z.string().regex(ISO_DATE, "Pick an invoice date"),
    paymentMethod: z.string().min(1, "Payment / account is required"),

    packageId: z.string().optional(),
    packageName: z.string().min(1, "Item name is required"),
    region: z.string().min(1, "Region is required"),
    nightsDays: z.string(),

    guests: z.array(guestSchema).min(1, "At least one guest is required"),

    // multi-night (group/custom/hotel)
    checkIn: dateOrEmpty,
    checkInTime: timeOrEmpty,
    checkOut: dateOrEmpty,
    checkOutTime: timeOrEmpty,
    durationLabel: z.string(),

    // single-day (daily)
    tourDate: dateOrEmpty,
    tourStartTime: timeOrEmpty,
    tourEndTime: timeOrEmpty,

    // point-to-point (transfer)
    pickupLocation: z.string(),
    pickupDate: dateOrEmpty,
    pickupTime: timeOrEmpty,
    dropoffLocation: z.string(),
    dropoffDate: dateOrEmpty,
    dropoffTime: timeOrEmpty,

    currency: z.enum(["EUR", "USD", "GBP", "TRY"]),
    qty: z.number().int().min(1),
    unitPrice: z.number().min(0),
    itemDescriptor: z.string(),

    paymentNote: z.string().min(1, "Payment note is required"),
    footerThanks: z.string().min(1, "Footer thanks is required"),

    locale: z.enum(LOCALES),
  })
  .superRefine((v, ctx) => {
    if (v.voucherType === "group" || v.voucherType === "custom" || v.voucherType === "hotel") {
      if (!ISO_DATE.test(v.checkIn)) ctx.addIssue({ code: "custom", path: ["checkIn"], message: "Pick a check-in date" });
      if (!ISO_DATE.test(v.checkOut)) ctx.addIssue({ code: "custom", path: ["checkOut"], message: "Pick a check-out date" });
      if (!v.durationLabel.trim()) ctx.addIssue({ code: "custom", path: ["durationLabel"], message: "Duration label is required" });
    }
    if (v.voucherType === "daily") {
      if (!ISO_DATE.test(v.tourDate)) ctx.addIssue({ code: "custom", path: ["tourDate"], message: "Pick a tour date" });
    }
    if (v.voucherType === "transfer") {
      if (!v.pickupLocation.trim()) ctx.addIssue({ code: "custom", path: ["pickupLocation"], message: "Pickup location is required" });
      if (!v.dropoffLocation.trim()) ctx.addIssue({ code: "custom", path: ["dropoffLocation"], message: "Dropoff location is required" });
      if (!ISO_DATE.test(v.pickupDate)) ctx.addIssue({ code: "custom", path: ["pickupDate"], message: "Pick a pickup date" });
    }
  });

export type VoucherPayload = z.infer<typeof voucherSchema>;
export type VoucherGuest = z.infer<typeof guestSchema>;

export const TRANSLATABLE_KEYS = [
  "packageName",
  "region",
  "nightsDays",
  "paymentMethod",
  "durationLabel",
  "itemDescriptor",
  "paymentNote",
  "footerThanks",
  "pickupLocation",
  "dropoffLocation",
] as const;
export type TranslatableKey = (typeof TRANSLATABLE_KEYS)[number];

export interface VoucherLabels {
  docLabel: string;
  docTitle: string;
  tag: string;
  voucherNo: string;
  invoiceDate: string;
  accountPayment: string;
  packageEyebrow: string;
  // per-tab hero eyebrows
  eyebrowGroup: string;
  eyebrowDaily: string;
  eyebrowCustom: string;
  eyebrowHotel: string;
  eyebrowTransfer: string;
  // section names: per-tab Stay header
  sectionGuests: string;
  sectionStay: string;
  sectionStayDaily: string;
  sectionStayTransfer: string;
  sectionPrice: string;
  leadGuest: string;
  companion: string;
  dateOfBirth: string;
  passport: string;
  checkIn: string;
  checkOut: string;
  duration: string;
  // per-variant cells
  tourDate: string;
  tourTime: string;
  pickup: string;
  dropoff: string;
  fromTime: string;
  byTime: string;
  item: string;
  qty: string;
  unitPrice: string;
  total: string;
  grandTotal: string;
  reachUs: string;
  withOurThanks: string;
  director: string;
  cornerMark: string;
}

export const VOUCHER_LABELS: Record<Locale, VoucherLabels> = {
  en: {
    docLabel: "Official travel document",
    docTitle: "VOUCHER",
    tag: "Boutique tours · Private chauffeur",
    voucherNo: "Voucher No.",
    invoiceDate: "Invoice Date",
    accountPayment: "Account · Payment",
    packageEyebrow: "The Package · Türkiye",
    eyebrowGroup: "The Package · Türkiye",
    eyebrowDaily: "Daily Tour · Türkiye",
    eyebrowCustom: "Custom Tour · Türkiye",
    eyebrowHotel: "Hotel Stay · Türkiye",
    eyebrowTransfer: "Private Transfer · Türkiye",
    sectionGuests: "Voucher to · Guests",
    sectionStay: "Stay · Check-in & Check-out",
    sectionStayDaily: "Tour Date · Schedule",
    sectionStayTransfer: "Pickup & Dropoff",
    sectionPrice: "Package · Price Breakdown",
    leadGuest: "Lead Guest",
    companion: "Companion",
    dateOfBirth: "Date of Birth",
    passport: "Passport",
    checkIn: "Check in",
    fromTime: "from",
    checkOut: "Check out",
    byTime: "by",
    duration: "Duration",
    tourDate: "Tour Date",
    tourTime: "Schedule",
    pickup: "Pickup",
    dropoff: "Dropoff",
    item: "Item",
    qty: "Qty",
    unitPrice: "Unit Price",
    total: "Total",
    grandTotal: "Grand Total",
    reachUs: "Reach us",
    withOurThanks: "With our thanks",
    director: "For Sabrina Turizm · Director",
    cornerMark: "Sabrina Turizm · Istanbul",
  },
  tr: {
    docLabel: "Resmi seyahat belgesi",
    docTitle: "VOUCHER",
    tag: "Butik turlar · Özel şoför",
    voucherNo: "Vauçer No.",
    invoiceDate: "Fatura Tarihi",
    accountPayment: "Hesap · Ödeme",
    packageEyebrow: "Paket · Türkiye",
    eyebrowGroup: "Paket · Türkiye",
    eyebrowDaily: "Günlük Tur · Türkiye",
    eyebrowCustom: "Özel Tur · Türkiye",
    eyebrowHotel: "Otel Konaklaması · Türkiye",
    eyebrowTransfer: "Özel Transfer · Türkiye",
    sectionGuests: "Vauçer · Misafirler",
    sectionStay: "Konaklama · Giriş & Çıkış",
    sectionStayDaily: "Tur Tarihi · Program",
    sectionStayTransfer: "Alış & Bırakış",
    sectionPrice: "Paket · Fiyat Detayı",
    leadGuest: "Ana Misafir",
    companion: "Refakatçi",
    dateOfBirth: "Doğum Tarihi",
    passport: "Pasaport",
    checkIn: "Giriş",
    fromTime: "saat",
    checkOut: "Çıkış",
    byTime: "saat",
    duration: "Süre",
    tourDate: "Tur Tarihi",
    tourTime: "Program",
    pickup: "Alış",
    dropoff: "Bırakış",
    item: "Kalem",
    qty: "Adet",
    unitPrice: "Birim Fiyat",
    total: "Toplam",
    grandTotal: "Genel Toplam",
    reachUs: "Bize ulaşın",
    withOurThanks: "Teşekkürlerimizle",
    director: "Sabrina Turizm Adına · Direktör",
    cornerMark: "Sabrina Turizm · İstanbul",
  },
  ar: {
    docLabel: "وثيقة سفر رسمية",
    docTitle: "قسيمة",
    tag: "جولات بوتيكية · سائق خاص",
    voucherNo: "رقم القسيمة",
    invoiceDate: "تاريخ الفاتورة",
    accountPayment: "الحساب · الدفع",
    packageEyebrow: "الباقة · تركيا",
    eyebrowGroup: "الباقة · تركيا",
    eyebrowDaily: "جولة يومية · تركيا",
    eyebrowCustom: "جولة مخصصة · تركيا",
    eyebrowHotel: "إقامة فندقية · تركيا",
    eyebrowTransfer: "نقل خاص · تركيا",
    sectionGuests: "القسيمة · الضيوف",
    sectionStay: "الإقامة · الوصول والمغادرة",
    sectionStayDaily: "تاريخ الجولة · البرنامج",
    sectionStayTransfer: "الالتقاط والإنزال",
    sectionPrice: "الباقة · تفاصيل السعر",
    leadGuest: "الضيف الرئيسي",
    companion: "المرافق",
    dateOfBirth: "تاريخ الميلاد",
    passport: "جواز السفر",
    checkIn: "تسجيل الوصول",
    fromTime: "من",
    checkOut: "تسجيل المغادرة",
    byTime: "قبل",
    duration: "المدة",
    tourDate: "تاريخ الجولة",
    tourTime: "البرنامج",
    pickup: "نقطة الالتقاط",
    dropoff: "نقطة الإنزال",
    item: "البند",
    qty: "الكمية",
    unitPrice: "سعر الوحدة",
    total: "الإجمالي",
    grandTotal: "الإجمالي الكلي",
    reachUs: "تواصل معنا",
    withOurThanks: "مع جزيل الشكر",
    director: "نيابة عن سابرينا توريزم · المديرة",
    cornerMark: "سابرينا توريزم · إسطنبول",
  },
  es: {
    docLabel: "Documento oficial de viaje",
    docTitle: "VOUCHER",
    tag: "Tours boutique · Chófer privado",
    voucherNo: "Voucher N.º",
    invoiceDate: "Fecha de Factura",
    accountPayment: "Cuenta · Pago",
    packageEyebrow: "El Paquete · Türkiye",
    eyebrowGroup: "El Paquete · Türkiye",
    eyebrowDaily: "Tour Diario · Türkiye",
    eyebrowCustom: "Tour Personalizado · Türkiye",
    eyebrowHotel: "Estancia en Hotel · Türkiye",
    eyebrowTransfer: "Traslado Privado · Türkiye",
    sectionGuests: "Voucher a · Huéspedes",
    sectionStay: "Estancia · Check-in y Check-out",
    sectionStayDaily: "Fecha del Tour · Horario",
    sectionStayTransfer: "Recogida y Destino",
    sectionPrice: "Paquete · Desglose de Precio",
    leadGuest: "Huésped Principal",
    companion: "Acompañante",
    dateOfBirth: "Fecha de Nacimiento",
    passport: "Pasaporte",
    checkIn: "Check-in",
    fromTime: "desde",
    checkOut: "Check-out",
    byTime: "antes de",
    duration: "Duración",
    tourDate: "Fecha del Tour",
    tourTime: "Horario",
    pickup: "Recogida",
    dropoff: "Destino",
    item: "Artículo",
    qty: "Cant.",
    unitPrice: "Precio Unitario",
    total: "Total",
    grandTotal: "Total General",
    reachUs: "Contáctenos",
    withOurThanks: "Con nuestro agradecimiento",
    director: "Por Sabrina Turizm · Directora",
    cornerMark: "Sabrina Turizm · Estambul",
  },
  it: {
    docLabel: "Documento di viaggio ufficiale",
    docTitle: "VOUCHER",
    tag: "Tour boutique · Autista privato",
    voucherNo: "Voucher N.",
    invoiceDate: "Data Fattura",
    accountPayment: "Conto · Pagamento",
    packageEyebrow: "Il Pacchetto · Türkiye",
    eyebrowGroup: "Il Pacchetto · Türkiye",
    eyebrowDaily: "Tour Giornaliero · Türkiye",
    eyebrowCustom: "Tour Personalizzato · Türkiye",
    eyebrowHotel: "Soggiorno in Hotel · Türkiye",
    eyebrowTransfer: "Trasferimento Privato · Türkiye",
    sectionGuests: "Voucher a · Ospiti",
    sectionStay: "Soggiorno · Check-in & Check-out",
    sectionStayDaily: "Data Tour · Programma",
    sectionStayTransfer: "Ritiro e Consegna",
    sectionPrice: "Pacchetto · Dettaglio Prezzo",
    leadGuest: "Ospite Principale",
    companion: "Accompagnatore",
    dateOfBirth: "Data di Nascita",
    passport: "Passaporto",
    checkIn: "Check-in",
    fromTime: "dalle",
    checkOut: "Check-out",
    byTime: "entro le",
    duration: "Durata",
    tourDate: "Data Tour",
    tourTime: "Programma",
    pickup: "Ritiro",
    dropoff: "Consegna",
    item: "Voce",
    qty: "Qtà",
    unitPrice: "Prezzo Unitario",
    total: "Totale",
    grandTotal: "Totale Generale",
    reachUs: "Contattaci",
    withOurThanks: "Con i nostri ringraziamenti",
    director: "Per Sabrina Turizm · Direttrice",
    cornerMark: "Sabrina Turizm · Istanbul",
  },
  fr: {
    docLabel: "Document de voyage officiel",
    docTitle: "VOUCHER",
    tag: "Tours boutique · Chauffeur privé",
    voucherNo: "Voucher N°",
    invoiceDate: "Date de Facture",
    accountPayment: "Compte · Paiement",
    packageEyebrow: "Le Forfait · Türkiye",
    eyebrowGroup: "Le Forfait · Türkiye",
    eyebrowDaily: "Tour Quotidien · Türkiye",
    eyebrowCustom: "Tour sur Mesure · Türkiye",
    eyebrowHotel: "Séjour à l'Hôtel · Türkiye",
    eyebrowTransfer: "Transfert Privé · Türkiye",
    sectionGuests: "Voucher à · Invités",
    sectionStay: "Séjour · Check-in & Check-out",
    sectionStayDaily: "Date du Tour · Horaire",
    sectionStayTransfer: "Prise en Charge & Dépose",
    sectionPrice: "Forfait · Détail du Prix",
    leadGuest: "Invité Principal",
    companion: "Accompagnant",
    dateOfBirth: "Date de Naissance",
    passport: "Passeport",
    checkIn: "Arrivée",
    fromTime: "à partir de",
    checkOut: "Départ",
    byTime: "avant",
    duration: "Durée",
    tourDate: "Date du Tour",
    tourTime: "Horaire",
    pickup: "Prise en Charge",
    dropoff: "Dépose",
    item: "Article",
    qty: "Qté",
    unitPrice: "Prix Unitaire",
    total: "Total",
    grandTotal: "Total Général",
    reachUs: "Nous joindre",
    withOurThanks: "Avec nos remerciements",
    director: "Pour Sabrina Turizm · Directrice",
    cornerMark: "Sabrina Turizm · Istanbul",
  },
  de: {
    docLabel: "Offizielles Reisedokument",
    docTitle: "VOUCHER",
    tag: "Boutique-Touren · Privater Chauffeur",
    voucherNo: "Voucher-Nr.",
    invoiceDate: "Rechnungsdatum",
    accountPayment: "Konto · Zahlung",
    packageEyebrow: "Das Paket · Türkiye",
    eyebrowGroup: "Das Paket · Türkiye",
    eyebrowDaily: "Tagestour · Türkiye",
    eyebrowCustom: "Maßgeschneiderte Tour · Türkiye",
    eyebrowHotel: "Hotelaufenthalt · Türkiye",
    eyebrowTransfer: "Privater Transfer · Türkiye",
    sectionGuests: "Voucher an · Gäste",
    sectionStay: "Aufenthalt · Check-in & Check-out",
    sectionStayDaily: "Tour-Datum · Programm",
    sectionStayTransfer: "Abholung & Absetzen",
    sectionPrice: "Paket · Preisaufstellung",
    leadGuest: "Hauptgast",
    companion: "Begleitperson",
    dateOfBirth: "Geburtsdatum",
    passport: "Reisepass",
    checkIn: "Check-in",
    fromTime: "ab",
    checkOut: "Check-out",
    byTime: "bis",
    duration: "Dauer",
    tourDate: "Tour-Datum",
    tourTime: "Programm",
    pickup: "Abholung",
    dropoff: "Absetzen",
    item: "Position",
    qty: "Anz.",
    unitPrice: "Einzelpreis",
    total: "Gesamt",
    grandTotal: "Gesamtsumme",
    reachUs: "Kontakt",
    withOurThanks: "Mit unserem Dank",
    director: "Für Sabrina Turizm · Direktorin",
    cornerMark: "Sabrina Turizm · Istanbul",
  },
  ru: {
    docLabel: "Официальный туристический документ",
    docTitle: "ВАУЧЕР",
    tag: "Бутик-туры · Личный водитель",
    voucherNo: "Ваучер №",
    invoiceDate: "Дата счёта",
    accountPayment: "Счёт · Оплата",
    packageEyebrow: "Пакет · Türkiye",
    eyebrowGroup: "Пакет · Türkiye",
    eyebrowDaily: "Дневной Тур · Türkiye",
    eyebrowCustom: "Индивидуальный Тур · Türkiye",
    eyebrowHotel: "Размещение в Отеле · Türkiye",
    eyebrowTransfer: "Частный Трансфер · Türkiye",
    sectionGuests: "Ваучер · Гости",
    sectionStay: "Проживание · Заезд и выезд",
    sectionStayDaily: "Дата Тура · Расписание",
    sectionStayTransfer: "Подача и Возврат",
    sectionPrice: "Пакет · Детализация цены",
    leadGuest: "Главный гость",
    companion: "Сопровождающий",
    dateOfBirth: "Дата рождения",
    passport: "Паспорт",
    checkIn: "Заезд",
    fromTime: "с",
    checkOut: "Выезд",
    byTime: "до",
    duration: "Продолжительность",
    tourDate: "Дата Тура",
    tourTime: "Расписание",
    pickup: "Подача",
    dropoff: "Возврат",
    item: "Позиция",
    qty: "Кол-во",
    unitPrice: "Цена за ед.",
    total: "Итого",
    grandTotal: "Общая сумма",
    reachUs: "Связаться с нами",
    withOurThanks: "С благодарностью",
    director: "От имени Sabrina Turizm · Директор",
    cornerMark: "Sabrina Turizm · Стамбул",
  },
  zh: {
    docLabel: "正式旅行凭证",
    docTitle: "凭证",
    tag: "精品旅游 · 专属司机",
    voucherNo: "凭证编号",
    invoiceDate: "开票日期",
    accountPayment: "账户 · 付款",
    packageEyebrow: "套餐 · Türkiye",
    eyebrowGroup: "套餐 · Türkiye",
    eyebrowDaily: "单日游 · Türkiye",
    eyebrowCustom: "定制游 · Türkiye",
    eyebrowHotel: "酒店住宿 · Türkiye",
    eyebrowTransfer: "私人接送 · Türkiye",
    sectionGuests: "凭证 · 宾客",
    sectionStay: "住宿 · 入住与退房",
    sectionStayDaily: "行程日期 · 时间",
    sectionStayTransfer: "接送地点",
    sectionPrice: "套餐 · 价格明细",
    leadGuest: "主宾",
    companion: "同行者",
    dateOfBirth: "出生日期",
    passport: "护照",
    checkIn: "入住",
    fromTime: "自",
    checkOut: "退房",
    byTime: "至",
    duration: "时长",
    tourDate: "行程日期",
    tourTime: "时间",
    pickup: "接车地点",
    dropoff: "送达地点",
    item: "项目",
    qty: "数量",
    unitPrice: "单价",
    total: "合计",
    grandTotal: "总计",
    reachUs: "联系我们",
    withOurThanks: "致以谢意",
    director: "Sabrina Turizm 代表 · 总监",
    cornerMark: "Sabrina Turizm · 伊斯坦布尔",
  },
  ja: {
    docLabel: "公式旅行書類",
    docTitle: "バウチャー",
    tag: "ブティックツアー · 専属ドライバー",
    voucherNo: "バウチャー番号",
    invoiceDate: "請求日",
    accountPayment: "口座 · お支払い",
    packageEyebrow: "パッケージ · Türkiye",
    eyebrowGroup: "パッケージ · Türkiye",
    eyebrowDaily: "日帰りツアー · Türkiye",
    eyebrowCustom: "カスタムツアー · Türkiye",
    eyebrowHotel: "ホテル滞在 · Türkiye",
    eyebrowTransfer: "プライベート送迎 · Türkiye",
    sectionGuests: "バウチャー · ご宿泊者",
    sectionStay: "ご滞在 · チェックイン & チェックアウト",
    sectionStayDaily: "ツアー日 · スケジュール",
    sectionStayTransfer: "ピックアップ & ドロップオフ",
    sectionPrice: "パッケージ · 料金内訳",
    leadGuest: "代表者",
    companion: "同行者",
    dateOfBirth: "生年月日",
    passport: "パスポート",
    checkIn: "チェックイン",
    fromTime: "から",
    checkOut: "チェックアウト",
    byTime: "まで",
    duration: "期間",
    tourDate: "ツアー日",
    tourTime: "スケジュール",
    pickup: "お迎え",
    dropoff: "お送り",
    item: "項目",
    qty: "数量",
    unitPrice: "単価",
    total: "合計",
    grandTotal: "総合計",
    reachUs: "お問い合わせ",
    withOurThanks: "感謝を込めて",
    director: "Sabrina Turizm 代表 · ディレクター",
    cornerMark: "Sabrina Turizm · イスタンブール",
  },
};

export const DEFAULT_PAYMENT_NOTE_EN = "Total payment to be settled in Istanbul upon arrival.";
export const DEFAULT_FOOTER_THANKS_EN = "A warm welcome to Türkiye — we are honoured to host you.";

export const CURRENCY_SYMBOL: Record<VoucherPayload["currency"], string> = {
  EUR: "€",
  USD: "$",
  GBP: "£",
  TRY: "₺",
};
