import { Language } from '@/types';

const translations: Record<string, Record<Language, string>> = {
  // Nav
  'nav.dashboard': { en: 'Dashboard', am: 'ዳሽቦርድ' },
  'nav.apartments': { en: 'Apartments', am: 'አፓርትመንቶች' },
  'nav.tenants': { en: 'Tenants', am: 'ተከራዮች' },
  'nav.billing': { en: 'Billing & Payments', am: 'ክፍያ እና ሂሳብ' },
  'nav.reports': { en: 'Reports', am: 'ሪፖርቶች' },
  'nav.settings': { en: 'Settings', am: 'ቅንብሮች' },

  // Common
  'common.save': { en: 'Save', am: 'አስቀምጥ' },
  'common.cancel': { en: 'Cancel', am: 'ይቅር' },
  'common.edit': { en: 'Edit', am: 'አርም' },
  'common.delete': { en: 'Delete', am: 'ሰርዝ' },
  'common.add': { en: 'Add', am: 'ጨምር' },
  'common.close': { en: 'Close', am: 'ዝጋ' },
  'common.paid': { en: 'Paid', am: 'ተከፍሏል' },
  'common.unpaid': { en: 'Unpaid', am: 'ያልተከፈለ' },
  'common.vacant': { en: 'Vacant', am: 'ባዶ' },
  'common.occupied': { en: 'Occupied', am: 'ተይዟል' },
  'common.total': { en: 'Total', am: 'ጠቅላላ' },
  'common.amount': { en: 'Amount', am: 'መጠን' },
  'common.date': { en: 'Date', am: 'ቀን' },
  'common.status': { en: 'Status', am: 'ሁኔታ' },
  'common.name': { en: 'Name', am: 'ስም' },
  'common.phone': { en: 'Phone', am: 'ስልክ' },
  'common.actions': { en: 'Actions', am: 'ተግባራት' },
  'common.month': { en: 'Month', am: 'ወር' },
  'common.etb': { en: 'ETB', am: 'ብር' },
  'common.generatePdf': { en: 'Generate PDF', am: 'PDF ፍጠር' },
  'common.download': { en: 'Download', am: 'አውርድ' },
  'common.language': { en: 'Language', am: 'ቋንቋ' },
  'common.english': { en: 'English', am: 'እንግሊዝኛ' },
  'common.amharic': { en: 'Amharic', am: 'አማርኛ' },
  'common.noData': { en: 'No data available', am: 'መረጃ የለም' },

  // Apartment
  'apt.floor': { en: 'Floor', am: 'ፎቅ' },
  'apt.front': { en: 'Front', am: 'ፊት' },
  'apt.back': { en: 'Back', am: 'ኋላ' },
  'apt.single': { en: 'Single', am: 'ነጠላ' },
  'apt.2ndFloor': { en: '2nd Floor', am: '2ኛ ፎቅ' },
  'apt.3rdFloor': { en: '3rd Floor', am: '3ኛ ፎቅ' },
  'apt.4thFloor': { en: '4th Floor', am: '4ኛ ፎቅ' },
  'apt.5thFloor': { en: '5th Floor', am: '5ኛ ፎቅ' },
  'apt.assignTenant': { en: 'Assign Tenant', am: 'ተከራይ መድብ' },
  'apt.removeTenant': { en: 'Remove Tenant', am: 'ተከራይ አስወግድ' },

  // Tenant
  'tenant.add': { en: 'Add Tenant', am: 'ተከራይ ጨምር' },
  'tenant.edit': { en: 'Edit Tenant', am: 'ተከራይ አርም' },
  'tenant.moveInDate': { en: 'Move-in Date', am: 'የመግቢያ ቀን' },
  'tenant.rentAmount': { en: 'Rent Amount', am: 'የኪራይ መጠን' },
  'tenant.rentCycle': { en: 'Payment Duration (months)', am: 'የክፍያ ቆይታ (በወር)' },
  'tenant.months': { en: 'months', am: 'ወር' },
  'tenant.rentStatus': { en: 'Rent Status', am: 'የኪራይ ሁኔታ' },
  'tenant.nextDue': { en: 'Next Rent Due', am: 'ቀጣይ ኪራይ' },
  'tenant.apartment': { en: 'Apartment', am: 'አፓርትመንት' },

  // Billing
  'bill.rent': { en: 'Rent', am: 'ኪራይ' },
  'bill.water': { en: 'Water', am: 'ውሃ' },
  'bill.electricity': { en: 'Electricity', am: 'ኤሌክትሪክ' },
  'bill.kwhUsed': { en: 'kWh Used', am: 'ኪሎ ዋት ሰዓት' },
  'bill.ratePerKwh': { en: 'Rate per kWh', am: 'በኪሎ ዋት ሰዓት ዋጋ' },
  'bill.baseCost': { en: 'Base Cost', am: 'መሠረታዊ ዋጋ' },
  'bill.serviceFee': { en: 'Service Fee', am: 'የአገልግሎት ክፍያ' },
  'bill.tvTax': { en: 'Television Tax', am: 'የቴሌቪዥን ግብር' },
  'bill.subtotal': { en: 'Subtotal', am: 'ንዑስ ድምር' },
  'bill.taxAmount': { en: 'Tax (15.5%)', am: 'ግብር (15.5%)' },
  'bill.totalBill': { en: 'Total Bill', am: 'ጠቅላላ ሂሳብ' },
  'bill.waterAmount': { en: 'Water Bill Amount', am: 'የውሃ ሂሳብ መጠን' },
  'bill.addPayment': { en: 'Add Payment', am: 'ክፍያ ጨምር' },
  'bill.markPaid': { en: 'Mark as Paid', am: 'ተከፍሏል ምልክት አድርግ' },
  'bill.paymentHistory': { en: 'Payment History', am: 'የክፍያ ታሪክ' },
  'bill.selectApartment': { en: 'Select Apartment', am: 'አፓርትመንት ምረጥ' },

  // Dashboard
  'dash.welcome': { en: 'Welcome, Manager', am: 'እንኳን ደህና መጡ' },
  'dash.overview': { en: 'Property Overview', am: 'የንብረት አጠቃላይ' },
  'dash.totalApartments': { en: 'Total Apartments', am: 'ጠቅላላ አፓርትመንቶች' },
  'dash.occupiedUnits': { en: 'Occupied', am: 'የተያዙ' },
  'dash.vacantUnits': { en: 'Vacant', am: 'ባዶ' },
  'dash.notifications': { en: 'Notifications', am: 'ማሳወቂያዎች' },
  'dash.recentPayments': { en: 'Recent Payments', am: 'የቅርብ ጊዜ ክፍያዎች' },
  'dash.rentDueSoon': { en: 'Rent due in {days} days', am: 'ኪራይ በ{days} ቀናት ውስጥ' },
  'dash.unpaidBills': { en: 'Unpaid Bills', am: 'ያልተከፈሉ ሂሳቦች' },

  // Reports
  'report.title': { en: 'Financial Reports', am: 'የገንዘብ ሪፖርቶች' },
  'report.totalIncome': { en: 'Total Income', am: 'ጠቅላላ ገቢ' },
  'report.totalPending': { en: 'Total Pending', am: 'ጠቅላላ በመጠባበቅ' },
  'report.occupancyRate': { en: 'Occupancy Rate', am: 'የተያዙ መጠን' },
  'report.byType': { en: 'Income by Type', am: 'በዓይነት ገቢ' },

  // Settings
  'settings.title': { en: 'Settings', am: 'ቅንብሮች' },
  'settings.language': { en: 'Interface Language', am: 'የበይነገጽ ቋንቋ' },
  'settings.languageDesc': { en: 'Choose the display language for the interface', am: 'ለበይነገጹ የሚታይ ቋንቋ ይምረጡ' },

  // PDF
  'pdf.billTitle': { en: 'Monthly Bill', am: 'ወርሃዊ ሂሳብ' },
  'pdf.billMonth': { en: 'Bill Period', am: 'የሂሳብ ወቅት' },
  'pdf.tenant': { en: 'Tenant', am: 'ተከራይ' },
  'pdf.item': { en: 'Item', am: 'ዝርዝር' },
  'pdf.details': { en: 'Details', am: 'ዝርዝር' },
  'pdf.totalDue': { en: 'Total Amount Due', am: 'ጠቅላላ የሚከፈል መጠን' },
  'pdf.generatedOn': { en: 'Generated on', am: 'የተፈጠረበት ቀን' },
  'pdf.signature': { en: 'Signature', am: 'ፊርማ' },
};

export function getTranslation(key: string, lang: Language, replacements?: Record<string, string>): string {
  let text = translations[key]?.[lang] || key;
  if (replacements) {
    Object.entries(replacements).forEach(([k, v]) => {
      text = text.replace(`{${k}}`, v);
    });
  }
  return text;
}

export function getApartmentLabel(floor: number, position: string, lang: Language): string {
  const floorKey = `apt.${floor === 2 ? '2nd' : floor === 3 ? '3rd' : floor === 4 ? '4th' : '5th'}Floor`;
  const floorLabel = getTranslation(floorKey, lang);
  if (position === 'single') return floorLabel;
  const posLabel = getTranslation(`apt.${position}`, lang);
  return `${floorLabel}: ${posLabel}`;
}
