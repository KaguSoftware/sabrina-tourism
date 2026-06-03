import { z } from "zod";
import { LOCALES, type Locale } from "@/i18n/locales";

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;
const HHMM = /^\d{2}:\d{2}$/;

export const VOUCHER_TYPES = ["group", "daily", "custom", "hotel", "transfer"] as const;
export type VoucherType = (typeof VOUCHER_TYPES)[number];

export const guestSchema = z.object({
  role: z.string().min(1, "Role is required"),
  name: z.string().min(1, "Name is required"),
  dateOfBirth: z
    .string()
    .regex(ISO_DATE, "Pick a date of birth")
    .refine((v) => {
      const dob = new Date(v + "T00:00:00");
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return dob <= today;
    }, "Date of birth cannot be in the future"),
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
    hotelName: z.string(),
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
    childrenQty: z.number().int().min(0),
    childrenUnitPrice: z.number().min(0),
    singleRoomQty: z.number().int().min(0),
    singleRoomUnitPrice: z.number().min(0),

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
    if (v.qty > 0 && v.unitPrice <= 0) {
      ctx.addIssue({ code: "custom", path: ["unitPrice"], message: "Unit price must be greater than 0" });
    }
  });

export type VoucherPayload = z.infer<typeof voucherSchema>;
export type VoucherGuest = z.infer<typeof guestSchema>;

export const TRANSLATABLE_KEYS = [
  "packageName",
  "region",
  "hotelName",
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
  hotel: string;
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
  subtotal: string;
  grandTotal: string;
  children: string;
  singleRoom: string;
  reachUs: string;
  withOurThanks: string;
  director: string;
  cornerMark: string;
}

export const VOUCHER_LABELS: Record<Locale, VoucherLabels> = {
  en: {
    docLabel: "Official travel document",
    docTitle: "VOUCHER",
    tag: "Tours, Transfers, Hotel",
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
    hotel: "Hotel",
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
    subtotal: "Subtotal",
    grandTotal: "Grand Total",
    children: "Children",
    singleRoom: "Single Room Occupancy",
    reachUs: "Reach us",
    withOurThanks: "With our thanks",
    director: "For Sabrina Turizm · Director",
    cornerMark: "Sabrina Turizm · Istanbul",
  },
  tr: {
    docLabel: "Resmi Seyahat Belgesi",
    docTitle: "VOUCHER",
    tag: "Tours, Transfers, Hotel",
    voucherNo: "Voucher No.",
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
    sectionStayTransfer: "Karşılama & Bırakma",
    sectionPrice: "Paket · Fiyat Detayı",
    leadGuest: "Ana Misafir",
    companion: "Refakatçi",
    dateOfBirth: "Doğum Tarihi",
    passport: "Pasaport",
    hotel: "Otel",
    checkIn: "Giriş",
    fromTime: "itibaren",
    checkOut: "Çıkış",
    byTime: "en geç",
    duration: "Süre",
    tourDate: "Tur Tarihi",
    tourTime: "Program",
    pickup: "Karşılama",
    dropoff: "Bırakma",
    item: "Kalem",
    qty: "Adet",
    unitPrice: "Birim Fiyat",
    total: "Toplam",
    subtotal: "Ara Toplam",
    grandTotal: "Genel Toplam",
    children: "Çocuklar",
    singleRoom: "Tek Kişilik Oda Farkı",
    reachUs: "Bize Ulaşın",
    withOurThanks: "Teşekkürlerimizle",
    director: "Sabrina Turizm Adına · Direktör",
    cornerMark: "Sabrina Turizm · İstanbul",
  },
  ar: {
    docLabel: "وثيقة سفر رسمية",
    docTitle: "قسيمة",
    tag: "Tours, Transfers, Hotel",
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
    sectionStay: "الإقامة · المواعيد",
    sectionStayDaily: "تاريخ الجولة · البرنامج",
    sectionStayTransfer: "الاستلام · التسليم",
    sectionPrice: "الباقة · تفاصيل السعر",
    leadGuest: "الضيف الرئيسي",
    companion: "المرافق",
    dateOfBirth: "تاريخ الميلاد",
    passport: "جواز السفر",
    hotel: "الفندق",
    checkIn: "تسجيل الوصول",
    fromTime: "من",
    checkOut: "تسجيل المغادرة",
    byTime: "حتى",
    duration: "المدة",
    tourDate: "تاريخ الجولة",
    tourTime: "البرنامج",
    pickup: "الاستلام",
    dropoff: "التسليم",
    item: "البند",
    qty: "الكمية",
    unitPrice: "سعر الوحدة",
    total: "الإجمالي",
    subtotal: "المجموع الفرعي",
    grandTotal: "الإجمالي الكلي",
    children: "الأطفال",
    singleRoom: "إشغال غرفة فردية",
    reachUs: "تواصل معنا",
    withOurThanks: "شكراً جزيلاً",
    director: "نيابة عن Sabrina Turizm · المديرة",
    cornerMark: "Sabrina Turizm · إسطنبول",
  },
  es: {
    docLabel: "Documento de viaje oficial",
    docTitle: "VOUCHER",
    tag: "Tours, Transfers, Hotel",
    voucherNo: "Núm. de voucher",
    invoiceDate: "Fecha de factura",
    accountPayment: "Cuenta · Pago",
    packageEyebrow: "El Paquete · Türkiye",
    eyebrowGroup: "El Paquete · Türkiye",
    eyebrowDaily: "Tour diario · Türkiye",
    eyebrowCustom: "Tour personalizado · Türkiye",
    eyebrowHotel: "Estancia hotelera · Türkiye",
    eyebrowTransfer: "Traslado privado · Türkiye",
    sectionGuests: "Voucher para · Huéspedes",
    sectionStay: "Estancia · Entrada y salida",
    sectionStayDaily: "Fecha del tour · Horario",
    sectionStayTransfer: "Recogida y entrega",
    sectionPrice: "Paquete · Desglose de precio",
    leadGuest: "Huésped principal",
    companion: "Acompañante",
    dateOfBirth: "Fecha de nacimiento",
    passport: "Pasaporte",
    hotel: "Hotel",
    checkIn: "Entrada",
    fromTime: "desde",
    checkOut: "Salida",
    byTime: "hasta",
    duration: "Duración",
    tourDate: "Fecha del tour",
    tourTime: "Horario",
    pickup: "Recogida",
    dropoff: "Entrega",
    item: "Artículo",
    qty: "Cant.",
    unitPrice: "Precio unitario",
    total: "Total",
    subtotal: "Subtotal",
    grandTotal: "Total general",
    children: "Niños",
    singleRoom: "Habitación individual",
    reachUs: "Contáctenos",
    withOurThanks: "Con nuestro agradecimiento",
    director: "Por Sabrina Turizm · Director",
    cornerMark: "Sabrina Turizm · Estambul",
  },
  it: {
    docLabel: "Documento di viaggio ufficiale",
    docTitle: "VOUCHER",
    tag: "Tours, Transfers, Hotel",
    voucherNo: "Numero voucher",
    invoiceDate: "Data fattura",
    accountPayment: "Conto · Pagamento",
    packageEyebrow: "Il Pacchetto · Türkiye",
    eyebrowGroup: "Il Pacchetto · Türkiye",
    eyebrowDaily: "Tour giornaliero · Türkiye",
    eyebrowCustom: "Tour personalizzato · Türkiye",
    eyebrowHotel: "Soggiorno in hotel · Türkiye",
    eyebrowTransfer: "Trasferimento privato · Türkiye",
    sectionGuests: "Voucher per · Ospiti",
    sectionStay: "Soggiorno · Check-in & Check-out",
    sectionStayDaily: "Data del tour · Orario",
    sectionStayTransfer: "Ritiro e consegna",
    sectionPrice: "Pacchetto · Dettaglio prezzo",
    leadGuest: "Ospite principale",
    companion: "Accompagnatore",
    dateOfBirth: "Data di nascita",
    passport: "Passaporto",
    hotel: "Hotel",
    checkIn: "Check-in",
    fromTime: "dalle",
    checkOut: "Check-out",
    byTime: "entro",
    duration: "Durata",
    tourDate: "Data del tour",
    tourTime: "Orario",
    pickup: "Ritiro",
    dropoff: "Consegna",
    item: "Articolo",
    qty: "Qtà",
    unitPrice: "Prezzo unitario",
    total: "Totale",
    subtotal: "Subtotale",
    grandTotal: "Totale generale",
    children: "Bambini",
    singleRoom: "Camera singola",
    reachUs: "Contattaci",
    withOurThanks: "Con i nostri ringraziamenti",
    director: "Per Sabrina Turizm · Direttore",
    cornerMark: "Sabrina Turizm · Istanbul",
  },
  fr: {
    docLabel: "Document de voyage officiel",
    docTitle: "VOUCHER",
    tag: "Tours, Transfers, Hotel",
    voucherNo: "N° Voucher",
    invoiceDate: "Date facture",
    accountPayment: "Compte · Paiement",
    packageEyebrow: "Le Forfait · Türkiye",
    eyebrowGroup: "Le Forfait · Türkiye",
    eyebrowDaily: "Tour quotidien · Türkiye",
    eyebrowCustom: "Tour sur mesure · Türkiye",
    eyebrowHotel: "Séjour à l'hôtel · Türkiye",
    eyebrowTransfer: "Transfert privé · Türkiye",
    sectionGuests: "Voucher pour · Invités",
    sectionStay: "Séjour · Check-in & Check-out",
    sectionStayDaily: "Date du tour · Horaire",
    sectionStayTransfer: "Prise en charge & Dépose",
    sectionPrice: "Forfait · Détail du prix",
    leadGuest: "Invité principal",
    companion: "Accompagnant",
    dateOfBirth: "Date de naissance",
    passport: "Passeport",
    hotel: "Hôtel",
    checkIn: "Arrivée",
    fromTime: "à partir de",
    checkOut: "Départ",
    byTime: "avant",
    duration: "Durée",
    tourDate: "Date du tour",
    tourTime: "Horaire",
    pickup: "Prise en charge",
    dropoff: "Dépose",
    item: "Article",
    qty: "Qté",
    unitPrice: "Prix unitaire",
    total: "Total",
    subtotal: "Sous-total",
    grandTotal: "Total général",
    children: "Enfants",
    singleRoom: "Chambre individuelle",
    reachUs: "Nous contacter",
    withOurThanks: "Avec nos remerciements",
    director: "Pour Sabrina Turizm · Directeur",
    cornerMark: "Sabrina Turizm · Istanbul",
  },
  de: {
    docLabel: "Offizielles Reisedokument",
    docTitle: "VOUCHER",
    tag: "Tours, Transfers, Hotel",
    voucherNo: "Voucher-Nr.",
    invoiceDate: "Rechnungsdatum",
    accountPayment: "Konto · Zahlung",
    packageEyebrow: "Das Paket · Türkei",
    eyebrowGroup: "Das Paket · Türkei",
    eyebrowDaily: "Tagestour · Türkei",
    eyebrowCustom: "Individuelle Tour · Türkei",
    eyebrowHotel: "Hotelaufenthalt · Türkei",
    eyebrowTransfer: "Privater Transfer · Türkei",
    sectionGuests: "Voucher für · Gäste",
    sectionStay: "Aufenthalt · Check-in & Check-out",
    sectionStayDaily: "Tour-Datum · Zeitplan",
    sectionStayTransfer: "Abholung & Absetzen",
    sectionPrice: "Paket · Preisübersicht",
    leadGuest: "Hauptgast",
    companion: "Begleitperson",
    dateOfBirth: "Geburtsdatum",
    passport: "Reisepass",
    hotel: "Hotel",
    checkIn: "Ankunft",
    fromTime: "ab",
    checkOut: "Abreise",
    byTime: "bis",
    duration: "Dauer",
    tourDate: "Tour-Datum",
    tourTime: "Zeitplan",
    pickup: "Abholung",
    dropoff: "Absetzen",
    item: "Position",
    qty: "Anz.",
    unitPrice: "Einzelpreis",
    total: "Gesamt",
    subtotal: "Zwischensumme",
    grandTotal: "Gesamtbetrag",
    children: "Kinder",
    singleRoom: "Einzelzimmerzuschlag",
    reachUs: "Kontakt",
    withOurThanks: "Mit unserem Dank",
    director: "Für Sabrina Turizm · Direktor",
    cornerMark: "Sabrina Turizm · Istanbul",
  },
  ru: {
    docLabel: "Официальный туристический документ",
    docTitle: "ВАУЧЕР",
    tag: "Tours, Transfers, Hotel",
    voucherNo: "Номер ваучера",
    invoiceDate: "Дата счёта",
    accountPayment: "Счёт · Оплата",
    packageEyebrow: "Пакет · Türkiye",
    eyebrowGroup: "Пакет · Türkiye",
    eyebrowDaily: "Дневной тур · Türkiye",
    eyebrowCustom: "Индивидуальный тур · Türkiye",
    eyebrowHotel: "Проживание в отеле · Türkiye",
    eyebrowTransfer: "Частный трансфер · Türkiye",
    sectionGuests: "Ваучер · Гости",
    sectionStay: "Проживание · Заезд и выезд",
    sectionStayDaily: "Дата тура · Расписание",
    sectionStayTransfer: "Подача и высадка",
    sectionPrice: "Пакет · Детализация цены",
    leadGuest: "Главный гость",
    companion: "Сопровождающий",
    dateOfBirth: "Дата рождения",
    passport: "Паспорт",
    hotel: "Отель",
    checkIn: "Заезд",
    fromTime: "с",
    checkOut: "Выезд",
    byTime: "до",
    duration: "Продолжительность",
    tourDate: "Дата тура",
    tourTime: "Расписание",
    pickup: "Подача",
    dropoff: "Высадка",
    item: "Позиция",
    qty: "Кол-во",
    unitPrice: "Цена за единицу",
    total: "Итого",
    subtotal: "Промежуточный итог",
    grandTotal: "Общий итог",
    children: "Дети",
    singleRoom: "Одноместное размещение",
    reachUs: "Свяжитесь с нами",
    withOurThanks: "С нашей благодарностью",
    director: "От имени Sabrina Turizm · Директор",
    cornerMark: "Sabrina Turizm · Стамбул",
  },
  zh: {
    docLabel: "官方旅行文件",
    docTitle: "旅行凭证",
    tag: "Tours, Transfers, Hotel",
    voucherNo: "凭证号",
    invoiceDate: "开票日期",
    accountPayment: "账户 · 付款",
    packageEyebrow: "套餐 · Türkiye",
    eyebrowGroup: "团体套餐 · Türkiye",
    eyebrowDaily: "单日游 · Türkiye",
    eyebrowCustom: "定制游 · Türkiye",
    eyebrowHotel: "酒店住宿 · Türkiye",
    eyebrowTransfer: "私人接送 · Türkiye",
    sectionGuests: "凭证持有者 · 宾客",
    sectionStay: "住宿 · 入住与退房",
    sectionStayDaily: "游览日期 · 日程",
    sectionStayTransfer: "接送信息",
    sectionPrice: "套餐 · 价格明细",
    leadGuest: "主宾",
    companion: "同行宾客",
    dateOfBirth: "出生日期",
    passport: "护照",
    hotel: "酒店",
    checkIn: "入住",
    fromTime: "自",
    checkOut: "退房",
    byTime: "截至",
    duration: "时长",
    tourDate: "游览日期",
    tourTime: "日程",
    pickup: "接车地点",
    dropoff: "送达地点",
    item: "项目",
    qty: "数量",
    unitPrice: "单价",
    total: "合计",
    subtotal: "小计",
    grandTotal: "总金额",
    children: "儿童",
    singleRoom: "单人间入住",
    reachUs: "联系我们",
    withOurThanks: "致以谢意",
    director: "Sabrina Turizm · 总监",
    cornerMark: "Sabrina Turizm · 伊斯坦布尔",
  },
  ja: {
    docLabel: "公式旅行書類",
    docTitle: "バウチャー",
    tag: "Tours, Transfers, Hotel",
    voucherNo: "バウチャー番号",
    invoiceDate: "請求日",
    accountPayment: "口座 · お支払い",
    packageEyebrow: "パッケージ · トルコ",
    eyebrowGroup: "パッケージ · トルコ",
    eyebrowDaily: "日帰りツアー · トルコ",
    eyebrowCustom: "カスタムツアー · トルコ",
    eyebrowHotel: "ホテル滞在 · トルコ",
    eyebrowTransfer: "プライベート送迎 · トルコ",
    sectionGuests: "バウチャー · ご宿泊者",
    sectionStay: "ご滞在 · チェックイン & チェックアウト",
    sectionStayDaily: "ツアー日 · スケジュール",
    sectionStayTransfer: "お迎え & お送り",
    sectionPrice: "パッケージ · 料金内訳",
    leadGuest: "代表者",
    companion: "同行者",
    dateOfBirth: "生年月日",
    passport: "パスポート",
    hotel: "ホテル",
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
    subtotal: "小計",
    grandTotal: "総合計",
    children: "子供",
    singleRoom: "シングルルーム利用",
    reachUs: "お問い合わせ",
    withOurThanks: "感謝を込めて",
    director: "Sabrina Turizm · 代表",
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
